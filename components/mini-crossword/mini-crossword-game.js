import React, { useEffect, useState, useRef, useCallback } from 'react';
import useSWR from 'swr';
import styles from './mini-crossword-game.module.css';
import 'react-simple-keyboard/build/css/index.css';
import { formatDate } from '../../lib/date-funcs'
import Crossword from '../crossword/crossword'

export default function MiniCrosswordGame({ date }) {

  const [rawPuzzleData, setRawPuzzleData] = useState(null)
  const [puzzle, setPuzzle] = useState(null)
  const [clues, setClues] = useState(null)
  const [dateTitle, setDateTitle] = useState("")
  const dateString = formatDate(date)

  console.log(`Loaded ${date}`)

  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const {mutate} = useSWR(() => `/api/mini-crossword?date=${dateString}`, fetcher, {
    onSuccess: (data, key, config) => {
      if (JSON.stringify(data) != JSON.stringify(rawPuzzleData)) {
        setRawPuzzleData(data)
      }
    },
    onError: (err, key, config) => {
      setRawPuzzleData(null)
    }
  })

  useEffect(() => {
    console.log(`Checking puzzle data ${date}`)
    if (rawPuzzleData == null) {
      mutate();
      return;
    }
    console.log('Check complete')

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
        y: cur.x,
        direction: 'across',
        number: coord
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
        y: cur.x,
        direction: 'down',
        number: coord
      };
      return acc;
    }, {});
    const clues = { across: across, down: down };
    setClues(clues)
    const puzzle = rawPuzzleData.puzzle.crossword.map(row => row.map(char => char === ' ' ? '#' : char));
    setPuzzle(puzzle)
  }, [rawPuzzleData]
  );


  return (<div className={styles.outerBox}>
    <div className={styles.title}>
      <h1>Mini Crossword - {dateTitle}</h1>
    </div>
    <Crossword clues={clues} puzzle={puzzle} />
  </div>
  )
}