/* eslint-env node */

import "dotenv/config";
import axios from "axios";
import { MongoClient } from "mongodb";

const PROFANITY_LIST = [
  "shit",
  "fuck",
  "arse",
  "wank",
  "member",
  "dick",
  "balls",
  "tit",
  "tits",
  "knob",
];

axios.defaults.baseURL = process.env.PRINTPUZ_SERVERLESS_URL;

const incrementWordCount = (map, word) => {
  const count = map.get(word) ?? 0;
  map.set(word, count + 1);
};

const findProfanitiesInClues = (map, clues) => {
  for (const clue of clues) {
    for (const word of PROFANITY_LIST) {
      if (clue.includes(word)) {
        incrementWordCount(map, word);
      }
    }
  }
};

const findProfanities = (map, parsedPuzzle) => {
  const pluckClue = ({ clue }) => clue;
  const acrossClues = parsedPuzzle.acrossClues.map(pluckClue);
  const downClues = parsedPuzzle.downClues.map(pluckClue);
  findProfanitiesInClues(map, acrossClues);
  findProfanitiesInClues(map, downClues);
};

const rebuildMap = async (profanitiesCollection) => {
  const wordCounts = await profanitiesCollection.find().toArray();
  const kvps = wordCounts.map(({ word, count }) => [word, count]);
  return new Map(kvps);
};

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
    if (collectionNames.includes("profanities")) {
      await db.collection("profanities").drop();
    }

    const parsedPuzzlesCollection = db.collection("parsedPuzzles");
    const profanitiesCollection = db.collection("profanities");

    const listPuzzlesResponse = await axios.get("/list-puzzles");
    const puzzleUrls = listPuzzlesResponse.data.puzzles.map(({ url }) => url);
    console.log(`Number of puzzles found: ${puzzleUrls.length}`);
    for await (const puzzleUrl of puzzleUrls.slice(0, 5)) {
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

    const allParsedPuzzles = await parsedPuzzlesCollection.find().toArray();
    const map = new Map();
    allParsedPuzzles.forEach((parsedPuzzle) => findProfanities(map, parsedPuzzle));
    console.log(map);

    const wordCounts = Array.from(map.entries()).map(([word, count]) => ({ word, count }));
    await profanitiesCollection.insertMany(wordCounts);

    const rebuiltMap = await rebuildMap(profanitiesCollection);
    console.log("rebuiltMap:", rebuiltMap);

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
