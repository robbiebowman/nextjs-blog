import React, { useEffect, useState, useRef, useCallback } from 'react';
import useSWR from 'swr';
import styles from './mini-crossword-game.module.css';
import 'react-simple-keyboard/build/css/index.css';
import { hasCompleted, setCompleted } from '../../lib/crossword-cookies'
import { CrosswordProvider, DirectionClues, CrosswordGrid } from '@jaredreisinger/react-crossword';
import { formatDate } from '../../lib/date-funcs'

export default function MiniCrosswordGame({ date }) {

  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [rawPuzzleData, setRawPuzzleData] = useState(null)
  const [puzzle, setPuzzle] = useState(null)
  const [dateTitle, setDateTitle] = useState("")
  const crosswordComponent = useRef();

  const [isDoneDate, setDoneDate] = useState(hasCompleted(formatDate(date)))

  useEffect(() => {
    const done = hasCompleted(formatDate(date))
    setDoneDate(done)
    if (done && crosswordComponent.current) {
      setTimeout(() => crosswordComponent.current.fillAllAnswers(), 500)
      
    }
  }, [date])

  useEffect(() => {
    if (rawPuzzleData == null) return;

    setDateTitle(date.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }))
    const clues = rawPuzzleData.clues.clues;
    const acrossWords = rawPuzzleData.puzzle.acrossWords;
    const downWords = rawPuzzleData.puzzle.downWords;

    const coordinates = acrossWords.concat(downWords)
      .map(w => { return { x: w.x, y: w.y } })
      .sort((a, b) => {
        return a.x - b.x || a.y - b.y;
      });

    const coordinateLookup = new Map();
    var x = 1
    for (i in coordinates) {
      const coord = coordinates[i]
      if (!coordinateLookup[`${coord.x}-${coord.y}`]) {
        coordinateLookup[`${coord.x}-${coord.y}`] = x++
      }
    }

    var i = 1;
    const across = acrossWords.reduce((acc, cur) => {
      const coord = coordinateLookup[`${cur.x}-${cur.y}`]
      acc[coord] = {
        clue: clues.find((c) => c.word == cur.word).clue,
        answer: cur.word.toUpperCase(),
        row: cur.x,
        col: cur.y
      };
      return acc;
    }, {});
    i = 1;
    const down = downWords.reduce((acc, cur) => {
      const coord = coordinateLookup[`${cur.x}-${cur.y}`]
      acc[coord] = {
        clue: clues.find((c) => c.word == cur.word).clue,
        answer: cur.word.toUpperCase(),
        row: cur.x,
        col: cur.y
      };
      return acc;
    }, {});
    const puzzle = { across: across, down: down };
    setPuzzle(puzzle)
  }, [rawPuzzleData]
  );

  const fetcher = (...args) => fetch(...args).then(res => res.json());
  useSWR(() => `/api/mini-crossword?date=${formatDate(date)}`, fetcher, {
    onSuccess: (data, key, config) => {
      setRawPuzzleData(data)
    },
    onError: (err, key, config) => {
      setRawPuzzleData(null)
    }
  })

  useEffect(() => {
    const dateStr = formatDate(date)
    const hasComplete = hasCompleted(dateStr)
    console.log(`Has done? ${dateStr} ${hasCompleted(dateStr)}`)
    if (hasComplete && crosswordComponent.current) {
      setDoneDate(true)
    }
  }, [puzzle])

  const onCrosswordCorrect = useCallback((row, col, char) => {
    const dateString = formatDate(date)
    const correct = crosswordComponent.current.isCrosswordCorrect()
    if (correct && !hasCompleted(dateString) && crosswordComponent.current) {
      console.log(`You've completed ${dateString}, coorect is: ${JSON.stringify(correct)}`)
      setCompleted(dateString)
      setDoneDate(true)
    }
  }, [crosswordComponent, date])

  return (<div className={styles.outerBox}>
    <div className={styles.title}>
      <h1>Mini Crossword - {dateTitle}</h1>
    </div>
    {isDoneDate ? (
      <div className={`${styles.resultBox} ${styles.successBox}`}>
        <p className={styles.successText}>Nicely done!</p>
      </div>
    ) : ""}
    {puzzle ? (
      <CrosswordProvider ref={crosswordComponent} data={puzzle} onCellChange={(correct) => onCrosswordCorrect(correct)} storageKey={formatDate(date)} useStorage>
        <div className={styles.mainBox}>
          <div className={styles.crossword}><CrosswordGrid /></div>
          <div className={styles.clues}><DirectionClues label="Across" direction="across" /></div>
          <div className={styles.clues}><DirectionClues className={styles.clues} label="Down" direction="down" /></div>
        </div>
      </CrosswordProvider>
    ) : ""}
  </div>
  )
}