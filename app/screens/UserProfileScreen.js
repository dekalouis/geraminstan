import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_USER_BY_ID,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from "../graphql/operations";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const UserProfileScreen = ({ navigation, route }) => {
  const { userId: viewingUserId } = route.params;
  const { userId: loggedInUserId } = useContext(AuthContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const { loading, error, data, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id: viewingUserId },
    fetchPolicy: "network-only",
  });

  //MUTASI follow/unfollow
  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to follow user");
    },
  });

  const [unfollowUser, { loading: unfollowLoading }] = useMutation(
    UNFOLLOW_USER,
    {
      onCompleted: () => {
        refetch();
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to unfollow user");
      },
    }
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  //set titlenya  ke nama user JANGAN LUPA useeeffect HARUS DIATAS at the top level
  useEffect(() => {
    if (data?.getUserById) {
      navigation.setOptions({
        title: data.getUserById.name || `@${data.getUserById.username}`,
      });
    }
  }, [data, navigation]);

  //? CHECK YANG LG LOGIN FOLLOW GA SUER INI
  const isFollowing = data?.getUserById?.followerData?.some(
    (follower) => follower._id === loggedInUserId
  );

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser({ variables: { followingId: viewingUserId } });
    } else {
      followUser({ variables: { followingId: viewingUserId } });
    }
  };

  //BIAR POSTNYA BENER ORDERANNYA
  const windowWidth = Dimensions.get("window").width;
  const numColumns = 3;
  const spacing = 4;
  const totalSpacing = spacing * (numColumns - 1);
  const itemSize = (windowWidth - 40 - totalSpacing) / numColumns;

  const renderPostItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.postItem,
        {
          width: itemSize,
          height: itemSize,
          marginRight: (index + 1) % numColumns === 0 ? 0 : spacing,
        },
      ]}
      onPress={() => navigation.navigate("PostDetail", { postId: item._id })}
    >
      <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
    </TouchableOpacity>
  );

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
          Error loading profile: {error.message}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const user = data?.getUserById;

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>
            {user.name?.charAt(0) || user.username?.charAt(0)}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.posts?.length || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {user.followerData?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {user.followingData?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.followToggleButton,
          isFollowing ? styles.unfollowButton : styles.followButton,
          (followLoading || unfollowLoading) && styles.disabledButton,
        ]}
        onPress={handleFollowToggle}
        disabled={followLoading || unfollowLoading}
      >
        {followLoading || unfollowLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.followToggleText}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.postsContainer}>
        <Text style={styles.postsTitle}>Posts</Text>

        {user.posts?.length === 0 ? (
          <View style={styles.noPosts}>
            <Ionicons name="images-outline" size={50} color="#ccc" />
            <Text style={styles.noPostsText}>No posts yet</Text>
          </View>
        ) : (
          <FlatList
            data={user.posts}
            renderItem={renderPostItem}
            keyExtractor={(item) => item._id}
            numColumns={numColumns}
            columnWrapperStyle={styles.postRow}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4a80f5",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: "#666",
    marginBottom: 3,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  followToggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  followButton: {
    backgroundColor: "#4a80f5",
  },
  unfollowButton: {
    backgroundColor: "#f44336",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  followToggleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  postsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  postRow: {
    justifyContent: "flex-start",
    marginBottom: 4,
  },
  postItem: {
    marginBottom: 4,
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  noPosts: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
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
});

export default UserProfileScreen;
