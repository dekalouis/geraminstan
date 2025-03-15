import { gql } from "@apollo/client";

//AUTHENTIKASI
export const LOGIN = gql`
  query Login($payload: LoginInput) {
    login(payload: $payload)
  }
`;

export const REGISTER = gql`
  mutation Register($payload: RegisterInput) {
    register(payload: $payload)
  }
`;

//PSTS
export const GET_POSTS = gql`
  query GetPosts {
    posts {
      _id
      content
      imgUrl
      author {
        _id
        name
        username
      }
      likes {
        username
      }
      comments {
        username
        content
        userId
      }
      createdAt
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    getPostById(id: $id) {
      _id
      content
      imgUrl
      author {
        _id
        name
        username
      }
      likes {
        username
        createdAt
      }
      comments {
        _id
        content
        username
        userId
        createdAt
      }
      createdAt
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($input: PostInput!) {
    addPost(input: $input)
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $input: CommentInput!) {
    addComment(postId: $postId, input: $input) {
      _id
      content
      username
      createdAt
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId)
  }
`;

//USERSNYA
export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      _id
      name
      username
      followerData {
        _id
        email
        username
      }
      followingData {
        _id
        email
        username
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      _id
      name
      username
      email
      followerData {
        _id
        name
        username
      }
      followingData {
        _id
        name
        username
      }
      posts {
        _id
        imgUrl
        content
        createdAt
      }
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($followingId: ID!) {
    followUser(followingId: $followingId)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followingId: ID!) {
    unfollowUser(followingId: $followingId)
  }
`;
