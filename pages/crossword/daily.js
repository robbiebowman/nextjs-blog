import Head from "next/head";
import useSWR from 'swr';
import React, { useEffect, useRef, useState } from 'react';
import utilStyles from '../../styles/utils.module.css';
import { formatDate } from '../../lib/date-funcs'
import { hasCompleted, setCompleted } from '../../lib/crossword-cookies';
import styles from './index.module.css';
import Layout from "../../components/layout";
import Crossword from "../../components/crossword/crossword-game";
import { CrosswordGameSelector } from "../../components/game-selector/game-selector";

export default function DailyCrossword() {

    const getAvailableDates = () => {
        const today = new Date()
        const listedDates = [today]
        for (let i = 1; i < 6; i++) {
            const newDate = new Date()
            newDate.setDate(today.getDate() - i)
            listedDates[i] = newDate
        }
        return listedDates
    }

    const [selectedDate, setSelectedDate] = useState(new Date())
    const availableDates = useRef(getAvailableDates())

    const [rawPuzzleData, setRawPuzzleData] = useState(null)
    const [puzzle, setPuzzle] = useState(null)
    const [clues, setClues] = useState(null)
    const [dateTitle, setDateTitle] = useState("")
    const dateString = formatDate(selectedDate)

    const fetcher = (...args) => fetch(...args).then(res => res.json());
    const { mutate } = useSWR(() => `/api/mini-crossword?date=${dateString}`, fetcher, {
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
        console.log(`Checking puzzle data ${selectedDate}`)
        if (rawPuzzleData == null) {
            mutate();
            return;
        }
        console.log('Check complete')

        setDateTitle(selectedDate.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }))
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
                <title>Daily Mini Crossword</title>
            </Head>
            <CrosswordGameSelector selectedTitle="Daily" />
            <div className={styles.puzzleBox}>
                <div className={styles.outerBox}>
                    <div className={styles.title}>
                        <h1>Mini Crossword - {dateTitle}</h1>
                    </div>
                    <Crossword clues={clues} puzzle={puzzle} />
                </div>
            </div>
            <div className={styles.dateSelector}>
                {
                    availableDates.current ? availableDates.current.map((date) => {
                        const dateString = date.toLocaleDateString('en-us', { month: "short", day: "numeric" })
                        const buttonStyle = date.getDate() == selectedDate.getDate() ? "btn btn-dark" : "btn btn-light"
                        return (<button key={date.getDate()} type="button"
                            className={buttonStyle}
                            onClick={() => setSelectedDate(date)}>{dateString}</button>)
                    }) : ""
                }
            </div>
        </Layout>
    )

}