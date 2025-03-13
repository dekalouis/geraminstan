import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";

const ProfileScreen = ({ navigation }) => {
  const user = {
    name: "Udinismus",
    username: "udingans",
    email: "udin@udin.com",
    followers: 10,
    following: 5,
  };

  const userPosts = [
    { id: "1", imageUrl: "https://placecats.com/300/200" },
    { id: "2", imageUrl: "https://placecats.com/neo/300/200" },
    { id: "3", imageUrl: "https://placecats.com/millie/300/150" },
    { id: "4", imageUrl: "https://placecats.com/millie_neo/300/200" },
    { id: "5", imageUrl: "https://placecats.com/neo_banana/300/200" },
    { id: "6", imageUrl: "https://placecats.com/neo_2/300/200" },
    { id: "7", imageUrl: "https://placecats.com/bella/300/200" },
    { id: "8", imageUrl: "https://placecats.com/g/300/200" },
    { id: "9", imageUrl: "https://placecats.com/300/200" },
    { id: "10", imageUrl: "https://placecats.com/300/200" },
    { id: "11", imageUrl: "https://placecats.com/neo/300/200" },
    { id: "12", imageUrl: "https://placecats.com/millie/300/150" },
    { id: "13", imageUrl: "https://placecats.com/millie_neo/300/200" },
    { id: "14", imageUrl: "https://placecats.com/neo_banana/300/200" },
    { id: "15", imageUrl: "https://placecats.com/neo_2/300/200" },
    { id: "16", imageUrl: "https://placecats.com/bella/300/200" },
    { id: "17", imageUrl: "https://placecats.com/g/300/200" },
    { id: "18", imageUrl: "https://placecats.com/300/200" },
  ];

  const windowWidth = Dimensions.get("window").width;
  const itemSize = (windowWidth - 40 - 8) / 3;

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.postImage, { width: itemSize, height: itemSize }]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <Text>@{user.username}</Text>
        <Text>Email: {user.email}</Text>

        <View style={styles.stats}>
          <Text>Followers: {user.followers}</Text>
          <Text>Following: {user.following}</Text>
        </View>
      </View>

      <View style={styles.postsContainer}>
        <Text style={styles.postsTitle}>Posts</Text>
        <FlatList
          data={userPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.postRow}
        />
      </View>

      <Button title="Log Out" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
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
  postsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postRow: {
    justifyContent: "space-between",
    marginBottom: 4,
  },
  postItem: {
    marginBottom: 4,
  },
  postImage: {
    borderRadius: 4,
  },
});

export default ProfileScreen;
