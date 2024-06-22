import React, { useEffect, useState, useRef, useCallback } from 'react';
import useSWR from 'swr';
import styles from './mini-crossword-game.module.css';
import 'react-simple-keyboard/build/css/index.css';
import { hasCompleted, setCompleted } from '../../lib/crossword-cookies'
import { CrosswordProvider, DirectionClues, CrosswordGrid } from '@jaredreisinger/react-crossword';
import { formatDate } from '../../lib/date-funcs'
import Crossword from '../crossword/crossword'
import Clues from '../crossword/clues'

export default function MiniCrosswordGame({ date }) {

  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [rawPuzzleData, setRawPuzzleData] = useState(null)
  const [puzzle, setPuzzle] = useState(null)
  const [clues, setClues] = useState(null)
  const [dateTitle, setDateTitle] = useState("")
  const crosswordComponent = useRef();
  const dateString = formatDate(date)

  const [isDoneDate, setDoneDate] = useState(hasCompleted(dateString))

  useEffect(() => {
    const done = hasCompleted(dateString)
    setDoneDate(done)
    if (done && crosswordComponent.current) {
      setTimeout(() => crosswordComponent.current.fillAllAnswers(), 500)

    }
  }, [date])

  useEffect(() => {
    if (rawPuzzleData == null) return;

    setDateTitle(date.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }))
    const cluesWords = rawPuzzleData.clues.clues;
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
        clue: cluesWords.find((c) => c.word == cur.word).clue,
        answer: cur.word.toLowerCase(),
        x: cur.y, // Orientation is reversed for my crossword component
        y: cur.x
      };
      return acc;
    }, {});
    i = 1;
    const down = downWords.reduce((acc, cur) => {
      const coord = coordinateLookup[`${cur.x}-${cur.y}`]
      acc[coord] = {
        clue: cluesWords.find((c) => c.word == cur.word).clue,
        answer: cur.word.toLowerCase(),
        x: cur.y, // Orientation is reversed for my crossword component
        y: cur.x
      };
      return acc;
    }, {});
    const clues = { across: across, down: down };
    setClues(clues)
    const puzzle = rawPuzzleData.puzzle.crossword.map(row => row.map(char => char === ' ' ? '#' : char));
    setPuzzle(puzzle)
  }, [rawPuzzleData]
  );

  const fetcher = (...args) => fetch(...args).then(res => res.json());
  useSWR(() => `/api/mini-crossword?date=${dateString}`, fetcher, {
    onSuccess: (data, key, config) => {
      if (data != rawPuzzleData) {
        setRawPuzzleData(data)
      }
    },
    onError: (err, key, config) => {
      setRawPuzzleData(null)
    },
    revalidateOnFocus: false
  })

  useEffect(() => {
    const hasComplete = hasCompleted(dateString)
    if (hasComplete && crosswordComponent.current) {
      setDoneDate(true)
    }
  }, [puzzle])

  const onCrosswordCorrect = useCallback(() => {
    const correct = crosswordComponent.current.isCrosswordCorrect()
    if (correct && !hasCompleted(dateString) && crosswordComponent.current) {
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
        <p className={styles.successText}>🎉 Completed {dateString} 🎉</p>
      </div>
    ) : ""}
    {puzzle ? (
      <Crossword clues={clues} puzzle={puzzle} />
    ) : ""}
  </div>
  )
}