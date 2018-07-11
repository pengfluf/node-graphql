async function feed(root, args, context, info) {
  let where = {};

  if (args.filter) {
    where = {
      OR: [
        { url_contains: args.filter },
        { description_contains: args.filter },
      ],
    };
  }

  const queriedLinks = await context.db.query.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy,
  });

  const countSelectionSet = `
    {
      aggregate {
        count
      }
    }
  `;

  const linksConnection = await context.db.query.linksConnection({}, countSelectionSet);

  return {
    count: linksConnection.aggregate.count,
    linkIDs: queriedLinks.map((item) => item.id),
  };
}

function link(root, args, context, info) {
  return context.db.query.link({
    where: {
      id: args.id,
    },
  }, info);
}

module.exports = {
  feed,
  link,
};
