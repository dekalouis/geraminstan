import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
// console.log(uri);

export const client = new MongoClient(uri);
let db = null;

function connect() {
  try {
    db = client.db("gc01");
  } catch (err) {
    console.log(err);
  }
}

export function getDb() {
  if (!db) {
    connect();
  }
  return db;
}
