
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";

import fs from "fs";


let maps = [];


// fs.readdir(process.cwd() + '/node_modules/@south-paw/react-vector-maps/maps/json/', (err, files) => {
//   if (err) {
//     throw (err);
//   }

//   if (files && files.length) {

//     files.map(filename => {


//     });

//   }

// });

const path = process.cwd() + '/node_modules/@south-paw/react-vector-maps/maps/json/';

fs.readdirSync(path).forEach(filename => {
  // console.log("filename", filename);

  const name = filename.replace(/\.json$/, '');

  // console.log("path", path + filename);

  const svg = fs.readFileSync(path + filename, 'utf8');

  const map = {
    name,
    svg: JSON.parse(svg),
  };

  /**
   * Make immutable
   */
  Object.freeze(map);

  maps.push(map);

  return null;

});


// console.log("cache", cache);

export class MapProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "Map";
  }


  // async create(method, args, info) {

  //   if (args.data) {

  //     let {
  //       ...data
  //     } = args.data;

  //     args.data = data;

  //   }

  //   return super.create(method, args, info);
  // }


  // async update(method, args, info) {

  //   if (args.data) {

  //     let {
  //       ...data
  //     } = args.data;

  //     args.data = data;

  //   }

  //   return super.update(method, args, info);
  // }


  // async mutate(method, args, info) {

  //   if (args.data) {

  //     let {
  //       ...data
  //     } = args.data;

  //     args.data = data;

  //   }

  //   return super.mutate(method, args);
  // }



  // async delete(method, args, info) {

  //   return super.delete(method, args);
  // }


  // getMapsDir() {
  //   return process.cwd() + '/node_modules/@south-paw/react-vector-maps/maps/json/';
  // }

  async maps(args, info) {

    // console.log("args", args);

    // return new Promise((resolve, reject) => {

    //   const {
    //     where,
    //   } = args;

    //   const {
    //     name,
    //     name_in,
    //   } = where || {};

    //   fs.readdir(this.getMapsDir(), (err, files) => {
    //     if (err) {
    //       reject(err);
    //       return;
    //     }
    //     // console.log(files);

    //     let result = files ? files.map(n => n.replace(/\.json$/, '')) : [];

    //     if (name_in && name_in.length) {
    //       result = result.filter(n => name_in.indexOf(n) !== -1);
    //     }

    //     if (name) {
    //       result = result.filter(n => n === name);
    //     }

    //     resolve(result);
    //   });

    // });

    const {
      where,
    } = args;

    const {
      name,
      name_in,
    } = where || {};

    let result = maps.slice(0);

    if (name_in && name_in.length) {
      result = result.filter(({ name }) => name_in.indexOf(name) !== -1);
    }

    if (name) {
      result = result.filter(n => n.name === name);
    }

    return result;
  }

  async map(args, info) {

    const maps = await this.maps(args, info);

    // // console.log("maps.length", maps.length);

    return maps ? maps[0] : null;

  }
}


export default class MapModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return MapProcessor;
  }


  getResolvers() {

    const {
      Query: {
        ...Query
      },
      Subscription: {
        ...Subscription
      },
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
        map: (source, args, ctx, info) => {
          return this.getProcessor(ctx).map(args, info);
        },
        maps: (source, args, ctx, info) => {
          return this.getProcessor(ctx).maps(args, info);
        },
        // mapsConnection: (source, args, ctx, info) => {
        //   return ctx.db.query.mapsConnection(args, info);
        // },
      },
      // Mutation: {
      //   ...Mutation,
      //   createMapProcessor: (source, args, ctx, info) => {
      //     return this.getProcessor(ctx).createWithResponse("Map", args, info);
      //   },
      //   updateMapProcessor: (source, args, ctx, info) => {
      //     return this.getProcessor(ctx).updateWithResponse("Map", args, info);
      //   },
      //   deleteMap: (source, args, ctx, info) => {
      //     return this.getProcessor(ctx).delete("Map", args, info);
      //   },
      // },
      // Subscription: {
      //   ...Subscription,
      //   map: {
      //     subscribe: async (parent, args, ctx, info) => {

      //       return ctx.db.subscription.map({}, info);
      //     },
      //   },
      // },
      // MapResponse: {
      //   data: (source, args, ctx, info) => {

      //     const {
      //       id,
      //     } = source.data || {};

      //     return id ? ctx.db.query.map({
      //       where: {
      //         id,
      //       },
      //     }, info) : null;
      //   },
      // },
    }

  }

}