// import { getDb } from "../config/mongodb";

// export default class Follow {
//   static getCollection() {
//     const db = getDb();
//     const collection = db.collection("follows");
//     return collection;
//   }

//   static async findAll() {
//     const collection = this.getCollection();
//     const follows = await collection.find().toArray();
//     return follows;
//   }

//   static async findById(id) {
//     const collection = this.getCollection();
//     const follow = await collection.findOne({ _id: new ObjectId(id) });
//     return follow;
//   }

//   static async findByFollowerId(followerId) {
//     const collection = this.getCollection();
//     const follows = await collection
//       .find({ followerId: new ObjectId(followerId) })
//       .toArray();
//     return follows;
//   }

//   static async findByFollowingId(followingId) {
//     const collection = this.getCollection();
//     const follows = await collection
//       .find({ followingId: new ObjectId(followingId) })
//       .toArray();
//     return follows;
//   }
// }
