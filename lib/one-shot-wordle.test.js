const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const {
  buildPuzzlePool,
  getFeedback,
  parseWords,
  statesToCode,
} = require('./one-shot-wordle')
const {
  deserializePuzzles,
  serializePuzzles,
} = require('./one-shot-wordle-puzzles')

test('applies Wordle feedback rules to duplicate letters', () => {
  assert.deepEqual(getFeedback('allee', 'apple'), [2, 1, 0, 0, 2])
  assert.deepEqual(getFeedback('eerie', 'serve'), [0, 2, 2, 0, 2])
})

test('checks uniqueness against every accepted word', () => {
  const clueWords = ['break']
  const acceptedWords = ['break', 'bulky', 'books', 'bonks']
  const puzzles = buildPuzzlePool(clueWords, ['bulky'], {
    acceptedWords,
    maxClues: clueWords.length,
    poolSize: 100,
  })

  assert.equal(
    puzzles.some((puzzle) => (
      puzzle.clue === 'break' && puzzle.answer === 'bulky'
    )),
    false
  )
})

test('committed daily puzzles match the configured rules', () => {
  const dataDirectory = path.join(__dirname, '..', 'data', 'one-shot-wordle')
  const answers = new Set(parseWords(
    fs.readFileSync(path.join(dataDirectory, 'answers.txt'), 'utf8')
  ))
  const acceptedWordList = [...new Set([
    ...answers,
    ...parseWords(
      fs.readFileSync(path.join(dataDirectory, 'allowed-guesses.txt'), 'utf8')
    ),
  ])]
  const acceptedWords = new Set(acceptedWordList)
  const { puzzles, rules } = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, 'puzzles.json'), 'utf8')
  )
  const puzzleKeys = new Set()

  assert.deepEqual(rules, {
    clueWords: 'all',
    maxGreens: 2,
    maxHighlighted: 2,
  })
  assert.equal(puzzles.length, 1301)
  assert.deepEqual(deserializePuzzles(serializePuzzles(puzzles)), puzzles)

  for (const puzzle of puzzles) {
    const key = `${puzzle.clue}:${puzzle.states.join('')}:${puzzle.answer}`
    assert.equal(puzzleKeys.has(key), false)
    assert.equal(acceptedWords.has(puzzle.clue), true)
    assert.equal(answers.has(puzzle.answer), true)
    assert.deepEqual(getFeedback(puzzle.clue, puzzle.answer), puzzle.states)
    assert.ok(puzzle.states.filter(Boolean).length <= rules.maxHighlighted)
    assert.ok(
      puzzle.states.filter((state) => state === 2).length <= rules.maxGreens
    )

    const patternCode = statesToCode(puzzle.states)
    const matches = acceptedWordList.filter((word) => (
      statesToCode(getFeedback(puzzle.clue, word)) === patternCode
    ))
    assert.deepEqual(matches, [puzzle.answer])
    puzzleKeys.add(key)
  }
})
