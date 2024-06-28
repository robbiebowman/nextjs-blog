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
    const [clues, setClues] = useState({ downWords: [], acrossWords: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [filledPuzzle, setFilledPuzzle] = useState(null);
    const [originalPuzzle, setOriginalPuzzle] = useState(null);

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
                        puzzle={filledPuzzle || guessGrid}
                        clues={clues}
                        guessGrid={filledPuzzle || guessGrid}
                        setGuessGrid={setGuessGrid}
                        onActiveClueChange={() => { }}
                        isEditMode={true}
                    />
                    <div className={styles.actionArea}>
                        {!filledPuzzle && (
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? <Spinner /> : 'Fill in puzzle'}
                            </button>
                        )}
                        {filledPuzzle && (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleAccept}
                                >
                                    Accept Fill
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleReject}
                                >
                                    Reject Fill
                                </button>
                            </>
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
            </div>
        </Layout>
    );
}