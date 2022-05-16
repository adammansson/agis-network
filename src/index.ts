import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import prisma from './prisma/client';
import { readFileSync } from "fs";
import { Resolvers } from "./generated/graphql";

const startServer = async () => {
    const app = express()
    const httpServer = createServer(app)

    const typeDefs = readFileSync("./src/schema.graphql", "utf8");

    const resolvers: Resolvers = {
        Query: {
            user: (parent: any, { id }, context: any, info: any) => {
                return prisma.user.findUnique({
                    where: {
                        id,
                    }
                });
            },

            users: () => {
                return prisma.user.findMany();
            },

            page: (parent: any, { id }, context: any, info: any) => {
                return prisma.page.findUnique({
                    where: {
                        id,
                    }
                });
            },

            pages: () => {
                return prisma.page.findMany();
            },
        },
        Mutation: {
            user: () => ({})
        },
        UserMutations: {
            create: (parent: any, { email, name }, context: any, info: any) => {
                return prisma.user.create({
                    data: {
                        email,
                        name,
                        page: {
                            create: {
                                title: "no title",
                                content: "no text",
                            }
                        }
                    }
                });
            },
        },
    };

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
    })

    await apolloServer.start()

    apolloServer.applyMiddleware({
        app,
        path: '/api'
    })

    httpServer.listen({ port: process.env.PORT || 4000 }, () =>
        console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
    )
}

startServer()