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
    login(payload: LoginInput): String
    searchUsers(searchTerm: String!): [User]
    

  }

type Mutation {
    register(payload: RegisterInput): String
  }

 `;

export const resolvers = {
  Query: {
    login: async function (_, args) {
      const { payload } = args;
      const token = await User.login(payload);

      return token;
    },
    searchUsers: async function (_, { searchTerm }) {
      return await User.searchUsers(searchTerm);
    },
  },

  Mutation: {
    register: async function (_, args) {
      const { payload } = args;
      const message = await User.register(payload);

      return message;
    },
  },
};
