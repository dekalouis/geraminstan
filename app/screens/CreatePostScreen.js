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
import { COLORS, FONTS, SHADOWS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";

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
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={styles.title}>Create New Post</Text>
        </View>

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

        <View style={styles.formContainer}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            placeholderTextColor={COLORS.textLight}
          />

          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholderTextColor={COLORS.textLight}
          />

          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="cats, cute, pets"
            value={tags}
            onChangeText={setTags}
            placeholderTextColor={COLORS.textLight}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Post to GeramInstan!</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    marginLeft: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.accent,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    ...SHADOWS.small,
  },
  label: {
    fontSize: FONTS.sizes.md,
    marginBottom: 8,
    marginTop: 12,
    fontWeight: "500",
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 15,
    height: 120,
    textAlignVertical: "top",
    borderRadius: 8,
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  imagePreviewContainer: {
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    ...SHADOWS.small,
  },
  previewText: {
    marginBottom: 8,
    fontWeight: "bold",
    color: COLORS.accent,
  },
  imagePreview: {
    width: "100%",
    height: 250,
    borderRadius: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
});
export default CreatePostScreen;
