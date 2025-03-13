import Post from "../models/post.js";
import redis from "../config/redis.js";

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
    tags: [String]
    imgUrl: String
  }

  input CommentInput {
    content: String!
  }

type Query {
    posts: [Post]
    getPostById(id: ID!): Post
  }

  type Mutation {
    addPost(input: PostInput!): String
    addComment(postId: ID!, input: CommentInput!): Comment
    likePost(postId: ID!): String
  }



 `;

export const resolvers = {
  Query: {
    posts: async function (_, __, { authN }) {
      const user = await authN();
      const cachedPosts = await redis.get("posts");
      if (cachedPosts) {
        return JSON.parse(cachedPosts);
      }
      // console.log("belum ada cache, tarik dulu");
      const posts = await Post.findAll();
      await redis.set("posts", JSON.stringify(posts));
      return posts;
    },

    getPostById: async function (_, { id }, { authN }) {
      const user = await authN();
      return await Post.getPostById(id);
    },
  },

  Mutation: {
    addPost: async function (_, { input }, { authN }) {
      const user = await authN();
      const postData = {
        ...input,
        authorId: user._id,
      };
      const result = await Post.addPost(postData);
      await redis.del("posts");
      return result;
    },

    addComment: async function (_, { postId, input }, { authN }) {
      const user = await authN();
      const commentData = {
        ...input,
        userId: user._id,
        username: user.username,
      };
      return await Post.addComment(postId, commentData);
    },

    likePost: async function (_, { postId }, { authN }) {
      const user = await authN();
      return await Post.likePost(postId, user._id);
    },
  },
};
