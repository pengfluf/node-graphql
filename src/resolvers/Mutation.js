const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserID } = require('../utils');

function postLink(root, args, context, info) {
  const userID = getUserID(context);
  return context.db.mutation.createLink({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: {
          id: userID,
        },
      },
    },
  }, info);
}

function updateLink(root, args, context, info) {
  return context.db.mutation.updateLink({
    data: {
      url: args.url,
      description: args.description,
    },
    where: {
      id: args.id,
    },
  }, info);
}

function deleteLink(root, args, context, info) {
  return context.db.mutation.deleteLink({
    where: {
      id: args.id,
    },
  }, info);
}

async function signup(root, args, context) {
  // Encrypting the password
  const password = await bcrypt.hash(args.password, 10);
  // Creating the new user using the Prisma binding
  const user = await context.db.mutation.createUser({
    data: {
      ...args,
      password,
    },
  }, '{ id }');
  // Generating a JWT signed with an APP_SECRET
  const token = jwt.sign({ userID: user.id }, APP_SECRET);
  // Just returning token and user info
  return {
    token,
    user,
  };
}

async function login(root, args, context) {
  // Get user info
  const user = await context.db.query.user({
    where: {
      email: args.email,
    },
  }, ' { id password } ');
  if (!user) {
    throw new Error('No such user found');
  }

  // Password validation
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  // JWT generating
  const token = jwt.sign({ userID: user.id }, APP_SECRET);

  // And just returning the token
  return {
    token,
    user,
  };
}

async function vote(root, args, context, info) {
  const userID = getUserID(context);

  const link = await context.db.exists.Vote({
    user: {
      id: userID,
    },
    link: {
      id: args.linkID,
    },
  });
  if (link) {
    throw new Error(`Already voted for the link with ID ${args.linkID} `);
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: {
          connect: {
            id: userID,
          },
        },
        link: {
          connect: {
            id: args.linkID,
          },
        },
      },
    },
    info
  );
}

module.exports = {
  postLink,
  updateLink,
  deleteLink,
  signup,
  login,
  vote,
};
