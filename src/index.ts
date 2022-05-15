import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import prisma from './prisma/client';
import { readFileSync } from "fs";
import { Resolvers } from "./generated/graphql";

const startServer = async () => {
    const app = express()
    const httpServer = createServer(app)

    const typeDefs = readFileSync("./schema.graphql", "utf8");

    const resolvers: Resolvers = {
        Query: {
            pages: async() => {
                return prisma.page.findMany();
            },
            page: (parent: any, { page_id }, context: any, info: any) => {
                return prisma.page.findUnique({
                    where: {
                        page_id,
                    }
                });
            },
        },
        Mutation: {
            page: () => ({}),
            user: () => ({})
        },
        PageMutations: {
            create: (parent: any, { user_id, title, content }, context: any, info: any) => {
                return prisma.page.create({
                    data: {
                        author: { connect: { user_id } },
                        title,
                        content,
                    },
                });
            },
            update: (parent: any, { page_id, title, content }, context: any, info: any) => {
                return prisma.page.update({
                    where: {
                        page_id,
                    },
                    data: {
                        title: title || undefined,
                        content: content || undefined,
                    },
                });
            },
        },
        UserMutations: {
            create: (parent: any, { email, name }, context: any, info: any) => {
                return prisma.user.create({
                    data: {
                        email,
                        name,
                    }
                });
            },
            update: (parent: any, { user_id, email, name }, context: any, info: any) => {
                return prisma.user.update({
                    where: {
                        user_id,
                    },
                    data: {
                        email: email || undefined,
                        name: name || undefined,
                    },
                });
            },
        },
    };

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
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