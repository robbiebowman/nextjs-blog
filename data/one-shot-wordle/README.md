# One-Shot Wordle data

The game uses the two word sets extracted from the original Wordle source:

- `answers.txt`: the 2,315 curated possible answers.
- `allowed-guesses.txt`: the 10,657 additional words accepted as guesses.
- `puzzles.json`: every qualifying puzzle for the currently configured rules.

Sources:

- https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b
- https://gist.github.com/cfreshman/cdcdf777450c5b5301e439061d29694c

The game combines both files when selecting clue words, validating player input,
and checking clue uniqueness. A unique match is eligible as a solution only when
it also appears in `answers.txt`.

Regenerate `puzzles.json` after changing the rules:

```sh
npm run generate:one-shot-wordle
```

The generator also accepts `--max-highlighted`, `--max-greens`, `--clues`, and
`--output` options. For example, `--clues=familiar --max-highlighted=3` limits
clues to the curated answer list and allows up to three highlighted tiles.
