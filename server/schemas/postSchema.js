import Post from "../models/post.js";

/*
posts: [Post]
 followers: [Follow]
 following: [Follow]
 */

export const typeDefs = `#graphql

type Author {
    _id: ID!
    name: String
    username: String!
  }

  type Comment {
    _id: ID!
    content: String!
    username: String!
    userId: ID!
    createdAt: String
    updatedAt: String
  }

  type Like {
    userId: ID!
    createdAt: String
    updatedAt: String
  }

type Post {
    _id: ID!
    content: String!
    tags: [String]
    imgUrl: String!
    authorId: ID!
    author: Author
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  input PostInput {
    content: String!
    authorId: ID!
    tags: [String]
    imgUrl: String
  }

  input CommentInput {
    content: String!
    userId: ID!
  }

type Query {
    posts: [Post]
    getPostById(id: ID!): Post
  }

  type Mutation {
    addPost(input: PostInput!): String
    addComment(postId: ID!, input: CommentInput!): Comment
    likePost(postId: ID!, userId: ID!): String
  }



 `;

export const resolvers = {
  Query: {
    posts: async function () {
      return await Post.findAll();
    },
    getPostById: async function (_, { id }) {
      return await Post.getPostById(id);
    },
  },

  Mutation: {
    addPost: async function (_, { input }) {
      return await Post.addPost(input);
    },
    addComment: async function (_, { postId, input }) {
      return await Post.addComment(postId, input);
    },
    likePost: async function (_, { postId, userId }) {
      return await Post.likePost(postId, userId);
    },
  },
};
