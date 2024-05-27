import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import styles from './mini-crossword-game.module.css';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { Crossword, CrosswordProvider, DirectionClues, CrosswordGrid } from '@jaredreisinger/react-crossword';
import { isMobile } from 'react-device-detect';

function formatDate(date) {
  // Create a new Date object
  let d = new Date(date);

  // Get the year, month, and day from the Date object
  let year = d.getFullYear();
  let month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  let day = String(d.getDate()).padStart(2, '0');

  // Construct the formatted date string
  return `${year}-${month}-${day}`;
}

export default function MiniCrosswordGame({date}) {

  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [rawPuzzleData, setRawPuzzleData] = useState(null)
  const [puzzle, setPuzzle] = useState(null)
  const [dateTitle, setDateTitle] = useState("")
  const [isCorrect, setCorrect] = useState(false)
  const crosswordComponent = useRef();

  useEffect(() => {
    if (rawPuzzleData == null) return;
    
    crosswordComponent.current ? console.log("Storagekey: " + JSON.stringify(crosswordComponent)) : ""

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
    for (i in coordinates) {
      const coord = coordinates[i]
      if (!coordinateLookup[`${coord.x}-${coord.y}`]) {
        coordinateLookup[`${coord.x}-${coord.y}`] = parseInt(i) + 1
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

  const onCrosswordCorrect = (correct) => {
    setCorrect(correct)
  }

  return (<div>
    <div className={styles.title}>
      <h1>Mini Crossword - {dateTitle}</h1>
    </div>
    {puzzle ? (
      <CrosswordProvider ref={crosswordComponent} data={puzzle} onCrosswordCorrect={(correct) => onCrosswordCorrect(correct)} storageKey={formatDate(date)} useStorage>
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