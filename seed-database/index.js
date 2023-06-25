/* eslint-env node */

import "dotenv/config";
import axios from "axios";
import { MongoClient } from "mongodb";

axios.defaults.baseURL = process.env.PRINTPUZ_SERVERLESS_URL;

const main = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URL);

    // TODO: ensure parsePuzzles collections exists and is empty
    // TODO: ensure profanities collections exists and is empty

    const listPuzzlesResponse = await axios.get("/list-puzzles");
    const puzzleUrls = listPuzzlesResponse.data.puzzles.map(({ url }) => url);
    console.log(`Number of puzzles found: ${puzzleUrls.length}`);
    for await (const puzzleUrl of puzzleUrls.slice(0, 3)) {
      const config = {
        params: {
          puzzleUrl,
        },
      };
      const parsePuzzleResponse = await axios.get("/parse-puzzle", config);
      console.log(`Parsing ${puzzleUrl}...`);
      const parsedPuzzle = parsePuzzleResponse.data;
      // TODO: add parsedPuzzle to parsedPuzzles collection
    }
    // TODO: build a map of profanity words to word counts and store in a profanities collection
  } catch (error) {
    console.log("[main]", "ERROR:", error.message);
  }
};

main();
