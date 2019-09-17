
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";

import svgson from "svgson";

import fs from "fs";

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);


export class ImportProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "Import";
  }


  async create(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    if (args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }


  /**
   * Импортируем данные карт из svg-файлов
   */
  async importMapsFromSvg(args, info) {

    const {
      db,
    } = this.ctx;

    await db.mutation.deleteManyGeoObjects();
    await db.mutation.deleteManyGeoMaps();


    const inputSvgsPath = __dirname + "/../../maps/svg/";

    let files = fs.readdirSync(inputSvgsPath);

    const output = [];

    // console.log("files", files);

    // files = files.splice(0, 1);
    files = files.filter(name => [
      "world-low-res.svg",
      "chile-2.svg",
    ].indexOf(name) === -1);

    // files = files.filter(name => name === "world.svg");

    // console.log("files 2", files);

    await this.asyncForEach(files, async filename => {
      const path = `${inputSvgsPath}${filename}`;
      const svg = fs.readFileSync(path, 'utf8');

      await svgson.parse(svg)
        .then(async json => {

          let name = filename.split('.')[0];


          switch (name) {

            case "usa-with-AK-HI":

              name = "united-states";

              // console.log("name", name);

              break;

            default: ;
          }


          // return;


          const {
            children,
            attributes,
            ...other
          } = json;

          const {
            'mapsvg:geoViewBox': coordinates,
          } = attributes;

          // console.log("svgson json other", other);
          // console.log("svgson json coordinates", coordinates);

          if (!coordinates) {
            return false;
          }

          const {
            0: x_min,
            1: y_max,
            2: x_max,
            3: y_min,
          } = coordinates.split(" ");

          const bounds = {
            x_min: parseFloat(x_min),
            y_max: parseFloat(y_max),
            x_max: parseFloat(x_max),
            y_min: parseFloat(y_min),
          }

          // console.log("svgson json bounds", bounds);


          const layers = json.children
            .filter(({ name }) => name === 'path')
            .map(({ attributes }) => {

              // console.log("attributes.id", attributes.id);

              return {
                id: attributes.id.toLowerCase(),
                name: attributes.title || this.capitalize(attributes.id),
                d: attributes.d,
              };
            });




          const nameCapitalized = this.capitalize(name.split('-').join(' '));

          const viewBox = `0 0 ${parseFloat(json.attributes.width)} ${parseFloat(json.attributes.height)}`;

          const map = {
            id: name,
            name: nameCapitalized,
            viewBox,
            // layers,
          };

          output.push({
            name: nameCapitalized,
            filename,
            map,
          });

          // console.log("map", map);

          const map_data = {
            name: nameCapitalized,
            viewBox,
            ...bounds,
          }


          // console.log("map_data", map_data);

          const GeoMap = await db.mutation.createGeoMap({
            data: map_data,
          })
            .catch(error => {

              console.error("console.error", error);

            });


          if (!GeoMap) {
            return;
          }


          const {
            id: geoMapId,
          } = GeoMap;

          await this.asyncForEach(layers, async layer => {

            const {
              id: key,
              name,
              d,
            } = layer;

            await db.mutation.createGeoObject({
              data: {
                key,
                name,
                d,
                GeoMap: {
                  connect: {
                    id: geoMapId,
                  },
                },
              },
            })
              .catch(error => {

                console.error("error layer", layer);

                // throw error;
              })
              ;

          });


          // fs.writeFileSync(`${this.outputJsonPath}\\${name}.json`, stringify(map));
        });
    });

    // if (this.outputSummary) {
    //   fs.writeFileSync(`${this.outputJsonPath}\\..\\summary.json`, stringify(output));
    // }

    return output;

  }

  async asyncForEach(a, cb) {
    for (let i = 0; i < a.length; i += 1) {
      await cb(a[i], i, a);
    }
  };

  capitalize(s) {
    return s
      .toLowerCase()
      .split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }
}


export default class ImportModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return ImportProcessor;
  }


  getResolvers() {

    // const {
    //   Query: {
    //     ...Query
    //   },
    //   Subscription: {
    //     ...Subscription
    //   },
    //   Mutation: {
    //     ...Mutation
    //   },
    //   ...other
    // } = super.getResolvers();

    return {
      // ...other,
      // Query: {
      //   ...Query,
      //   import: (source, args, ctx, info) => {
      //     return ctx.db.query.import(args, info);
      //   },
      //   imports: (source, args, ctx, info) => {
      //     return ctx.db.query.imports(args, info);
      //   },
      //   importsConnection: (source, args, ctx, info) => {
      //     return ctx.db.query.importsConnection(args, info);
      //   },
      // },
      Mutation: {
        // ...Mutation,
        // createImportProcessor: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).createWithResponse("Import", args, info);
        // },
        // updateImportProcessor: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).updateWithResponse("Import", args, info);
        // },
        // deleteImport: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).delete("Import", args, info);
        // },
        importMapsFromSvg: (source, args, ctx, info) => {

          return this.getProcessor(ctx).importMapsFromSvg(args, info);
        },
      },
      // Subscription: {
      //   ...Subscription,
      //   import: {
      //     subscribe: async (parent, args, ctx, info) => {

      //       return ctx.db.subscription.import({}, info);
      //     },
      //   },
      // },
      // ImportResponse: {
      //   data: (source, args, ctx, info) => {

      //     const {
      //       id,
      //     } = source.data || {};

      //     return id ? ctx.db.query.import({
      //       where: {
      //         id,
      //       },
      //     }, info) : null;
      //   },
      // },
    }

  }

}