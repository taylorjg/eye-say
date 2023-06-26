# Description

:warning: Not for the easily offended! :warning:

This is just a silly little project to count all the occurrences of rude words in all the available Private Eye crossword
puzzle clues and then make a word cloud out of the data.

I am reusing some serverless functions that I created for a different purpose. To prepare the word cloud data, I do the following:

* I grab a list of all the available puzzles using [list-puzzles](https://github.com/taylorjg/print-puz-serverless#list-puzzles)
* I then parse each puzzle using [parse-puzzle](https://github.com/taylorjg/print-puz-serverless#parse-puzzle)
* I store each parsed puzzle in a MongoDB database
* I then search all the clues in all the puzzles for occurrences of words in [badwords](https://www.npmjs.com/package/badwords)
* Finally, I save the list of words & counts in a [JSON file](src/words.json)

I then have a little React app that renders the word cloud using [@visx/wordcloud](https://airbnb.io/visx/docs/wordcloud).

# App Name

Why is it called `eye-say` ? It's a play on the expression, "I say!", but following the Private Eye
pattern of naming things `Eye` + `Something` e.g. `EyePlayer` and then converted to follow normal package name conventions:

> The "name" field contains your package's name, and must be lowercase and one word, and may contain hyphens and underscores.

# See Also

If you like this sort of silliness, you might also enjoy the following:

:warning: Not for the easily offended! :warning:

* [Harold Pinter's Nursery Rhymes](https://www.private-eye.co.uk/eyeplayer/play/20)

:warning: Not for the easily offended! :warning:

# Links

* [List of Private Eye Crosswords (in .puz file format)](https://www.private-eye.co.uk/pictures/crossword/download/)
* [badwords](https://www.npmjs.com/package/badwords)
* [My serverless functions](https://github.com/taylorjg/print-puz-serverless#serverless-functions)
* [My other web app that uses the serverless functions](https://github.com/taylorjg/print-puz-react-vite)
