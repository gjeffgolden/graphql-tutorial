const { ApolloServer } = require('apollo-server');

let links = [{
    id: 'link-0',
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
}, {
    id: 'link-1',
    url: "wwww.google.com",
    description: "Search engine."
}]

//rudimentary way of generating dynamic ID
let idCount = links.length

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (root, { id }) => {
            const link = links.find(link => link.id === id)
            return link
        },
    },
    Mutation: {
        post: (parent, args) => {
            //create link object
            //args come from schema
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            }
            links.push(link)
            return link
        },
        updateLink: (root, args) => {
            const link = links.find(link => link.id === args.id)
            link = {...link, ...args }
            return link;
        },
        deleteLink: (parent, { id }) => {
            const removeIndex = links.findIndex(link => link.id === id);
            const removedLink = links[removeIndex];
            links.splice(removeIndex, 1);
            return removedLink;
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
    resolvers
})

server
    .listen()
    .then(({ url }) => 
        console.log(`Server is running on ${url}`)
    )

