import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const collection = this.getCollection();
    await collection.insertOne({
      name,
      email,
      username,
      password: hash,
    });

    return "Successfully registered!";
  }

  static async searchUsers(searchTerm) {
    if (!searchTerm || searchTerm.trim() === "") {
      return [];
    }

    const collection = this.getCollection();

    const pattern = new RegExp(searchTerm, "i");
    const users = await collection
      .find({
        $or: [{ name: pattern }, { username: pattern }],
      })
      .toArray();

    return users;
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

    const result = await followCollection.insertOne(followData);

    return `User ${follower.name} Successfully followed user ${following.name}`;
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
          { $project: { followers: 0, followings: 0 } },
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      )
      .toArray();
    console.log(user, `dari model`);

    return user[0];
  }
}
