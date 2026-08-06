import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { deserializePuzzles } from '../../lib/one-shot-wordle-puzzles'
import styles from './one-shot-wordle-game.module.css'

const STATE_NAMES = ['absent', 'present elsewhere', 'correct position']
const STATE_CLASSES = ['absent', 'present', 'correct']
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

function getDailyPuzzleIndex(puzzleCount) {
  const today = new Date()
  const localDay = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  return Math.floor(localDay / MILLISECONDS_PER_DAY) % puzzleCount
}

function getMillisecondsUntilTomorrow() {
  const now = new Date()
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  )
  return tomorrow.getTime() - now.getTime()
}

export default function OneShotWordleGame({
  answerCount,
  serializedPuzzles,
  validWords,
  answers,
}) {
  const [puzzleIndex, setPuzzleIndex] = useState(null)
  const [entry, setEntry] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('neutral')
  const [isSolved, setIsSolved] = useState(false)
  const inputRef = useRef(null)
  const puzzles = useMemo(
    () => deserializePuzzles(serializedPuzzles),
    [serializedPuzzles]
  )
  const validWordSet = useMemo(() => new Set(validWords.split(',')), [validWords])
  const answerSet = useMemo(() => new Set(answers?.split(',') || []), [answers])
  const puzzle = puzzleIndex === null ? null : puzzles[puzzleIndex]

  useEffect(() => {
    let timeoutId

    function showTodaysPuzzle() {
      setPuzzleIndex(getDailyPuzzleIndex(puzzles.length))
      setEntry('')
      setAttempts(0)
      setMessage('')
      setMessageType('neutral')
      setIsSolved(false)
      timeoutId = window.setTimeout(
        showTodaysPuzzle,
        getMillisecondsUntilTomorrow() + 100
      )
    }

    showTodaysPuzzle()
    return () => window.clearTimeout(timeoutId)
  }, [puzzles.length])

  function handleEntryChange(event) {
    setEntry(
      event.target.value
        .replace(/[^a-z]/gi, '')
        .slice(0, 5)
        .toUpperCase()
    )
    setMessage('')
    setMessageType('neutral')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!puzzle || isSolved) return

    const submittedWord = entry.toLowerCase()

    if (submittedWord.length !== 5) {
      setMessage('Enter a five-letter word.')
      setMessageType('error')
      return
    }

    if (!validWordSet.has(submittedWord)) {
      setMessage('That word is not in the dictionary.')
      setMessageType('error')
      return
    }

    const nextAttemptCount = attempts + 1
    setAttempts(nextAttemptCount)

    if (submittedWord === puzzle.answer) {
      setMessage(`Solved in ${nextAttemptCount} ${nextAttemptCount === 1 ? 'try' : 'tries'}.`)
      setMessageType('success')
      setIsSolved(true)
      return
    }

    setMessage('That word does not fit the clue. Try again.')
    setMessageType('error')
    inputRef.current?.select()
  }

  return (
    <div className={styles.game}>
      <header className={styles.gameHeader}>
        <div>
          <h1>One-Shot Wordle</h1>
        </div>
      </header>

      {puzzle ? (
        <section className={styles.playArea} aria-label="Given clue">
          <div
            aria-label={`${puzzle.clue.toUpperCase()} Wordle clue`}
            className={styles.tiles}
            role="group"
          >
            {puzzle.clue.split('').map((letter, index) => (
              <div
                aria-label={`${letter.toUpperCase()}: ${STATE_NAMES[puzzle.states[index]]}`}
                className={`${styles.tile} ${styles[STATE_CLASSES[puzzle.states[index]]]}`}
                key={`${letter}-${index}`}
              >
                {letter}
              </div>
            ))}
          </div>

          {!answerSet.has(puzzle.clue) && (
            <p style={{ fontStyle: 'italic', fontSize: '0.9em', color: '#666', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
              Even though this clue is obscure, the answer won't be
            </p>
          )}

          {isSolved ? (
            <div className={styles.successScreen} aria-live="polite">
              <div className={styles.successHeading}>
                <span className={styles.successIcon} aria-hidden="true">
                  <Sparkles size={24} />
                </span>
                <div>
                  <p>Brilliant!</p>
                  <h2>{message}</h2>
                </div>
              </div>

              <div
                aria-label={`${puzzle.answer.toUpperCase()}, all letters correct`}
                className={styles.solvedTiles}
                role="img"
              >
                {puzzle.answer.split('').map((letter, index) => (
                  <span
                    aria-hidden="true"
                    className={styles.solvedTile}
                    key={`${letter}-${index}`}
                    style={{ '--tile-index': index }}
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <p className={styles.successNote}>
                <Check aria-hidden="true" size={18} strokeWidth={3} />
                You found the only possible answer
              </p>
            </div>
          ) : (
            <>
              <form className={styles.answerForm} onSubmit={handleSubmit}>
                <label htmlFor="one-shot-answer">Find the only possible answer</label>
                <div className={styles.answerRow}>
                  <input
                    autoCapitalize="characters"
                    autoComplete="off"
                    id="one-shot-answer"
                    inputMode="text"
                    maxLength={5}
                    onChange={handleEntryChange}
                    placeholder="ANSWER"
                    ref={inputRef}
                    spellCheck="false"
                    type="text"
                    value={entry}
                  />
                  <button type="submit">
                    Check
                    <ArrowRight aria-hidden="true" size={19} />
                  </button>
                </div>
              </form>

              <p
                aria-live="polite"
                className={`${styles.message} ${styles[messageType]}`}
              >
                {message || '\u00a0'}
              </p>
            </>
          )}
        </section>
      ) : (
        <div className={styles.loading} aria-live="polite">
          Loading today&apos;s puzzle...
        </div>
      )}

    </div>
  )
}
