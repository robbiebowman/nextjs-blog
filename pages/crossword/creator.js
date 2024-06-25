import Head from "next/head";
import useSWR from 'swr';
import React, { useEffect, useRef, useState } from 'react';
import utilStyles from '../../styles/utils.module.css';
import { formatDate } from '../../lib/date-funcs'
import { hasCompleted, setCompleted } from '../../lib/crossword-cookies';
import styles from './index.module.css';
import Layout from "../../components/layout";
import Crossword from "../../components/crossword/crossword";
import { CrosswordGameSelector } from "../../components/game-selector/game-selector";

export default function MiniCrossword() {

    const [rawPuzzleData, setRawPuzzleData] = useState({
        clues: {
            clues: []
        },
        puzzle: {
            crossword: [
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', '']
            ],      
            acrossWords: [],
            downWords: []
        }
    })
    const [puzzle, setPuzzle] = useState(null)
    const [clues, setClues] = useState(null)

    useEffect(() => {
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

    return (
        <Layout>
            <Head>
                <title>Crossword Creator</title>
            </Head>
            <CrosswordGameSelector selectedTitle="Creator" />
            <div className={styles.puzzleBox}>
                <div className={styles.outerBox}>
                    <div className={styles.title}>
                        <h1>Crossword Creator</h1>
                    </div>
                    <Crossword clues={clues} puzzle={puzzle} />
                </div>
            </div>
        </Layout>
    )
}