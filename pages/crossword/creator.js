import Head from "next/head";
import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import Layout from "../../components/layout";
import Crossword from "../../components/crossword/crossword";
import { CrosswordGameSelector } from "../../components/game-selector/game-selector";
import { Spinner } from '../../components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

export default function MiniCrossword() {
    const [guessGrid, setGuessGrid] = useState([
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ]);
    const [rawPuzzleData, setRawPuzzleData] = useState({
        clues: { clues: [] },
        puzzle: {
            crossword: Array(5).fill(Array(5).fill('')),
            acrossWords: [],
            downWords: []
        }
    });
    const [puzzle, setPuzzle] = useState(null);
    const [clues, setClues] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/fill-crossword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(guessGrid),
            });

            if (response.status === 204) {
                setError("No valid crossword solution found. Try adjusting your grid!");
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fill crossword');
            }

            const data = await response.json();
            if (data.filledPuzzle) {
                setGuessGrid(data.filledPuzzle);
                setSuccess(true);
            }
        } catch (e) {
            console.error(`Error: ${e.message}`);
            setError("An error occurred while filling the crossword. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const { clues: { clues: cluesWords }, puzzle: { acrossWords, downWords, crossword } } = rawPuzzleData;

        const coordinates = [...acrossWords, ...downWords]
            .map(w => ({ x: w.x, y: w.y }))
            .sort((a, b) => a.x - b.x || a.y - b.y);

        const coordinateLookup = new Map();
        let x = 1;
        coordinates.forEach(coord => {
            if (!coordinateLookup.has(`${coord.x}-${coord.y}`)) {
                coordinateLookup.set(`${coord.x}-${coord.y}`, x++);
            }
        });

        const createClueObject = (words, direction) => words.reduce((acc, cur) => {
            const coord = coordinateLookup.get(`${cur.x}-${cur.y}`);
            acc[coord] = {
                clue: cluesWords.find(c => c.word === cur.word)?.clue,
                answer: cur.word.toLowerCase(),
                x: cur.y,
                y: cur.x,
                direction,
                number: coord
            };
            return acc;
        }, {});

        setClues({
            across: createClueObject(acrossWords, 'across'),
            down: createClueObject(downWords, 'down')
        });

        setPuzzle(crossword.map(row => row.map(char => char === ' ' ? '#' : char)));
    }, [rawPuzzleData]);

    console.log(`Guess grid: ${JSON.stringify(guessGrid)}`)

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
                    <Crossword
                        puzzle={puzzle}
                        clues={clues}
                        guessGrid={guessGrid}
                        setGuessGrid={setGuessGrid}
                        onActiveClueChange={() => { }}
                    />
                    <div className={styles.actionArea}>
                        <button
                            type="button"
                            className="btn btn-dark"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner /> : 'Fill in puzzle'}
                        </button>
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert>
                                <AlertTitle>Success!</AlertTitle>
                                <AlertDescription>Your crossword has been filled successfully.</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}