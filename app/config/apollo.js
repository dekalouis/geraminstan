import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
  uri: "https://807e-118-137-19-20.ngrok-free.app",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync("userToken");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(`ERROR!! ${message}, location: ${locations}, path: ${path}`);

      if (message === "Unauthorized") {
        SecureStore.deleteItemAsync("userToken");
        //NAVIGASINYA DI AUTHPROVIDER
      }
    });

  if (networkError) console.log(`Network error!! ${networkError}`);
});

const link = ApolloLink.from([errorLink, authLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
