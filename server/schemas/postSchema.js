import Post from "../models/post.js";

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
  },
  Mutation: {
    register: async function (_, args) {
      const { payload } = args;
      const message = await User.register(payload);

      return message;
    },
  },
};
