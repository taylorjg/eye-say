import axios from "axios";

// See https://github.com/taylorjg/print-puz-serverless
axios.defaults.baseURL = "https://fr0r2wv048.execute-api.us-east-1.amazonaws.com";

const main = async () => {
  try {
    // TODO: ensure parsePuzzles collections exists and is empty
    // TODO: ensure profanities collections exists and is empty
    const listPuzzlesResponse = await axios.get("/list-puzzles");
    const puzzleUrls = listPuzzlesResponse.data.puzzles.map(({ url }) => url);
    for await (const puzzleUrl of puzzleUrls.slice(0, 3)) {
      const config = {
        params: {
          puzzleUrl,
        },
      };
      const parsePuzzleResponse = await axios.get("/parse-puzzle", config);
      const parsedPuzzle = parsePuzzleResponse.data;
      // TODO: add parsedPuzzle to parsedPuzzles collection
    }
    // TODO: build a map of profanity words to word counts and store in a profanities collection
  } catch (error) {
    console.log("[main]", "ERROR:", error.message);
  }
};

main();
