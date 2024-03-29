import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { TagsResolver } from "./resolvers/Tags";
import { dataSource } from "./db";
import { AdsResolver } from "./resolvers/Ads";
import { CategoriesResolver } from "./resolvers/Categories";
import { UsersResolver } from "./resolvers/Users";
import { ContextType, customAuthChecker } from "./auth";
import express from "express";
import http from "http";
import cors from "cors";

async function start() {
  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [TagsResolver, AdsResolver, CategoriesResolver, UsersResolver],
    authChecker: customAuthChecker,
  });

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<ContextType>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/",
    cors<cors.CorsRequest>({
      origin: "http://localhost:3000",
      credentials: true,
    }),
    express.json({ limit: "50mb" }),
    expressMiddleware(server, {
      context: async (args) => {
        return {
          req: args.req,
          res: args.res,
        };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:5000/`);
}

start();
