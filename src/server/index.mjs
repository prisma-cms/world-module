

import {
  modifyArgs,
  PrismaCmsServer,
} from "@prisma-cms/server";

import CoreModule, {
  Modules,
} from "../";


const coreModule = new CoreModule({
  modules: Modules,
});

const resolvers = coreModule.getResolvers();

// console.log("resolvers", resolvers);


class PrismaCmsServerCustom extends PrismaCmsServer {

  // getServer() {
  //   const server = super.getServer();
  //   return server;
  // }


  // processRequest(request) {

  //   return super.processRequest({
  //     ...request,
  //   });
  // }

}


const startServer = function (options) {

  return new PrismaCmsServerCustom(options).startServer();

}


startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
  contextOptions: {
    modifyArgs,
    resolvers,
  },
});


