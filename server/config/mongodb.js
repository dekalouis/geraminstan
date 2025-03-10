import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://dekalouisrebaudo:c6sTSHzKM9nvrtxH@cluster0.gpcex.mongodb.net/";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("gc01");
    const coll = database.collection("users");

    const users = await coll.find().toArray();

    console.log(users);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
