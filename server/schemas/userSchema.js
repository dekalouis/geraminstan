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
    followUser(followerId: ID!, followingId: ID!): String
  }

 `;

export const resolvers = {
  Query: {
    users: async function () {
      const users = await User.findAll();
      return users;
    },
    login: async function (_, args) {
      const { payload } = args;
      const token = await User.login(payload);

      return token;
    },
    searchUsers: async function (_, { searchTerm }) {
      return await User.searchUsers(searchTerm);
    },
    getUserById: async function (_, args) {
      const { id } = args;
      return await User.getUserById(id);
    },
  },

  Mutation: {
    register: async function (_, args) {
      const { payload } = args;
      const message = await User.register(payload);

      return message;
    },
    followUser: async function (_, { followerId, followingId }) {
      return await User.followUser(followerId, followingId);
    },
  },
};
