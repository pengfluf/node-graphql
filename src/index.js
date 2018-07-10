const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

// The actual implementation of the GraphQL schema
const resolvers = {
  Query: {
    info: () => 'This is the GraphQL API',

    feed: (root, args, context, info) => context.db.query.links({}, info),

    link: (root, args) => {
      const link = links
        .find((item) => item.id === args.id);
      if (link) return link;
      return null;
    },
  },

  Mutation: {
    postLink: (root, args, context, info) => context.db.mutation.createLink({
      data: {
        url: args.url,
        description: args.description,
      },
    }, info),

    // updateLink: (root, args) => {
    //   const linkIndex = links
    //     .findIndex((item) => item.id === args.id);
    //   if (linkIndex !== -1) {
    //     const link = { ...links[linkIndex] };
    //     if (args.url) {
    //       link.url = args.url;
    //     }
    //     if (args.description) {
    //       link.description = args.description;
    //     }
    //     links.splice(linkIndex, 1, link);
    //     return link;
    //   }
    //   return null;
    // },
    //
    // deleteLink: (root, args) => {
    //   const linkIndex = links
    //     .findIndex((item) => item.id === args.id);
    //   if (linkIndex !== -1) {
    //     const link = { ...links[linkIndex] };
    //     links.splice(linkIndex, 1);
    //     return link;
    //   }
    //   return null;
    // },
  },
};

// Passing our definitions and resolvers
// into the actual graphql-yoga server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req) => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/john-doe-507d96/node-graphql/dev',
      debug: true,
    }),
  }),
});

// Start the server
server.start(() => console.log('Server is running on http://localhost:4000'));
