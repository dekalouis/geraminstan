import { getDb } from "../config/mongodb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class User {
  static getCollection() {
    const db = getDb();
    const collection = db.collection("users");
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

    const token = jwt.sign({ _id: user._id }, "rahasia");

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

    return "Register berhasil";
  }
}
