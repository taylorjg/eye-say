/* eslint-env node */

import "dotenv/config";
import { MongoClient } from "mongodb";
import badwords from "badwords";

const incrementWordCount = (map, word) => {
  const count = map.get(word) ?? 0;
  map.set(word, count + 1);
};

const findProfanitiesInClues = (map, clues) => {
  for (const clue of clues) {
    for (const word of badwords) {
      if (clue.includes(word)) {
        incrementWordCount(map, word);
      }
    }
  }
};

const findProfanities = (map, parsedPuzzle) => {
  console.log(`Finding profanities in ${parsedPuzzle.puzzle.title}...`);
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

    const parsedPuzzlesCollection = db.collection("parsedPuzzles");
    const profanitiesCollection = db.collection("profanities");

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
