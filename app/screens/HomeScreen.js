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

const HomeScreen = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    fetchPolicy: "network-only",
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
        <ActivityIndicator size="large" color="#0000ff" />
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

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {posts.length === 0 ? (
        <Text style={styles.noPosts}>
          No posts yet. Follow some users to see their posts!
        </Text>
      ) : (
        posts.map((post) => (
          <TouchableOpacity
            key={post._id}
            style={styles.post}
            onPress={() =>
              navigation.navigate("PostDetail", { postId: post._id })
            }
          >
            <Text style={styles.author}>
              {post.author.name} (@{post.author.username})
            </Text>
            <Image
              source={{ uri: post.imgUrl }}
              style={styles.image}
              resizeMode="cover"
            />

            <Text style={styles.content}>{post.content}</Text>
            <View style={styles.postFooter}>
              <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
              <Text style={styles.stats}>
                Likes: {post.likes?.length || 0} | Comments:{" "}
                {post.comments?.length || 0}
              </Text>
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  post: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
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
    marginBottom: 10,
  },
  content: {
    marginBottom: 10,
    fontSize: 16,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
  },
  stats: {
    color: "#666",
    fontSize: 12,
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
  noPosts: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
});

export default HomeScreen;
