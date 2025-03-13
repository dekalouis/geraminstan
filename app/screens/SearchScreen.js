import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";

const SearchScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const dummyUsers = [
    {
      id: "1",
      name: "Udinismus",
      username: "udingans",
      followers: 10,
      following: 5,
    },
    {
      id: "2",
      name: "Bambang Sutejo",
      username: "bambangganteng",
      followers: 25,
      following: 12,
    },
    {
      id: "3",
      name: "Joko Septianto",
      username: "jokoisdebest",
      followers: 23,
      following: 50,
    },
    {
      id: "4",
      name: "Siti Nurbuaya",
      username: "sitinurbuaya",
      followers: 15,
      following: 20,
    },
  ];

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setResults([]);
      setHasSearched(true);
      return;
    }

    const filteredResults = dummyUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResults(filteredResults);
    setHasSearched(true);
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        alert(`Navigate ke ${item.name}`);
      }}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userUsername}>@{item.username}</Text>
      </View>
      <View style={styles.userStats}>
        <Text style={styles.userNums}>{item.followers} followers</Text>
        <Text style={styles.userNums}>{item.following} following</Text>
      </View>
      <Button title="Follow" onPress={() => alert(`Following ${item.name}`)} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Users</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      {hasSearched && results.length === 0 ? (
        <Text style={styles.noResults}>No users found</Text>
      ) : (
        <FlatList
          data={results}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 10,
  },

  noResults: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#666",
  },
  userItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userUsername: {
    color: "#666",
  },
  userStats: {
    flexDirection: "row",
    marginBottom: 10,
  },
  userNums: {
    marginRight: 10,
    fontSize: 12,
    color: "#666",
  },
});

export default SearchScreen;
