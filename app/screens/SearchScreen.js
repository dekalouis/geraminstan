import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_USERS } from "../graphql/operations";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, FONTS, SHADOWS } from "../constants/theme";

const SearchScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { userId } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [searchUsers, { loading, error, data }] = useLazyQuery(SEARCH_USERS, {
    fetchPolicy: "no-cache", //INI BIAR FRESH DATA TRUS
    onCompleted: (data) => {
      if (data?.searchUsers) {
        setUsers(data.searchUsers);
      }
    },
  });

  //RESET BIAR BERSIH
  useFocusEffect(
    React.useCallback(() => {
      setSearchTerm("");
      setUsers([]);
      setHasSearched(false);

      return () => {};
    }, [])
  );

  useEffect(() => {
    if (data?.searchUsers) {
      setUsers(data.searchUsers);
      setHasSearched(true);
    }
  }, [data]);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      return;
    }

    setHasSearched(true);
    searchUsers({
      variables: { searchTerm },
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setUsers([]);
    setHasSearched(false);
  };

  const navigateToUserProfile = (userId) => {
    navigation.navigate("UserProfile", { userId });
  };

  const renderUserItem = ({ item }) => {
    //! JANGAN SAMPE USER YANG LOGIN NONGOL.
    if (item._id === userId) {
      return null;
    }

    //ngitung followeernya dan followingnya langusng
    const followerCount = item.followerData ? item.followerData.length : 0;
    const followingCount = item.followingData ? item.followingData.length : 0;

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => navigateToUserProfile(item._id)}
      >
        <View style={styles.userInfo}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>
              {item.name
                ? item.name.charAt(0).toUpperCase()
                : item.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userTextInfo}>
            <Text style={styles.userName}>{item.name || item.username}</Text>
            <Text style={styles.userUsername}>@{item.username}</Text>
            <View style={styles.userStats}>
              <Text style={styles.userNums}>
                {followerCount} followers · {followingCount} following
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="people" size={24} color={COLORS.accent} />
        <Text style={styles.title}>Find People</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.textLight}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or username"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor={COLORS.textLight}
          />
          {searchTerm ? (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      ) : (
        <>
          {hasSearched && users.length === 0 ? (
            <View style={styles.noResults}>
              <Ionicons
                name="people-outline"
                size={50}
                color={COLORS.primaryTransparent}
              />
              <Text style={styles.noResultsText}>No users found</Text>
            </View>
          ) : (
            <FlatList
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FONTS.sizes.xl,
    marginLeft: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.accent,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginRight: 10,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
  },
  clearButton: {
    paddingHorizontal: 5,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.small,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    marginTop: 15,
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.white,
    fontWeight: "bold",
  },
  userTextInfo: {
    marginLeft: 15,
    justifyContent: "center",
    flex: 1,
  },
  userName: {
    fontSize: FONTS.sizes.md,
    fontWeight: "bold",
    color: COLORS.text,
  },
  userUsername: {
    color: COLORS.textLight,
    marginBottom: 5,
    fontSize: FONTS.sizes.sm,
  },
  userStats: {
    flexDirection: "row",
  },
  userNums: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
  },
});

export default SearchScreen;
