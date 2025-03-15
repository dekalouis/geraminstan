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
import { COLORS, FONTS, SHADOWS } from "../constants/theme";

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

  // const formatDate = (dateString) => {
  //   try {
  //     return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  //   } catch (e) {
  //     return dateString;
  //   }
  // };
  const formatDate = (dateString) => {
    try {
      const isNumeric = !isNaN(dateString) && !isNaN(parseFloat(dateString));
      let date;
      if (isNumeric) {
        date = new Date(parseInt(dateString));
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      console.log("Date format eror", e);
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
      style={{ flex: 1, backgroundColor: COLORS.background }}
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
                color={isLiked ? COLORS.secondary : COLORS.text}
              />
              <Text
                style={[
                  styles.likeCount,
                  isLiked && { color: COLORS.secondary },
                ]}
              >
                {post.likes?.length || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.commentButton} onPress={() => {}}>
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={COLORS.text}
              />
              <Text style={styles.commentCount}>
                {post.comments?.length || 0}
              </Text>
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
                <View style={styles.commentHeader}>
                  <View style={styles.commentAuthorCircle}>
                    <Text style={styles.commentAuthorInitial}>
                      {comment.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.commentAuthor}>@{comment.username}</Text>
                </View>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTimestamp}>
                  {formatDate(comment.createdAt)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.commentForm}>
          <Text style={styles.commentFormTitle}>Add a comment</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Write your comment..."
            value={comment}
            onChangeText={setComment}
            multiline
            placeholderTextColor={COLORS.textLight}
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
              <ActivityIndicator size="small" color={COLORS.white} />
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
    backgroundColor: COLORS.background,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  authorInitial: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: "bold",
  },
  author: {
    fontWeight: "bold",
    fontSize: FONTS.sizes.md,
    marginBottom: 2,
    color: COLORS.text,
  },
  username: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 15,
  },
  content: {
    marginBottom: 10,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: COLORS.primaryTransparent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: COLORS.accent,
    fontSize: FONTS.sizes.xs,
  },
  timestamp: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.xs,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  likeCount: {
    marginLeft: 5,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentCount: {
    marginLeft: 5,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  commentsContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  commentTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "bold",
    marginBottom: 15,
    color: COLORS.accent,
  },
  comment: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAuthorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  commentAuthorInitial: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: "bold",
  },
  commentAuthor: {
    fontWeight: "bold",
    color: COLORS.text,
  },
  commentText: {
    marginBottom: 5,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    paddingLeft: 38,
  },
  commentTimestamp: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.xs,
    paddingLeft: 38,
  },
  commentForm: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  commentFormTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.accent,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 15,
    height: 100,
    textAlignVertical: "top",
    borderRadius: 8,
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  noComments: {
    fontStyle: "italic",
    color: COLORS.textLight,
    textAlign: "center",
    padding: 15,
  },
});

export default PostDetailScreen;
