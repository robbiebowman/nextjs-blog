import Head from "next/head";
import useSWR from 'swr';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import utilStyles from '../../styles/utils.module.css';
import { formatDate } from '../../lib/date-funcs'
import { hasCompleted, setCompleted } from '../../lib/crossword-cookies';
import styles from './index.module.css';
import Layout from "../../components/layout";
import Crossword from "../../components/crossword/crossword-game";
import { CrosswordGameSelector } from "../../components/game-selector/game-selector";
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Link } from "lucide-react";

export default function CustomCrossword() {

    const router = useRouter()
    const { id } = router.query
    const formattedId = id?.replaceAll('-', ' ')
    const [rawPuzzleData, setRawPuzzleData] = useState(null)
    const [puzzle, setPuzzle] = useState(null)
    const [clues, setClues] = useState(null)
    const [isShared, setIsShared] = useState(false);

    const fetcher = (...args) => fetch(...args).then(res => res.json());
    const { mutate } = useSWR(() => `/api/custom-crossword?id=${id}`, fetcher, {
        onSuccess: (data, key, config) => {
            if (JSON.stringify(data) != JSON.stringify(rawPuzzleData)) {
                setRawPuzzleData(data)
            }
        },
        onError: (err, key, config) => {
            setRawPuzzleData(null)
        }
    })

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    useEffect(() => {
        if (rawPuzzleData == null) {
            mutate();
            return;
        }

        console.log(`rawPuzzleData: ${JSON.stringify(rawPuzzleData)}`)
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
            console.log(`cluesWords: ${JSON.stringify(cluesWords)}`)
            console.log(`cur: ${JSON.stringify(cur)}`)
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
                <title>Mini Crossword</title>
            </Head>
            <CrosswordGameSelector />
            <div className={styles.puzzleBox}>
                <div className={styles.outerBox}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.title}>Mini Crossword - {formattedId}</h1>
                        <button
                            onClick={handleShare}
                            className={`${styles.shareButton} ${isShared ? styles.shared : ''}`}
                            aria-label="Share crossword"
                            disabled={isShared}
                        >
                            <Link className={styles.shareIcon} size={16} />
                            <span>{isShared ? 'Shared!' : 'Share'}</span>
                        </button>
                    </div>
                    <Crossword clues={clues} puzzle={puzzle} />
                </div>
            </div>
        </Layout>
    )

}