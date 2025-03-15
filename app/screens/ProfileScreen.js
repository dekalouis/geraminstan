import React, { useContext } from "react";
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
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../graphql/operations";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SHADOWS } from "../constants/theme";

const ProfileScreen = ({ navigation }) => {
  const { userId, logout } = useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);

  const { loading, error, data, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    fetchPolicy: "no-cache",
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => logout(),
      },
    ]);
  };

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
            <Text style={styles.email}>{user.email}</Text>

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
      </View>

      <View style={styles.postsContainer}>
        <Text style={styles.postsTitle}>Your Posts</Text>

        {user.posts?.length === 0 ? (
          <View style={styles.noPosts}>
            <Ionicons name="images-outline" size={50} color={COLORS.primary} />
            <Text style={styles.noPostsText}>No posts yet</Text>
            <TouchableOpacity
              style={styles.createPostButton}
              onPress={() => navigation.navigate("CreatePost")}
            >
              <Text style={styles.createPostButtonText}>
                Create your first post
              </Text>
            </TouchableOpacity>
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 15,
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
  email: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginBottom: 10,
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

  editProfileButtonText: {
    color: COLORS.accent,
    fontWeight: "bold",
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
  logoutButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    marginLeft: 5,
  },
  noPosts: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  noPostsText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    marginTop: 10,
    marginBottom: 20,
  },
  createPostButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
  },
  createPostButtonText: {
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
});

export default ProfileScreen;
