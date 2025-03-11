import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://dekalouisrebaudo:c6sTSHzKM9nvrtxH@cluster0.gpcex.mongodb.net/";
export const client = new MongoClient(uri);
let db = null;

function connect() {
  try {
    const db = client.db("gc01");
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
