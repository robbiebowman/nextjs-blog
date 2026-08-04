const RECORD_LENGTH = 12

function statesToCode(states) {
  return states.reduce((code, state) => code * 3 + state, 0)
}

function codeToStates(code) {
  const states = Array(5).fill(0)

  for (let index = states.length - 1; index >= 0; index--) {
    states[index] = code % 3
    code = Math.floor(code / 3)
  }

  return states
}

function serializePuzzles(puzzles) {
  return puzzles.map((puzzle) => (
    `${puzzle.clue}${puzzle.answer}${statesToCode(puzzle.states)
      .toString(36)
      .padStart(2, '0')}`
  )).join('')
}

function deserializePuzzles(serializedPuzzles) {
  if (serializedPuzzles.length % RECORD_LENGTH !== 0) {
    throw new Error('Invalid serialized One-Shot Wordle puzzles.')
  }

  const puzzles = []
  for (let offset = 0; offset < serializedPuzzles.length; offset += RECORD_LENGTH) {
    puzzles.push({
      clue: serializedPuzzles.slice(offset, offset + 5),
      answer: serializedPuzzles.slice(offset + 5, offset + 10),
      states: codeToStates(
        Number.parseInt(serializedPuzzles.slice(offset + 10, offset + 12), 36)
      ),
    })
  }

  return puzzles
}

module.exports = {
  deserializePuzzles,
  serializePuzzles,
}
