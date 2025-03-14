// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { ApolloProvider } from "@apollo/client";
// import { View, ActivityIndicator, Text } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// // Apollo Client
// import apolloClient from "./config/apollo";

// // Context
// import { AuthProvider, AuthContext } from "./context/AuthContext";

// // Screens
// import LoginScreen from "./screens/LoginScreen";
// import RegisterScreen from "./screens/RegisterScreen";
// import HomeScreen from "./screens/HomeScreen";
// import ProfileScreen from "./screens/ProfileScreen";
// import CreatePostScreen from "./screens/CreatePostScreen";
// import PostDetailScreen from "./screens/PostDetailScreen";
// import SearchScreen from "./screens/SearchScreen";

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// // Authentication Navigator
// const AuthStack = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//     </Stack.Navigator>
//   );
// };

// // Home Stack (within tabs)
// const HomeStack = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="PostDetail" component={PostDetailScreen} />
//     </Stack.Navigator>
//   );
// };

// // Profile Stack (within tabs)
// const ProfileStack = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Profile" component={ProfileScreen} />
//       <Stack.Screen name="PostDetail" component={PostDetailScreen} />
//     </Stack.Navigator>
//   );
// };

// // Main Tab Navigator (when authenticated)
// const MainTabs = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === "HomeTab") {
//             iconName = focused ? "home" : "home-outline";
//           } else if (route.name === "ProfileTab") {
//             iconName = focused ? "person" : "person-outline";
//           } else if (route.name === "Search") {
//             iconName = focused ? "search" : "search-outline";
//           } else if (route.name === "CreatePost") {
//             iconName = focused ? "add-circle" : "add-circle-outline";
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "tomato",
//         tabBarInactiveTintColor: "gray",
//       })}
//     >
//       <Tab.Screen
//         name="HomeTab"
//         component={HomeStack}
//         options={{ headerShown: false, title: "Home" }}
//       />
//       <Tab.Screen name="Search" component={SearchScreen} />
//       <Tab.Screen name="CreatePost" component={CreatePostScreen} />
//       <Tab.Screen
//         name="ProfileTab"
//         component={ProfileStack}
//         options={{ headerShown: false, title: "Profile" }}
//       />
//     </Tab.Navigator>
//   );
// };

// // Root Navigator that handles authentication state
// const RootNavigator = () => {
//   const { isLoading, userToken } = React.useContext(AuthContext);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//         <Text style={{ marginTop: 10 }}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {userToken ? <MainTabs /> : <AuthStack />}
//     </NavigationContainer>
//   );
// };

// // Main App Component
// export default function App() {
//   return (
//     <ApolloProvider client={apolloClient}>
//       <AuthProvider>
//         <RootNavigator />
//       </AuthProvider>
//     </ApolloProvider>
//   );
// }

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ApolloProvider } from "@apollo/client";
import { View, ActivityIndicator, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Apollo Client
import apolloClient from "./config/apollo";

// Context
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import SearchScreen from "./screens/SearchScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const SearchStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Authentication Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Search Stack (within tabs)
const SearchStackScreen = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="UserProfile" component={UserProfileScreen} />
      <SearchStack.Screen name="PostDetail" component={PostDetailScreen} />
    </SearchStack.Navigator>
  );
};

// Home Stack (within tabs)
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="PostDetail" component={PostDetailScreen} />
      <HomeStack.Screen name="UserProfile" component={UserProfileScreen} />
    </HomeStack.Navigator>
  );
};

// Profile Stack (within tabs)
const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="PostDetail" component={PostDetailScreen} />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator (when authenticated)
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
          } else if (route.name === "CreatePost") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
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
      <Tab.Screen name="CreatePost" component={CreatePostScreen} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
        options={{ headerShown: false, title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator that handles authentication state
const RootNavigator = () => {
  const { isLoading, userToken } = React.useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Main App Component
export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ApolloProvider>
  );
}
