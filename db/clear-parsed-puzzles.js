/* eslint-env node */

import "dotenv/config";
import { MongoClient } from "mongodb";

const main = async () => {
  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URL);
    const db = client.db();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(({ name }) => name);
    console.log("collectionNames:", collectionNames);

    if (collectionNames.includes("parsedPuzzles")) {
      await db.collection("parsedPuzzles").drop();
    }

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
