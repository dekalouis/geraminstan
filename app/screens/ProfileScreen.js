import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const ProfileScreen = ({ navigation }) => {
  const user = {
    name: "Udinismus",
    username: "udingans",
    email: "udin@udin.com",
    followers: 10,
    following: 5,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <Text>@{user.username}</Text>
      <Text>Email: {user.email}</Text>

      <View style={styles.stats}>
        <Text>Followers: {user.followers}</Text>
        <Text>Following: {user.following}</Text>
      </View>

      <Button title="Log Out" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
    marginVertical: 20,
  },
});

export default ProfileScreen;
