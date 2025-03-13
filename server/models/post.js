/*
add post, 
get posts (to get a list of posts based on the latest and shows the author name)
getpost by id (to get post based on the id and shows author name)
comment post (to add comment to a post)
like post (to like a post)

*/

import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb.js";

export default class Post {
  static getCollection() {
    const db = getDb();
    const collection = db.collection("posts");
    return collection;
  }
  static getUserCollection() {
    const db = getDb();
    const collection = db.collection("users");
    return collection;
  }

  static async addPost(postData) {
    const collection = this.getCollection();

    const { content, authorId, tags = [], imgUrl = "" } = postData;

    //TODO VALIDATIONNYA JANGAN LUPA
    const newPost = {
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(authorId),
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newPost);

    return `Post with id ${result.insertedId} has been created`;
  }

  static async findAll() {
    const collection = this.getCollection();

    const posts = await collection
      .aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
      ])
      .toArray();

    return posts;
  }

  static async getPostById(id) {
    const collection = this.getCollection();

    const post = await collection
      .aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
        {
          $project: {
            _id: 1,
            content: 1,
            tags: 1,
            imgUrl: 1,
            authorId: 1,
            comments: 1,
            likes: 1,
            createdAt: 1,
            updatedAt: 1,
            "author.name": 1,
            "author.username": 1,
            "author._id": 1,
          },
        },
      ])
      .toArray();

    return post[0];
  }

  static async addComment(postId, commentData) {
    const collection = this.getCollection();
    const userCollection = this.getUserCollection();

    const { content, userId } = commentData;

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new Error("User not found");
    }

    const comment = {
      _id: new ObjectId(),
      content,
      username: user.username,
      userId: new ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: { comments: comment },
        $set: { updatedAt: new Date() },
      }
    );

    if (result.modifiedCount === 0) {
      throw new Error("Post not found");
    }

    return comment;
  }

  //TODO LIKE BY USERNAME BUKAN ID
  static async likePost(postId, userId) {
    const collection = this.getCollection();

    //cek udh dilike belum
    const post = await collection.findOne({
      _id: new ObjectId(postId),
      "likes.userId": new ObjectId(userId),
    });

    if (post) {
      //UDAH dilike, di unlike
      const result = await collection.updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: { likes: { userId: new ObjectId(userId) } },
          $set: { updatedAt: new Date() },
        }
      );

      return "Post unliked successfully";
    } else {
      //Belum dilike, di like
      const like = {
        userId: new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: { likes: like },
          $set: { updatedAt: new Date() },
        }
      );

      if (!result) {
        throw new Error("Post not found");
      }

      return "Post liked successfully";
    }
  }
}
