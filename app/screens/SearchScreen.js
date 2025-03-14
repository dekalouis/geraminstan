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
      <Text style={styles.title}>Find People</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchTerm ? (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      ) : (
        <>
          {hasSearched && users.length === 0 ? (
            <View style={styles.noResults}>
              <Ionicons name="people-outline" size={50} color="#ccc" />
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginRight: 10,
    borderRadius: 5,
  },
  clearButton: {
    position: "absolute",
    right: 60,
    zIndex: 1,
  },
  searchButton: {
    backgroundColor: "#4a80f5",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  listContainer: {
    flexGrow: 1,
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4a80f5",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  userTextInfo: {
    marginLeft: 15,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userUsername: {
    color: "#666",
    marginBottom: 5,
  },
  userStats: {
    flexDirection: "row",
  },
  userNums: {
    fontSize: 12,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default SearchScreen;
