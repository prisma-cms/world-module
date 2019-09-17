
import fs from "fs";

import chalk from "chalk";

import PrismaModule from "@prisma-cms/prisma-module";

import MergeSchema from 'merge-graphql-schemas';

import path from 'path';

const moduleURL = new URL(import.meta.url);

const __dirname = path.dirname(moduleURL.pathname);

const { createWriteStream, unlinkSync } = fs;

const { fileLoader, mergeTypes } = MergeSchema

import osme from 'osme';

const {
  default: osmeRegions,
} = osme;

// console.log("osmeRegions", osmeRegions);


class Module extends PrismaModule {


  constructor(props = {}) {

    super(props);

    Object.assign(this, {
    });

  }


  getSchema(types = []) {


    let schema = fileLoader(__dirname + '/schema/database/', {
      recursive: true,
    });


    if (schema) {
      types = types.concat(schema);
    }


    let typesArray = super.getSchema(types);

    return typesArray;

  }


  getApiSchema(types = []) {


    let baseSchema = [];

    let schemaFile = __dirname + "/../schema/generated/prisma.graphql";

    if (fs.existsSync(schemaFile)) {
      baseSchema = fs.readFileSync(schemaFile, "utf-8");
    }

    let apiSchema = super.getApiSchema(types.concat(baseSchema), []);

    let schema = fileLoader(__dirname + '/schema/api/', {
      recursive: true,
    });

    apiSchema = mergeTypes([apiSchema.concat(schema)], { all: true });


    return apiSchema;

  }


  async osme(source, args, ctx, info) {

    const {
      with_coordinates,
      where: {
        name,
        osmId_not_in,
      },
    } = args;

    const result = osmeRegions.geoJSON(name, { lang: "ru", quality: 0 })
      .then((data) => {
        // var collection = osmeRegions.toYandex(data);
        // osmeRegions.geoJSON("world", {lang: "ru", quality: 0}, function (data) { 
        //....

        // console.log("osme data", data);

        let {
          features,
          ...other
        } = data;


        if (with_coordinates) {
          // features = features.filter(n => (
          //   n.geometry.coordinates && n.geometry.coordinates.length
          //   && n.geometry.path && n.geometry.path.length
          //   && n.geometry.fixedPoints && n.geometry.fixedPoints.length
          // ));
        }


        if (osmId_not_in && osmId_not_in.length) {
          features = features.filter(n => osmId_not_in.indexOf(n.properties.osmId) === -1);
        }


        // console.log("features", features);

        // const empty = features.find(n => !n.geometry.coordinates || !n.geometry.coordinates.length);

        // console.log("features empty", empty);

        // features = features.splice(0, 3);

        return {
          ...other,
          features,
        };
      });

    return result;
  }


  getResolvers() {

    const {
      Query,
      // Mutation,
      Subscription,
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
        osme: this.osme,
      },
      // Mutation: {
      //   ...Mutation,
      // },
      // Subscription: {
      //   ...Subscription,
      // },
    };
  }


}


export default Module;