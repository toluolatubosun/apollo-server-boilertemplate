import cors from "cors";
import express from "express";
import depthLimit from "graphql-depth-limit";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from "@apollo/server/plugin/landingPage/default";

import typeDefs from "./schema";
import resolvers from "./resolvers";
import { NODE_ENV, PORT } from "../config";
import auth from "../middlewares/graphql/auth.middleware";
import { handleError } from "../utils/graphql/custom-error";

import type { Server } from "http";
import type { Application } from "express";

export default async (app: Application, httpServer: Server) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: handleError,
        validationRules: [depthLimit(10)],
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            NODE_ENV === "production"
                ? ApolloServerPluginLandingPageProductionDefault({ graphRef: "my-graph-id@my-graph-variant", footer: false })
                : ApolloServerPluginLandingPageLocalDefault({ footer: false })
        ]
    });

    await server.start();

    app.use(
        "/graphql",
        express.json(),
        cors<cors.CorsRequest>({
            origin: "*"
        }),
        expressMiddleware(server, {
            context: async ({ req, res }: any) => {
                const user = await auth(req.headers.authorization);
                return {
                    res,
                    user
                };
            }
        })
    );

    await new Promise<void>((resolve) => httpServer.listen({ port: PORT as number }, resolve));

    console.log(`:::> 🚀 GQL Server ready at http://localhost:${PORT}/graphql`);

    return server;
};
