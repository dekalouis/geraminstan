import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ApolloProvider } from "@apollo/client";
import { View, ActivityIndicator, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import apolloClient from "./config/apollo";

import { AuthProvider, AuthContext } from "./context/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import SearchScreen from "./screens/SearchScreen";
import { COLORS, FONTS, SHADOWS } from "./constants/theme";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const SearchStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const stackScreenOptions = {
  headerStyle: {
    backgroundColor: COLORS.white,
    elevation: 0, // for Android
    shadowOpacity: 0, // for iOS
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTintColor: COLORS.accent,
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: FONTS.sizes.lg,
  },
  cardStyle: {
    backgroundColor: COLORS.background,
  },
};

//Authentication Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

//SEARCH STACK DIDALEM TAB
const SearchStackScreen = () => {
  return (
    <SearchStack.Navigator screenOptions={stackScreenOptions}>
      <SearchStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Find People" }}
      />
      <SearchStack.Screen name="UserProfile" component={UserProfileScreen} />
      <SearchStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: "Post" }}
      />
    </SearchStack.Navigator>
  );
};

//HOME STACK DIDALEM TAB
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <HomeStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: "Post" }}
      />
      <HomeStack.Screen name="UserProfile" component={UserProfileScreen} />
    </HomeStack.Navigator>
  );
};

//STACK PROFILE DIDALEM TAB
const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={stackScreenOptions}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "My Profile" }}
      />
      <ProfileStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: "Post" }}
      />
    </ProfileStack.Navigator>
  );
};

//MAIN TAB after auth
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "SearchTab") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: {
          fontSize: FONTS.sizes.xs,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{ headerShown: false, title: "Home" }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStackScreen}
        options={{ headerShown: false, title: "Search" }}
      />
      <Tab.Screen
        name="Post"
        component={CreatePostScreen}
        options={{
          title: "New Post",
          headerStyle: {
            backgroundColor: COLORS.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          },
          headerTintColor: COLORS.accent,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: FONTS.sizes.lg,
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
        options={{ headerShown: false, title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

//ROOT NAVIGATOR
const RootNavigator = () => {
  const { isLoading, userToken } = React.useContext(AuthContext);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <Image
          source={require("./assets/logo.png")}
          style={{ width: 100, height: 100, marginBottom: 20 }}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text
          style={{
            marginTop: 15,
            fontSize: FONTS.sizes.md,
            color: COLORS.text,
          }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

// MAINAPP
export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ApolloProvider>
  );
}
