import { MongoClient } from "mongodb";

console.log("from connect file-> ", process.env.MONGODB_URI);

const client = await MongoClient.connect(
  "mongodb+srv://starktony:5ZAEgcIbQHwZ0Jr1@cluster0.1zcmk7n.mongodb.net/sample_data?retryWrites=true&w=majority&appName=Cluster0"
);

if (client?.db) {
  console.log("Connected to DB successfully");
}

export const db = client.db();
