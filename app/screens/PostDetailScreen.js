import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POST_BY_ID, ADD_COMMENT, LIKE_POST } from "../graphql/operations";
import { formatDistanceToNow } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

const PostDetailScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [comment, setComment] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
    fetchPolicy: "network-only",
  });

  const [addComment, { loading: commentLoading }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setComment("");
      refetch();
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to add comment");
    },
  });

  const [likePost] = useMutation(LIKE_POST, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to like post");
    },
  });

  const handleSubmitComment = () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Comment cannot be empty");
      return;
    }

    addComment({
      variables: {
        postId,
        input: { content: comment },
      },
    });
  };

  const handleLikePost = () => {
    likePost({
      variables: { postId },
    });
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Error loading post: {error.message}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const post = data?.getPostById;
  if (!post) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  //cek udh dilike belom
  const isLiked = post.likes?.some((like) => like.username === "CURRENT_USER"); //!ganti jd usernamenya

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView style={styles.container}>
        <View style={styles.postContainer}>
          <Text style={styles.author}>
            {post.author.name} (@{post.author.username})
          </Text>
          <Image source={{ uri: post.imgUrl }} style={styles.image} />
          <Text style={styles.content}>{post.content}</Text>
          <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={handleLikePost}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "red" : "black"}
              />
              <Text style={styles.likeCount}>{post.likes?.length || 0}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsContainer}>
          <Text style={styles.commentTitle}>
            Comments ({post.comments?.length || 0})
          </Text>
          {post.comments?.length === 0 ? (
            <Text style={styles.noComments}>
              No comments yet. Be the first to comment!
            </Text>
          ) : (
            post.comments?.map((comment) => (
              <View key={comment._id} style={styles.comment}>
                <Text style={styles.commentAuthor}>@{comment.username}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTimestamp}>
                  {formatDate(comment.createdAt)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.commentForm}>
          <Text style={styles.commentFormTitle}>Add comment</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Write your comment..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              (commentLoading || !comment.trim()) && styles.disabledButton,
            ]}
            onPress={handleSubmitComment}
            disabled={commentLoading || !comment.trim()}
          >
            {commentLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  author: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 15,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  content: {
    marginBottom: 10,
    fontSize: 16,
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 14,
  },
  commentForm: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  commentFormTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    height: 100,
    textAlignVertical: "top",
    borderRadius: 5,
  },
  commentsContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  comment: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  commentAuthor: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    marginBottom: 5,
    fontSize: 15,
  },
  commentTimestamp: {
    color: "#666",
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#4a80f5",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4a80f5",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noComments: {
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    padding: 15,
  },
});

export default PostDetailScreen;
