import Head from "next/head";
import React, { useEffect, useState, useMemo } from 'react';
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
    const [clues, setClues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [filledPuzzle, setFilledPuzzle] = useState(null);
    const [originalPuzzle, setOriginalPuzzle] = useState(null);
    const [editable, setEditable] = useState(true);

    const handleClueChange = (index, newClue) => {
        setClues(prevClues =>
            prevClues.map((clue, i) =>
                i === index ? { ...clue, userClue: newClue } : clue
            )
        );
    };

    const allCluesFilled = useMemo(() => {
        return clues.every(clue => clue.userClue && clue.userClue.trim() !== '');
    }, [clues]);

    const handleShareSubmit = () => {
        console.log({
            grid: guessGrid,
            clues: clues
        });
        // You could also send this data to an API endpoint here
    };

    const handleClear = () => {
        setGuessGrid(oldGrid =>
            oldGrid.map(row =>
                row.map(cell => cell === '#' ? '#' : '')
            )
        );
        setFilledPuzzle(null);
        setOriginalPuzzle(null);
        setSuccess(false);
        setEditable(true)
        setError(null);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        setFilledPuzzle(null);
        setOriginalPuzzle([...guessGrid]);

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
                setFilledPuzzle(data.filledPuzzle);
                setSuccess(true);
            }
        } catch (e) {
            console.error(`Error: ${e.message}`);
            setError("An error occurred while filling the crossword. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const crosswordIsFull = useMemo(() => {
        for (const row of guessGrid) {
            for (const c of row) {
                if (c == '') {
                    return false
                }
            }
        }
        return true
    }, [guessGrid])

    const handleAccept = () => {
        setGuessGrid(filledPuzzle);
        setFilledPuzzle(null);
        setOriginalPuzzle(null);
    };

    const handleReject = () => {
        setGuessGrid(originalPuzzle);
        setFilledPuzzle(null);
        setOriginalPuzzle(null);
        setSuccess(false);
    };

    function extractCrosswordWords(crossword) {
        setEditable(false)
        const words = [];
        let wordNumber = 1;
        const numberedCells = Array(5).fill().map(() => Array(5).fill(0));

        // Helper function to extract words from a line
        function extractWordsFromLine(line, lineIndex, isVertical) {
            for (let i = 0; i < line.length; i++) {
                if (line[i] !== '#') {
                    if (i === 0 || line[i - 1] === '#') {
                        const word = line.slice(i).split('#')[0];
                        if (word.length > 1) {
                            const x = isVertical ? lineIndex : i;
                            const y = isVertical ? i : lineIndex;
                            if (numberedCells[y][x] === 0) {
                                numberedCells[y][x] = wordNumber++;
                            }
                            words.push({
                                direction: isVertical ? 'down' : 'across',
                                number: numberedCells[y][x],
                                word: word.toLowerCase()
                            });
                        }
                    }
                }
            }
        }

        // Extract horizontal words
        for (let i = 0; i < 5; i++) {
            const row = crossword[i].join('');
            extractWordsFromLine(row, i, false);
        }

        // Extract vertical words
        for (let j = 0; j < 5; j++) {
            const column = crossword.map(row => row[j]).join('');
            extractWordsFromLine(column, j, true);
        }

        setClues(words);
    }

    const handleClueCancel = () => {
        setEditable(true)
        setClues([])
        setSuccess(null)
        setError(null)
    }

    const handleFillClues = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        setFilledPuzzle(null);

        try {
            const response = await fetch('/api/fill-clues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(guessGrid),
            });

            if (!response.ok) {
                throw new Error('Failed to fill clues');
            }

            const data = await response.json();
            if (data.clues) {
                setClues(data.clues);
                setSuccess(true);
            }
        } catch (e) {
            console.error(`Error: ${e.message}`);
            setError("An error occurred generating clues.");
        } finally {
            setIsLoading(false);
        }
    };

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
                    <p>Hint: Press Space to toggle black boxes</p>
                    <Crossword
                        puzzle={filledPuzzle || guessGrid}
                        clues={clues}
                        guessGrid={filledPuzzle || guessGrid}
                        setGuessGrid={setGuessGrid}
                        disabled={!editable}
                        isEditMode={true}
                    />
                    {
                        editable &&
                        <div className={styles.actionArea}>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={isLoading || filledPuzzle}
                            >
                                {isLoading ? <Spinner /> : 'Fill in puzzle'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClear}
                            >
                                Clear grid
                            </button>
                        </div>
                    }
                    {
                        crosswordIsFull &&
                        <div className={styles.actionArea}>
                            <button
                                type="button"
                                className="btn btn-info"
                                onClick={() => extractCrosswordWords(guessGrid)}
                                disabled={!crosswordIsFull || !editable}
                            >
                                Start clues
                            </button>
                        </div>
                    }
                    {
                        !editable && crosswordIsFull &&
                        <div className={styles.actionArea}>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleFillClues}
                            >
                                Fill in clues
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClueCancel}
                                aria-label="Go back to edit mode"
                            >
                                Back to drawing board
                            </button>
                        </div>
                    }
                    {filledPuzzle && (
                        <div className={styles.actionArea}>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleAccept}
                            >
                                Accept fill
                            </button>
                            <button
                                type="button"
                                className="btn btn-info"
                                onClick={handleSubmit}
                                aria-label="Reload Grid"
                            >
                                ↻
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleReject}
                            >
                                Reject fill
                            </button>
                        </div>
                    )}
                    <div className={styles.cluesArea}>
                        {clues.map((c, index) => (
                            <div key={`${c.number}-${c.direction}`} className={styles.clueInput}>
                                <label>{c.word}</label>
                                <input
                                    type="text"
                                    value={c.userClue || ''}
                                    onChange={(e) => handleClueChange(index, e.target.value)}
                                    placeholder="Enter your clue here"
                                />
                            </div>
                        ))}
                    </div>
                    {clues.length > 0 && (
                        <div className={styles.actionArea}>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleShareSubmit}
                                disabled={!allCluesFilled}
                            >
                                Share/Submit
                            </button>
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && !filledPuzzle && (
                        <Alert>
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>Your crossword has been filled successfully.</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </Layout>
    );
}