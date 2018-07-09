const { GraphQLServer } = require('graphql-yoga');

// Temporary, using until implementing
// persistent storage
const links = [{
  id: 'link-1',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL',
}];

// The actual implementation of the GraphQL schema
const resolvers = {
  Query: {
    info: () => 'This is the GraphQL API',
    feed: () => links,
    link: (root, args) => {
      const link = links
        .find((item) => item.id === args.id);
      if (link) return link;
      return null;
    },
  },

  Mutation: {
    postLink: (root, args) => {
      const link = {
        id: `link-${links.length + 1}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },

    updateLink: (root, args) => {
      const linkIndex = links
        .findIndex((item) => item.id === args.id);
      if (linkIndex !== -1) {
        const link = { ...links[linkIndex] };
        if (args.url) {
          link.url = args.url;
        }
        if (args.description) {
          link.description = args.description;
        }
        links.splice(linkIndex, 1, link);
        return link;
      }
      return null;
    },

    deleteLink: (root, args) => {
      const linkIndex = links
        .findIndex((item) => item.id === args.id);
      if (linkIndex !== -1) {
        const link = { ...links[linkIndex] };
        links.splice(linkIndex, 1);
        return link;
      }
      return null;
    },
  },
};

// Passing our definitions and resolvers
// into the actual graphql-yoga server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

// Start the server
server.start(() => console.log('Server is running on http://localhost:4000'));
