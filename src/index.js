const { GraphQLServer } = require('graphql-yoga');
const feedResolver = require('./resolvers/feed');

// Defining GraphQL schema
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

// The actual implementation of the GraphQL schema
const resolvers = {
  Query: {
    info: () => 'This is the GraphQL API',
    feed: feedResolver,
  },
  Link: {
    id: (root) => root.id,
    description: (root) => root.description,
    url: (root) => root.url,
  },
};

// Passing our definitions and resolvers
// into the actual graphql-yoga server
const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

// Start the server
server.start(() => console.log('Server is running on http://localhost:4000'));
