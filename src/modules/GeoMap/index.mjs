
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class GeoMapProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "GeoMap";
  }


  async create(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if(args.data) {

      let {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    if(args.data) {

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
}


export default class GeoMapModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return GeoMapProcessor;
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
        geoMap: (source, args, ctx, info) => {
          return ctx.db.query.geoMap(args, info);
        },
        geoMaps: (source, args, ctx, info) => {
          return ctx.db.query.geoMaps(args, info);
        },
        geoMapsConnection: (source, args, ctx, info) => {
          return ctx.db.query.geoMapsConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createGeoMapProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("GeoMap", args, info);
        },
        updateGeoMapProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("GeoMap", args, info);
        },
        deleteGeoMap: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("GeoMap", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        geoMap: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.geoMap({}, info);
          },
        },
      },
      GeoMapResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.geoMap({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}