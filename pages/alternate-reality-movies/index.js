import Head from "next/head";
import useSWR from 'swr';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { formatDate } from '../../lib/date-funcs'
import TitleGameInput from '../../components/title-game/title-game-input'
import styles from './index.module.css';
import Layout from "../../components/layout";
import { Info, X } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AlternateRealityMovies({ initialData, formattedDate }) {

    const date = new Date();
    const [data, setData] = useState(initialData);

    function humanReadableDate(dateObject) {
        const date = new Date(dateObject);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

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

    // Hint states
    const [hintLevel, setHintLevel] = useState(0);

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

    const handleHintClick = () => {
        if (hintLevel < 3) {
            setHintLevel(hintLevel + 1);
        }
    };

    const getHintButtonText = () => {
        let message;
        switch (hintLevel) {
            case 0:
                message = "Give me a hint";
                break;
            case 1:
                message = "Another hint please";
                break;
            case 2:
                message = "One last hint...";
                break;
            default:
                message = "All hints revealed";
                break;
        }
        if (isSolved) {
            message = "Solved!"
        }
        return message;
    };

    const pageTitle = `Alternate Reality Movies - ${humanReadableDate(new Date(formattedDate))}`;
    const pageDescription = data ? data.blurb.blurb : "Can you guess the new movie title based on its alternate reality plot?";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    return (
        <Layout>
            <Head>
                <title>{pageTitle}</title>
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={`${baseUrl}/images/alternate-reality-movies-banner.png`} />
                <meta property="twitter:card" content={`${baseUrl}/images/alternate-reality-movies-banner.png`} />
                <meta property="og:url" content={`${baseUrl}/alternate-reality-movies?date=${formattedDate}`} />
                <meta property="og:type" content="website" />
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
                <h2>{humanReadableDate(date)}</h2>
                {isSolved ? (
                    <div className={`${styles.resultBox} ${styles.successBox}`}>
                        <p className={styles.successText}>🎉 Completed Puzzle! 🎉</p>
                    </div>
                ) : ""}
                <TitleGameInput solution={newTitle} onSolutionFound={onSolutionFound} isSolved={isSolved} />
                <p className={styles.blurbText}>{blurbText}</p>

                <button onClick={handleHintClick} className={styles.hintButton} disabled={isSolved || hintLevel == 3}>
                    {getHintButtonText()}
                </button>

                <div className={styles.hintsContainer}>
                    <p className={`${styles.hint} ${isSolved || hintLevel >= 1 ? styles.unblurred : ''}`}>
                        <span>Release Date</span> {humanReadableDate(releaseDate)}
                    </p>
                    <div className={`${styles.hint} ${isSolved || hintLevel >= 2 ? styles.unblurred : ''}`}>
                        <p><span>Genre</span> {genre}</p>
                        <p><span>Budget</span> ${budget / 1_000_000} million</p>
                        <p><span>TMDB User Rating</span> {userRating}</p>
                    </div>
                    <p className={`${styles.hint} ${isSolved || hintLevel >= 3 ? styles.unblurred : ''}`}>
                        <span>Crew</span> {crewList}
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const date = new Date();
    const formattedDate = formatDate(date);

    // Fetch data from your API
    const res = await fetch(`https://rjb-personal-api.azurewebsites.net/title-game?date=${formattedDate}`);
    const initialData = await res.json();

    return {
        props: {
            initialData,
            formattedDate,
        },
    }
}