const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                }
            })
            return newLink
        }
    }
}


const fs = require('fs');
const path = require('path');

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf-8'
    ),
    resolvers,
    context: {
        prisma,
        //allows access to context.prisma obj in all resolvers
    }
})

server
    .listen()
    .then(({ url }) => 
        console.log(`Server is running on ${url}`)
    )

