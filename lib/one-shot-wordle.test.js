const assert = require('node:assert/strict')
const test = require('node:test')
const {
  buildPuzzlePool,
  getFeedback,
} = require('./one-shot-wordle')

test('applies Wordle feedback rules to duplicate letters', () => {
  assert.deepEqual(getFeedback('allee', 'apple'), [2, 1, 0, 0, 2])
  assert.deepEqual(getFeedback('eerie', 'serve'), [0, 2, 2, 0, 2])
})

test('checks uniqueness against every accepted word', () => {
  const acceptedWords = ['break', 'bulky', 'books', 'bonks']
  const puzzles = buildPuzzlePool(acceptedWords, ['bulky'], {
    maxClues: acceptedWords.length,
    poolSize: 100,
  })

  assert.equal(
    puzzles.some((puzzle) => (
      puzzle.clue === 'break' && puzzle.answer === 'bulky'
    )),
    false
  )
})
