import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Image } from "react-native";

const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://placecats.com/neo_2/300/300"
  );

  const handleSubmit = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Post</Text>

      {imageUrl ? (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.previewText}>Preview:</Text>
          <Image
            source={{ uri: imageUrl }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        </View>
      ) : null}

      <TextInput
        style={styles.contentInput}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <View style={styles.buttonContainer}>
        <Button title="Post" onPress={handleSubmit} />
      </View>
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    height: 100,
    textAlignVertical: "top",
  },
  imagePreviewContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  previewText: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 300,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default CreatePostScreen;
