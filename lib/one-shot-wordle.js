const WORD_LENGTH = 5

function parseWords(text) {
  return [...new Set(
    text
      .split(/\r?\n/)
      .map((word) => word.trim().toLowerCase())
      .filter((word) => /^[a-z]{5}$/.test(word))
  )]
}

function getFeedback(guess, answer) {
  const states = Array(WORD_LENGTH).fill(0)
  const remaining = Object.create(null)

  for (let index = 0; index < WORD_LENGTH; index++) {
    if (guess[index] === answer[index]) {
      states[index] = 2
    } else {
      remaining[answer[index]] = (remaining[answer[index]] || 0) + 1
    }
  }

  for (let index = 0; index < WORD_LENGTH; index++) {
    if (states[index] === 2) continue

    const letter = guess[index]
    if ((remaining[letter] || 0) > 0) {
      states[index] = 1
      remaining[letter]--
    }
  }

  return states
}

function statesToCode(states) {
  return states.reduce((code, state) => code * 3 + state, 0)
}

function createRandom(seed) {
  let state = seed >>> 0

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function shuffle(items, seed) {
  const random = createRandom(seed)
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    const value = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = value
  }

  return shuffled
}

function buildPuzzlePool(clueWords, answerWords, options = {}) {
  const {
    maxClues = 600,
    maxGreens = 2,
    maxHighlighted = 3,
    poolSize = 750,
    seed = 0x1badb002,
  } = options
  const puzzles = []
  const clues = shuffle(clueWords, seed).slice(0, maxClues)
  const answerSet = new Set(answerWords)

  for (const clue of clues) {
    const matchesByPattern = new Map()

    for (let wordIndex = 0; wordIndex < clueWords.length; wordIndex++) {
      const word = clueWords[wordIndex]
      const states = getFeedback(clue, word)
      const greenCount = states.filter((state) => state === 2).length
      const highlightedCount = states.filter((state) => state !== 0).length

      if (greenCount > maxGreens || highlightedCount > maxHighlighted) continue

      const code = statesToCode(states)
      matchesByPattern.set(
        code,
        matchesByPattern.has(code) ? -1 : wordIndex
      )
    }

    for (const [code, wordIndex] of matchesByPattern) {
      if (wordIndex < 0) continue

      const answer = clueWords[wordIndex]
      if (!answerSet.has(answer) || answer === clue) continue

      puzzles.push({
        answer,
        clue,
        states: codeToStates(code),
      })
    }
  }

  return shuffle(puzzles, seed + 1).slice(0, poolSize)
}

function codeToStates(code) {
  const states = Array(WORD_LENGTH).fill(0)

  for (let index = WORD_LENGTH - 1; index >= 0; index--) {
    states[index] = code % 3
    code = Math.floor(code / 3)
  }

  return states
}

module.exports = {
  buildPuzzlePool,
  getFeedback,
  parseWords,
  statesToCode,
}
