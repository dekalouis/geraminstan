import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../graphql/operations";
import { formatDistanceToNow } from "date-fns";
import { COLORS, FONTS, SHADOWS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    fetchPolicy: "cache-and-network",
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (loading && !refreshing) {
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
          Error loading posts: {error.message}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const posts = data?.posts || [];

  // console.log(">>>>>>>>LIKENYA", posts[10].likes.length);
  // console.log(">>>>>>>>INI", posts[10].comments.length);

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
      console.log("Date format eor", e);
      return "Invalid date";
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary, COLORS.secondary]}
          tintColor={COLORS.primary}
        />
      }
    >
      <View style={styles.headerContainer}>
        <Image
          source={require("../assets/logo-icon.png")}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>GeramInstan</Text>
      </View>

      {posts.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Ionicons name="images-outline" size={60} color={COLORS.primary} />
          <Text style={styles.noPosts}>No posts yet. Start posting now!</Text>
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={() => navigation.navigate("CreatePost")}
          >
            <Text style={styles.createPostButtonText}>Create Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        posts.map((post) => (
          <TouchableOpacity
            key={post._id}
            style={styles.post}
            onPress={() =>
              navigation.navigate("PostDetail", { postId: post._id })
            }
          >
            <View style={styles.postHeader}>
              <View style={styles.authorInitialCircle}>
                <Text style={styles.authorInitial}>
                  {post.author.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.author}>
                {post.author.name}
                <Text style={styles.username}> @{post.author.username}</Text>
              </Text>
            </View>

            <Image
              source={{ uri: post.imgUrl }}
              style={styles.image}
              resizeMode="cover"
            />

            <Text style={styles.content}>{post.content}</Text>

            {post.tags && post.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.postFooter}>
              <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="heart" size={16} color={COLORS.like} />
                  <Text style={styles.statValue}>{post.likes.length || 0}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={16}
                    color={COLORS.textLight}
                  />
                  <Text style={styles.statValue}>
                    {post.comments.length || 0}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  logoIcon: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: "bold",
    marginLeft: 8,
    color: COLORS.accent,
  },
  noPostsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  createPostButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 15,
  },
  createPostButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  post: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInitialCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    color: COLORS.text,
  },
  username: {
    fontWeight: "normal",
    color: COLORS.textLight,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    marginBottom: 12,
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
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 5,
  },
  timestamp: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.xs,
  },
  statsContainer: {
    flexDirection: "row",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  statValue: {
    marginLeft: 4,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
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
  noPosts: {
    textAlign: "center",
    marginTop: 15,
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
  },
});

export default HomeScreen;
