import { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useApolloClient } from "@apollo/client";
import { Buffer } from "buffer";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const client = useApolloClient();

  const login = async (token) => {
    try {
      await SecureStore.setItemAsync("userToken", token);
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(
        Buffer.from(base64Payload, "base64").toString()
      );
      await SecureStore.setItemAsync("userId", payload._id);

      setUserToken(token);
      setUserId(payload._id);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userId");
      setUserToken(null);
      setUserId(null);

      await client.resetStore();
    } catch (err) {
      console.log(err);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("userToken");
      const id = await SecureStore.getItemAsync("userId");

      if (token) {
        setUserToken(token);
        setUserId(id);
      }

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userId,
        login,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
