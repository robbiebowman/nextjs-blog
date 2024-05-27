import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import styles from './mini-crossword-game.module.css';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { Crossword, CrosswordProvider, DirectionClues, CrosswordGrid } from '@jaredreisinger/react-crossword';
import { isMobile } from 'react-device-detect';

export default function MiniCrosswordGame() {

  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [rawPuzzleData, setRawPuzzleData] = useState(null)
  const [puzzle, setPuzzle] = useState(null)
  const [isCorrect, setCorrect] = useState(false)
  const crosswordComponent = useRef();

  useEffect(() => {
    if (rawPuzzleData == null) return;
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
  useSWR(() => `/api/mini-crossword`, fetcher, {
    onSuccess: (data, key, config) => {
      setRawPuzzleData(data)
    },
    onError: (err, key, config) => {
      setRawPuzzleData(null)
    }
  })

  const onCellChanged = () => {
    console.log(`Is complete called`)
    const correct = crosswordComponent.current.isCrosswordCorrect()
    console.log(`${Date.now()} Iscorrect: ${correct}`)
    setCorrect(correct)
  }

  return (<div className={styles.mainBox}>
    {isCorrect ? "Done" : "Not Done"}
    {puzzle ? (
      <CrosswordProvider ref={crosswordComponent} data={puzzle} onCellChange={() => onCellChanged()}>
        <div>
          <CrosswordGrid />
          <DirectionClues direction="across" />
          <DirectionClues direction="down" />
        </div>
      </CrosswordProvider>
    ) : ""}
  </div>
  )
}