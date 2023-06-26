/* eslint-env node */

import "dotenv/config";
import { MongoClient } from "mongodb";
import fs from "fs";

const getWords = async (profanitiesCollection) => {
  const wordCounts = await profanitiesCollection.find().toArray();
  const wordCountsSorted = wordCounts.slice().sort((a, b) => b.count - a.count);
  return wordCountsSorted.map(({ word, count }) => ({
    text: word,
    value: count,
  }));
};

const main = async () => {
  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URL);
    const db = client.db();

    const profanitiesCollection = db.collection("profanities");

    const words = await getWords(profanitiesCollection);
    const json = JSON.stringify(words, null, 2);
    await fs.promises.writeFile("words.json", json);

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
