/* eslint-env node */

import "dotenv/config";
import { MongoClient } from "mongodb";

const main = async () => {
  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URL);
    const db = client.db();

    const parsedPuzzlesCollection = db.collection("parsedPuzzles");
    const profanitiesCollection = db.collection("profanities");

    const parsedPuzzlesCollectionSize = await parsedPuzzlesCollection.countDocuments();
    const profanitiesCollectionSize = await profanitiesCollection.countDocuments();

    console.log(`parsedPuzzles collection size: ${parsedPuzzlesCollectionSize}`);
    console.log(`profanities collection size: ${profanitiesCollectionSize}`);

    await client.close();
  } catch (error) {
    console.log("[main]", "ERROR:", error.message);
    console.log("[main]", "ERROR:", error.stack);
    if (client) {
      client.close().catch(console.dir);
    }
  }
};

main();
