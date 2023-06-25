/* eslint-env node */

import "dotenv/config";
import axios from "axios";
import { MongoClient } from "mongodb";

axios.defaults.baseURL = process.env.PRINTPUZ_SERVERLESS_URL;

const main = async () => {
  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URL);
    const db = client.db();

    const parsedPuzzlesCollection = db.collection("parsedPuzzles");

    const listPuzzlesResponse = await axios.get("/list-puzzles");
    const puzzleUrls = listPuzzlesResponse.data.puzzles.map(({ url }) => url);
    console.log(`Number of puzzles found: ${puzzleUrls.length}`);

    for await (const puzzleUrl of puzzleUrls) {
      const config = {
        params: {
          puzzleUrl,
        },
      };
      const parsePuzzleResponse = await axios.get("/parse-puzzle", config);
      console.log(`Parsing ${puzzleUrl}...`);
      const parsedPuzzle = parsePuzzleResponse.data;
      console.log(`Storing parsed puzzle ${puzzleUrl}...`);
      await parsedPuzzlesCollection.insertOne(parsedPuzzle);
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
