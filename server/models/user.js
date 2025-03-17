import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as EmailValidator from "email-validator";

export default class User {
  static getCollection() {
    const db = getDb();
    const collection = db.collection("users");
    return collection;
  }

  static getFollowCollection() {
    const db = getDb();
    const collection = db.collection("follows");
    return collection;
  }

  static async findAll() {
    const collection = this.getCollection();
    const users = await collection.find().toArray();
    return users;
  }

  static async findById(id) {
    const collection = this.getCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) });
    return user;
  }

  static async login(payload) {
    const { email, password } = payload;
    const collection = this.getCollection();

    const user = await collection.findOne({ email });
    if (!user) throw new Error("Invalid email/password");

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) throw new Error("Invalid email/password");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
    return token;
  }

  static async register(payload) {
    const { name, email, password, username } = payload;

    //* VALIDATIONNYA JANGAN LUPA
    if (!name || !email || !password || !username) {
      throw new Error("All fields are required");
    }
    const isEmail = EmailValidator.validate(email);
    if (!isEmail) throw new Error("Invalid email format");

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    const collection = this.getCollection();

    if (await collection.findOne({ email })) {
      throw new Error("Email already registered");
    }
    
    await collection.insertOne({
      name,
      email,
      username,
      password: hashedPass,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return "Successfully registered!";
  }

  // static async searchUsers(searchTerm) {
  //   if (!searchTerm || searchTerm.trim() === "") {
  //     return [];
  //   }

  //   const collection = this.getCollection();

  //   const pattern = new RegExp(searchTerm, "i");
  //   const users = await collection
  //     .find({
  //       $or: [{ name: pattern }, { username: pattern }],
  //     })
  //     .toArray();

  //   return users;
  // }
  static async searchUsers(searchTerm) {
    if (!searchTerm || searchTerm.trim() === "") {
      return [];
    }

    const collection = this.getCollection();
    const pattern = new RegExp(searchTerm, "i");

    const matchingUsers = await collection
      .find({
        $or: [{ name: pattern }, { username: pattern }],
      })
      .toArray();

    if (matchingUsers.length === 0) {
      return [];
    }

    const userIds = matchingUsers.map((user) => user._id);

    const user = await collection
      .aggregate(
        [
          {
            $match: {
              _id: { $in: userIds },
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followingId",
              as: "followers",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followers.followerId",
              foreignField: "_id",
              as: "followerData",
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followerId",
              as: "followings",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followings.followingId",
              foreignField: "_id",
              as: "followingData",
            },
          },
          { $project: { followers: 0, followings: 0 } },
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      )
      .toArray();

    return user;
  }

  //GET USER
  static async getUserById(id) {
    const collection = this.getCollection();
    const userId = new ObjectId(id);

    if (!userId) {
      throw new Error("User not found");
    }

    const user = await collection
      .aggregate(
        [
          {
            $match: {
              _id: userId,
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followingId",
              as: "followers",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followers.followerId",
              foreignField: "_id",
              as: "followerData",
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followerId",
              as: "followings",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followings.followingId",
              foreignField: "_id",
              as: "followingData",
            },
          },
          {
            $project: {
              followers: 0,
              followings: 0,
              "followerData.password": 0,
              "followingData.password": 0,
            },
          },
          {
            $lookup: {
              from: "posts",
              localField: "_id",
              foreignField: "authorId",
              pipeline: [{ $sort: { createdAt: -1 } }],

              as: "posts",
            },
          },
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      )
      .toArray();
    // console.log(user, `dari model`);

    return user[0];
  }

  static async followUser(followerId, followingId) {
    const userCollection = this.getCollection();

    //check ada ga
    const follower = await userCollection.findOne({
      _id: new ObjectId(followerId),
    });
    const following = await userCollection.findOne({
      _id: new ObjectId(followingId),
    });

    if (!follower) throw new Error("Follower user not found");
    if (!following) throw new Error("User to follow not found");
    if (follower._id.toString() === following._id.toString()) {
      throw new Error("You cannot follow yourself");
    }

    //Check udh difollow belum
    const followCollection = this.getFollowCollection();
    const existingFollow = await followCollection.findOne({
      followerId: follower._id,
      followingId: following._id,
    });
    //CHECK DULU
    // console.log(existingFollow);

    if (existingFollow) {
      throw new Error("Already following this user");
    }

    const followData = {
      followerId: follower._id,
      followingId: following._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await followCollection.insertOne(followData);

    return `User ${follower.name} Successfully followed user ${following.name}`;
  }

  static async unfollowUser(followerId, followingId) {
    const userCollection = this.getCollection();

    const follower = await userCollection.findOne({
      _id: new ObjectId(followerId),
    });
    const following = await userCollection.findOne({
      _id: new ObjectId(followingId),
    });

    if (!follower) throw new Error("Follower user not found");
    if (!following) throw new Error("User to unfollow not found");

    const followCollection = this.getFollowCollection();
    const existingFollow = await followCollection.findOne({
      followerId: follower._id,
      followingId: following._id,
    });

    if (!existingFollow) {
      throw new Error("You are not following this user");
    }

    await followCollection.deleteOne({
      followerId: follower._id,
      followingId: following._id,
    });

    return `User ${follower.name} successfully unfollowed user ${following.name}`;
  }
}
