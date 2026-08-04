const fs = require('node:fs')
const path = require('node:path')
const {
  buildPuzzlePool,
  parseWords,
} = require('../lib/one-shot-wordle')

function getOption(name, fallback) {
  const prefix = `--${name}=`
  const argument = process.argv.slice(2).find((value) => value.startsWith(prefix))
  return argument ? argument.slice(prefix.length) : fallback
}

function getIntegerOption(name, fallback) {
  const value = Number(getOption(name, fallback))
  if (!Number.isInteger(value) || value < 0 || value > 5) {
    throw new Error(`--${name} must be an integer from 0 to 5.`)
  }
  return value
}

const maxHighlighted = getIntegerOption('max-highlighted', 2)
const maxGreens = getIntegerOption('max-greens', 2)
const clueMode = getOption('clues', 'all')
const outputPath = path.resolve(getOption(
  'output',
  path.join('data', 'one-shot-wordle', 'puzzles.json')
))

if (!['all', 'familiar'].includes(clueMode)) {
  throw new Error('--clues must be either "all" or "familiar".')
}

const dataDirectory = path.join(process.cwd(), 'data', 'one-shot-wordle')
const answerWords = parseWords(
  fs.readFileSync(path.join(dataDirectory, 'answers.txt'), 'utf8')
)
const additionalGuesses = parseWords(
  fs.readFileSync(path.join(dataDirectory, 'allowed-guesses.txt'), 'utf8')
)
const acceptedWords = [...new Set([...answerWords, ...additionalGuesses])]
const clueWords = clueMode === 'familiar' ? answerWords : acceptedWords

const puzzles = buildPuzzlePool(clueWords, answerWords, {
  acceptedWords,
  maxClues: clueWords.length,
  maxGreens,
  maxHighlighted,
  poolSize: Number.MAX_SAFE_INTEGER,
})
const output = {
  rules: {
    clueWords: clueMode,
    maxGreens,
    maxHighlighted,
  },
  puzzles,
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`)
console.log(`Wrote ${puzzles.length.toLocaleString()} puzzles to ${outputPath}.`)
