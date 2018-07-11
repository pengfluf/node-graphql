function links(root, args, context, info) {
  return context.db.query.links({
    where: {
      id_in: root.linkIDs,
    },
  }, info);
}

module.exports = {
  links,
};
