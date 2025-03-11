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

input LoginInput {
    email: String
    password: String
  }

input UserRegister {
    name: String
    email: String
    username: String
    password: String
  }

type Query {
    users: [User]
    user(id: ID): User
    login(payload: LoginInput): String
  }

type Mutation {
    register(payload: UserRegister): String
  }

 `;

export const resolvers = {
  Query: {
    users: async function () {
      const users = await User.findAll();
      return users;
    },
    user: async function (_, args) {
      const user = await User.findById(args.id);
      return user;
    },
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
