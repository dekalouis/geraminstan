import User from "../models/user.js";

/*
posts: [Post]
 followers: [Follow]
 following: [Follow]
 */

export const typeDefs = `#graphql
type User {
 _id: ID!
 name: String
 username: String!
 email: String!
 password: String!
 followerData: [User]
 followingData: [User]
 posts: [Post]
}

type Follow {
  _id: ID!
  followerId: ID!
  followingId: ID!
  createdAt: String
  updatedAt: String
}

input LoginInput {
    email: String
    password: String
  }

input RegisterInput {
    name: String
    email: String
    username: String
    password: String
  }

type Query {
    users: [User]
    login(payload: LoginInput): String
    searchUsers(searchTerm: String!): [User]
    getUserById(id: ID!): User

  }

type Mutation {
    register(payload: RegisterInput): String
    followUser(followingId: ID!): String
    unfollowUser(followingId: ID!): String

  }

 `;

export const resolvers = {
  Query: {
    users: async function (_, __, { authN }) {
      const user = await authN();
      const users = await User.findAll();
      return users;
    },
    login: async function (_, args) {
      const { payload } = args;
      const token = await User.login(payload);

      return token;
    },

    searchUsers: async function (_, { searchTerm }, { authN }) {
      const user = await authN();
      return await User.searchUsers(searchTerm);
    },
    getUserById: async function (_, args, { authN }) {
      const { id } = args;
      const user = await authN();
      return await User.getUserById(id);
    },

    // getMyProfile: async function (_, __, { authN }) {
    //   const user = await authN();
    //   return user;
    // },
  },

  Mutation: {
    register: async function (_, args) {
      const { payload } = args;
      const message = await User.register(payload);

      return message;
    },
    followUser: async function (_, { followingId }, { authN }) {
      const user = await authN();
      return await User.followUser(user._id, followingId);
    },
    unfollowUser: async function (_, { followingId }, { authN }) {
      const user = await authN();
      return await User.unfollowUser(user._id, followingId);
    },
  },
};
