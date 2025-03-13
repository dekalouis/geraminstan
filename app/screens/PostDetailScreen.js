import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  ScrollView,
} from "react-native";

const PostDetailScreen = ({ route, navigation }) => {
  const [comment, setComment] = useState("");

  const post = {
    id: "123",
    author: "Udinismus",
    username: "udingans",
    content: "POKOKNYA KUCHINGGG!",
    imageUrl: "https://placecats.com/neo_2/300/300",
    comments: [
      {
        id: "1",
        author: "Bambang",
        username: "bambangganteng",
        text: "Kucingnya lucu banget!",
        timestamp: "2 hours ago",
      },
      {
        id: "2",
        author: "Joko",
        username: "jokoisdebest",
        text: "Suka kucingnya",
        timestamp: "1 hour ago",
      },
    ],
    likes: 10,
    timestamp: "3 hours ago",
  };

  const handleSubmitComment = () => {
    setComment("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postContainer}>
        <Text style={styles.author}>
          {post.author} (@{post.username})
        </Text>
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
        <Text style={styles.content}>{post.content}</Text>
        <Text style={styles.timestamp}>{post.timestamp}</Text>
        <Text style={styles.stats}>Likes: {post.likes}</Text>
      </View>

      <View style={styles.commentsContainer}>
        <Text style={styles.commentTitle}>
          Comments ({post.comments.length})
        </Text>
        {post.comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <Text style={styles.commentAuthor}>
              {comment.author} (@{comment.username})
            </Text>
            <Text style={styles.commentText}>{comment.text}</Text>
            <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
          </View>
        ))}
      </View>
      <View style={styles.commentForm}>
        <Text style={styles.commentTitle}>Add comment</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Write your comment..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <Button title="Submit" onPress={handleSubmitComment} />
      </View>

      {/* <Button title="Back Home" onPress={() => navigation.goBack()} /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  postContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
  },
  content: {
    marginBottom: 5,
    fontSize: 16,
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
    marginBottom: 5,
  },
  stats: {
    color: "#666",
    fontSize: 12,
  },
  commentForm: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    height: 80,
    textAlignVertical: "top",
  },
  commentsContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
  },
  comment: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  commentAuthor: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    marginBottom: 5,
  },
  commentTimestamp: {
    color: "#666",
    fontSize: 12,
  },
});

export default PostDetailScreen;
