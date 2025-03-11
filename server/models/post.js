import { getDb } from "../config/mongodb.js";

export default class Post {
  static getCollection() {
    const db = getDb();
    const collection = db.collection("posts");
    return collection;
  }

  static async findAll() {
    const collection = this.getCollection();
    const posts = await collection.find().toArray();
    return posts;
  }
}
