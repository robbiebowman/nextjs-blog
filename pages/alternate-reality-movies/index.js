import Head from "next/head";
import useSWR from 'swr';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { formatDate } from '../../lib/date-funcs'
import TitleGameInput from '../../components/title-game/title-game-input'
import styles from './index.module.css';
import Layout from "../../components/layout";
import { Info, X } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AlternateRealityMovies() {
    const date = new Date();
    const formattedDate = formatDate(date)
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

    // Info popup state
    const [showInfoPopup, setShowInfoPopup] = useState(false);
    const infoIconRef = useRef(null);

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
                setSolved(true)
            }
        }
    }, [data]);

    const onSolutionFound = useCallback(() => {
        setSolved(true)
        localStorage.setItem(`title-game-${formattedDate}`, true);
    }, [])

    const toggleInfoPopup = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setShowInfoPopup(!showInfoPopup);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (infoIconRef.current && !infoIconRef.current.contains(event.target)) {
                setShowInfoPopup(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return (
        <Layout>
            <Head>
                <title>Alternate Reality Movies</title>
            </Head>
            <div className={styles.mainBox}>
                <h1>
                    Alternate Reality Movie of the Day
                    <span className={styles.infoIcon} onClick={toggleInfoPopup} ref={infoIconRef}>
                        <Info size={25} />
                    </span>
                    {showInfoPopup && (
                        <div className={styles.infoPopup}>
                            <p>One letter has been changed in a popular movie title.</p>
                            <p>Can you guess the new title based on a description of its plot?</p>
                            <button className={styles.closeButton} onClick={toggleInfoPopup}>
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </h1>
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