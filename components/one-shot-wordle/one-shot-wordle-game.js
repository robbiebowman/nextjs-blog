import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { deserializePuzzles } from '../../lib/one-shot-wordle-puzzles'
import styles from './one-shot-wordle-game.module.css'

const STATE_NAMES = ['absent', 'present elsewhere', 'correct position']
const STATE_CLASSES = ['absent', 'present', 'correct']
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
const COMPLETED_DAYS_STORAGE_KEY = 'one-shot-wordle-completed-days'

function getLocalDayNumber(date = new Date()) {
  return Math.floor(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ) / MILLISECONDS_PER_DAY)
}

function getDailyPuzzleIndex(dayNumber, puzzleCount) {
  return ((dayNumber % puzzleCount) + puzzleCount) % puzzleCount
}

function formatPuzzleDate(dayNumber) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(dayNumber * MILLISECONDS_PER_DAY))
}

function loadCompletedDays() {
  try {
    const savedDays = JSON.parse(
      window.localStorage.getItem(COMPLETED_DAYS_STORAGE_KEY) || '[]'
    )
    return new Set(savedDays.filter(Number.isInteger))
  } catch {
    return new Set()
  }
}

function saveCompletedDays(completedDays) {
  try {
    window.localStorage.setItem(
      COMPLETED_DAYS_STORAGE_KEY,
      JSON.stringify([...completedDays].sort((a, b) => a - b))
    )
  } catch {
    // The game remains playable when storage is unavailable.
  }
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
  const [selectedDay, setSelectedDay] = useState(null)
  const [todayDay, setTodayDay] = useState(null)
  const [completedDays, setCompletedDays] = useState(new Set())
  const [entry, setEntry] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('neutral')
  const inputRef = useRef(null)
  const puzzles = useMemo(
    () => deserializePuzzles(serializedPuzzles),
    [serializedPuzzles]
  )
  const validWordSet = useMemo(() => new Set(validWords.split(',')), [validWords])
  const answerSet = useMemo(() => new Set(answers?.split(',') || []), [answers])
  const puzzle = selectedDay === null
    ? null
    : puzzles[getDailyPuzzleIndex(selectedDay, puzzles.length)]
  const isSolved = selectedDay !== null && completedDays.has(selectedDay)
  const earliestDay = todayDay === null ? null : todayDay - puzzles.length + 1
  const isToday = selectedDay === todayDay

  useEffect(() => {
    let timeoutId

    function showTodaysPuzzle() {
      const nextTodayDay = getLocalDayNumber()
      setTodayDay(nextTodayDay)
      setSelectedDay(nextTodayDay)
      setEntry('')
      setMessage('')
      setMessageType('neutral')
      timeoutId = window.setTimeout(
        showTodaysPuzzle,
        getMillisecondsUntilTomorrow() + 100
      )
    }

    setCompletedDays(loadCompletedDays())
    showTodaysPuzzle()
    return () => window.clearTimeout(timeoutId)
  }, [puzzles.length])

  function selectDay(dayNumber) {
    setSelectedDay(dayNumber)
    setEntry('')
    setMessage('')
    setMessageType('neutral')
  }

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

    if (submittedWord === puzzle.answer) {
      const nextCompletedDays = new Set(completedDays).add(selectedDay)
      setCompletedDays(nextCompletedDays)
      saveCompletedDays(nextCompletedDays)
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

      {selectedDay !== null && (
        <nav className={styles.dayNavigator} aria-label="Choose puzzle day">
          <button
            aria-label="Play previous day's puzzle"
            disabled={selectedDay <= earliestDay}
            onClick={() => selectDay(selectedDay - 1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <div className={styles.dayLabel}>
            <strong>{isToday ? 'Today' : formatPuzzleDate(selectedDay)}</strong>
            <span>
              {isSolved && <Check aria-hidden="true" size={15} strokeWidth={3} />}
              {isSolved ? 'Completed' : 'Not completed'}
            </span>
          </div>
          <button
            aria-label="Play next day's puzzle"
            disabled={isToday}
            onClick={() => selectDay(selectedDay + 1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </nav>
      )}

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
              Even though the clue may be obscure, the answer is not
            </p>
          )}

          {isSolved ? (
            <div className={styles.successScreen} aria-live="polite">
              <div className={styles.successHeading}>
                <span className={styles.successIcon} aria-hidden="true">
                  <Sparkles size={24} />
                </span>
                <p>Brilliant!</p>
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
              {!isToday && (
                <button
                  className={styles.returnButton}
                  onClick={() => selectDay(todayDay)}
                  type="button"
                >
                  <ArrowLeft aria-hidden="true" size={17} />
                  Return to today
                </button>
              )}
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
