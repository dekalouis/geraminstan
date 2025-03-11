import { getDb } from "../config/mongodb";

export default class User {
  static async findAll() {
    const users = await getDb().collection("users").find().toArray();
    return users;
  }
}
