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
import User from "./models/user.js";
import jwt from "jsonwebtoken";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs],
  resolvers: [userResolvers, postResolvers],
  introspection: true,
  //BIAR WEBNYA LANGSUNG KE SANDBOX
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({
      embed: true,
    }),
  ],
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },

  context: async function ({ req, res }) {
    const authN = async function () {
      let token = "";
      if (req.headers?.authorization) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (token === "") throw new Error("Unauthorized");

      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(payload._id);
      if (!user) throw new Error("Unauthorized");

      return user;
    };

    return {
      authN,
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
