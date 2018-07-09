const { GraphQLServer } = require('graphql-yoga');

// Defining GraphQL schema
const typeDefs = `
  type Query {
    info: String!
  }
`;

// The actual implementation of the GraphQL schema
const resolvers = {
  Query: {
    info: () => 'This is the GraphQL API',
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
