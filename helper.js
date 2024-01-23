import { client } from './index.js';
import { ObjectId } from 'mongodb';
export async function getfilesById(id) {
  const o_id=new ObjectId(id);
  return await client.db("filesystem").collection("files")
    .findOne({_id:o_id});
}

export async function getAllfiles() {
  return await client.db("filesystem").collection("files")
    .find({})
    .toArray();
}
export async function deletefiles(id) {
  const o_id=new ObjectId(id);
  return client.db("filesystem")
    .collection("files")
    .deleteMany({ _id: o_id });
}
export async function createfiles(data1) {
  return await client.db("filesystem")
    .collection("files").insertOne(data1);
}

export async function updatefiles(id, updateData) {
  const o_id=new ObjectId(id);
  return client.db("filesystem")
    .collection("files") 
    .updateOne({ _id: o_id }, { $set: updateData });
}

//files filesystem