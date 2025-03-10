import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [
  {
    id: 1,
    name: "Deka",
    username: "bezitoz",
    email: "deka@mail.com",
    password: "testing",
  },
  {
    id: 2,
    name: "Putri",
    username: "pqcs",
    email: "putri@mail.com",
    password: "testing",
  },
];

const typeDefs = `#graphql
  type User {
    id: ID
    name: String
    username: String
    email: String
    password: String
}
    type Query {
        users: [User]
        user(id: ID): User
    }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (_, args) => {
      return users.find((user) => user.id === +args.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
});

console.log(`🚀  Server ready at: ${url}`);
