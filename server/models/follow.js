import { getDb } from "../config/mongodb";

export default class Follow {
  static getCollection() {
    const db = getDb();
    const collection = db.collection("follows");
    return collection;
  }

  static async findAll() {
    const collection = this.getCollection();
    const follows = await collection.find().toArray();
    return follows;
  }
}
