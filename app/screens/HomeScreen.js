import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const HomeScreen = ({ navigation }) => {
  // Dummy posts with IDs
  const posts = [
    {
      id: "1",
      author: "Udinismus",
      username: "udingans",
      content: "POKOKNYA KUCHINGGG!",
      imageUrl: "https://placecats.com/neo_2/300/300",
      comments: 2,
      likes: 10,
    },
    {
      id: "2",
      author: "Udinismus",
      username: "udingans",
      content: "Kucing lucu banget!",
      imageUrl: "https://placecats.com/bella/300/200",
      comments: 5,
      likes: 15,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={styles.post}
          onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
        >
          <Text style={styles.author}>
            {post.author} (@{post.username})
          </Text>
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          <Text style={styles.content}>{post.content}</Text>
          <Text style={styles.stats}>
            Likes: {post.likes} | Comments: {post.comments}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  post: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
  },
  author: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 4,
    marginBottom: 10,
  },
  content: {
    marginBottom: 5,
  },
  stats: {
    color: "#666",
    fontSize: 12,
  },
});

export default HomeScreen;
