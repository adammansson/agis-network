import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import prisma from './prisma/client';

const startServer = async () => {
    const app = express()
    const httpServer = createServer(app)

    const typeDefs = gql`
    type User {
        user_id: ID!
        email: String!
        name: String
        page: Page
    }
    type Page {
      page_id: ID!
      author_id: ID!
      author: User
      title: String!
      content: String
    }
    type Query {
      page(page_id: Int!): Page
    }
  `;

    const resolvers = {
        Query: {
            page: (parent: any, args: { page_id: number }, context: any, info: any) => {
                return prisma.page.findUnique({
                    where: {
                        page_id: args.page_id
                    }
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