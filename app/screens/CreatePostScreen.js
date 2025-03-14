import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useMutation } from "@apollo/client";
import { ADD_POST, GET_POSTS } from "../graphql/operations";

const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://placecats.com/neo_2/300/300"
  );
  const [tags, setTags] = useState("");

  const [addPost, { loading }] = useMutation(ADD_POST, {
    onCompleted: () => {
      Alert.alert("Success", "Your post has been created!", [
        { text: "OK", onPress: () => navigation.navigate("HomeTab") },
      ]);

      setContent("");
      setImageUrl("https://placecats.com/neo_2/300/300");
      setTags("");
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to create post");
    },
    refetchQueries: [{ query: GET_POSTS }],
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Content cannot be empty");
      return;
    }

    if (!imageUrl.trim()) {
      Alert.alert("Error", "Image URL cannot be empty");
      return;
    }

    //TAGNYA comma separated biar jd array
    let tagsArray = [];
    if (tags.trim()) {
      tagsArray = tags.split(",").map((tag) => tag.trim());
    }

    addPost({
      variables: {
        input: {
          content,
          imgUrl: imageUrl,
          tags: tagsArray,
        },
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView contentContainerStyle={styles.container}>
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

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={styles.contentInput}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <Text style={styles.label}>Tags (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="cats, cute, pets"
          value={tags}
          onChangeText={setTags}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Post GeramInstan!</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    height: 120,
    textAlignVertical: "top",
    borderRadius: 5,
  },
  imagePreviewContainer: {
    marginVertical: 15,
    alignItems: "center",
  },
  previewText: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 250,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#4a80f5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
});

export default CreatePostScreen;
