const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const AuthPayload = require('./resolvers/AuthPayload');
const Feed = require('./resolvers/Feed');

// The actual implementation of the GraphQL schema
const resolvers = {
  Query,
  Mutation,
  Subscription,
  AuthPayload,
  Feed,
};

// Passing our definitions and resolvers
// into the actual graphql-yoga server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req) => ({
    ...req,
    db: new Prisma({
      typeDefs: './src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/john-doe-507d96/node-graphql/dev',
      debug: true,
    }),
  }),
});

// Start the server
server.start(() => console.log('Server is running on http://localhost:4000'));
