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
        author: User
        title: String!
        content: String
    }
    type Query {
        user(user_id: Int!): User
        pages: [Page]
        page(page_id: Int!): Page
    }
    type Mutation {
        user: UserMutations
        page: PageMutations
    }
    type UserMutations {
        create(email: String!, name: String): User
        update(user_id: ID!, email: String, name: String): User
    }
    type PageMutations {
        create(user_id: ID!, title: String!, content: String!): Page
        update(page_id: ID!, title: String, content: String): Page
    }
  `;

    const resolvers = {
        Query: {
            pages: () => {
                return prisma.page.findMany();
            },
            page: (parent: any, { page_id }: { page_id: number }, context: any, info: any) => {
                return prisma.page.findUnique({
                    where: {
                        page_id
                    }
                });
            },
        },
        Mutation: {
            page: () => ({}),
            user: () => ({})
        },
        PageMutations: {
            create: (parent: any, { user_id, title, content }: { user_id: number, title: string, content: string }, context: any, info: any) => {
                return prisma.page.create({
                    data: {
                        author: { connect: { user_id } },
                        title,
                        content,
                    },
                });
            },
            update: (parent: any, { page_id, title, content }: { page_id: number, title?: string, content?: string }, context: any, info: any) => {
                return prisma.page.update({
                    where: {
                        page_id,
                    },
                    data: {
                        title,
                        content,
                    },
                });
            },
        },
        UserMutations: {
            create: (parent: any, { email, name }: { email: string, name?: string }, context: any, info: any) => {
                return prisma.user.create({
                    data: {
                        email,
                        name,
                    }
                });
            },
            update: (parent: any, { user_id, email, name }: { user_id: number, email?: string, name?: string }, context: any, info: any) => {
                return prisma.user.update({
                    where: {
                        user_id,
                    },
                    data: {
                        email,
                        name,
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