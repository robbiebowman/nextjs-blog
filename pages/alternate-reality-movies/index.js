import Head from "next/head";
import useSWR from 'swr';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { formatDate } from '../../lib/date-funcs'
import TitleGameInput from '../../components/title-game/title-game-input'
import styles from './index.module.css';
import Layout from "../../components/layout";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AlternateRealityMovies() {
    const date = new Date();
    const formattedDate = formatDate(date)
    console.log(`formattedDate is ${formattedDate}`)
    const { data, error } = useSWR(`/api/title-game?date=${formattedDate}`, fetcher);

    // Blurb states
    const [originalTitle, setOriginalTitle] = useState('');
    const [blurbText, setBlurbText] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [isSolved, setSolved] = useState(false)

    // FilmInfo states
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [budget, setBudget] = useState('');
    const [crewList, setCrewList] = useState('');
    const [genre, setGenre] = useState('');
    const [userRating, setUserRating] = useState('');

    useEffect(() => {
        if (data) {
            // Update Blurb states
            setOriginalTitle(data.blurb.originalTitle);
            setNewTitle(data.blurb.newTitle);
            setBlurbText(data.blurb.blurb);

            // Update FilmInfo states if info is not null
            if (data.info) {
                setTitle(data.info.title);
                setReleaseDate(data.info.releaseDate);
                setBudget(data.info.budget);
                setCrewList(data.info.crewList);
                setGenre(data.info.genre);
                setUserRating(data.info.userRating);
            }
            const solvedMemory = localStorage.getItem(`title-game-${formattedDate}`)
            if (solvedMemory) {
                console.log(`Local storage says its solved. ${solvedMemory}`)
                setSolved(true)
            }
        }
    }, [data]);

    const onSolutionFound = useCallback(() => {
        console.log('Solution found!')
        setSolved(true)
        localStorage.setItem(`title-game-${formattedDate}`, true);
    }, [])

    return (
        <Layout>
            <Head>
                <title>Alternate Reality Movies</title>
            </Head>
            <div className={styles.mainBox}>
                <h1>Alternate Reality Movie of the Day</h1>
                <h2>{formattedDate}</h2>
                {isSolved ? (
                    <div className={`${styles.resultBox} ${styles.successBox}`}>
                        <p className={styles.successText}>🎉 Completed Puzzle! 🎉</p>
                    </div>
                ) : ""}
                <TitleGameInput solution={newTitle} onSolutionFound={onSolutionFound} isSolved={isSolved} />
                <p className={styles.blurbText}>{blurbText}</p>
            </div>
        </Layout>
    )

}