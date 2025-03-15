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
import { COLORS, FONTS, SHADOWS } from "../constants/theme";

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
        <ActivityIndicator size="large" color={COLORS.primary} />
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
      <View style={styles.profileCard}>
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
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Ionicons
                name={isFollowing ? "person-remove" : "person-add"}
                size={18}
                color={COLORS.white}
                style={styles.followIcon}
              />
              <Text style={styles.followToggleText}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.postsContainer}>
        <Text style={styles.postsTitle}>Posts</Text>

        {user.posts?.length === 0 ? (
          <View style={styles.noPosts}>
            <Ionicons
              name="images-outline"
              size={50}
              color={COLORS.primaryTransparent}
            />
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
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary, COLORS.secondary]}
                tintColor={COLORS.primary}
              />
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
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 40,
    color: COLORS.white,
    fontWeight: "bold",
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: FONTS.sizes.xl,
    fontWeight: "bold",
    marginBottom: 5,
    color: COLORS.text,
  },
  username: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    marginBottom: 3,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  statItem: {
    alignItems: "center",
    backgroundColor: COLORS.primaryTransparent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statNumber: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "bold",
    color: COLORS.accent,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
  },
  followToggleButton: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    ...SHADOWS.small,
  },
  followIcon: {
    marginRight: 8,
  },
  followButton: {
    backgroundColor: COLORS.primary,
  },
  unfollowButton: {
    backgroundColor: COLORS.secondary,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  followToggleText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: FONTS.sizes.md,
  },
  postsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  postsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: "bold",
    marginBottom: 15,
    color: COLORS.accent,
  },
  postRow: {
    justifyContent: "flex-start",
    marginBottom: 4,
  },
  postItem: {
    marginBottom: 4,
    ...SHADOWS.small,
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
    paddingTop: 50,
  },
  noPostsText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    marginTop: 15,
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
});

export default UserProfileScreen;
