import dotenv from "dotenv";
dotenv.config();

// console.log(
//   "Environment loaded. MongoDB URI exists:",
//   !!process.env.MONGODB_URI
// );

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  resolvers as userResolvers,
  typeDefs as userTypeDefs,
} from "./schemas/userSchema.js";
import {
  resolvers as postResolvers,
  typeDefs as postTypeDefs,
} from "./schemas/postSchema.js";

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs],
  resolvers: [userResolvers, postResolvers],
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
});

console.log(`🚀  Server ready at: ${url}`);
