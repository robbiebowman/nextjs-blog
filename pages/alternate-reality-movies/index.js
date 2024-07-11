import Head from "next/head";
import useSWR from 'swr';
import React, { useEffect, useRef, useState } from 'react';
import { formatDate } from '../../lib/date-funcs'
import TitleGameInput from '../../components/title-game/title-game-input'
import styles from './index.module.css';
import Layout from "../../components/layout";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AlternateRealityMovies() {
    const date = new Date();
    const { data, error } = useSWR(`/api/title-game?date=${formatDate(date)}`, fetcher);

    // Blurb states
    const [originalTitle, setOriginalTitle] = useState('');
    const [blurbText, setBlurbText] = useState('');
    const [newTitle, setNewTitle] = useState('');

    // FilmInfo states
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [budget, setBudget] = useState('');
    const [crewList, setCrewList] = useState('');
    const [genre, setGenre] = useState('');
    const [userRating, setUserRating] = useState('');

    // Puzzle states
    const [guessTitle, setGuessTitle] = useState(null); // Lowercase letters & numbers of guess. No symbols or spaces.
    const [solutionTitle, setSolutionTitle] = useState(''); // Fight Club -> fightclub

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
        }
    }, [data]);

    return (
        <Layout>
            <Head>
                <title>Alternate Reality Movies</title>
            </Head>
            <div className={styles.mainBox}>
                <h1>Alternate Reality Movie of the Day</h1>
                <h2>{formatDate(date)}</h2>
                <TitleGameInput solution={newTitle} />
                <p className={styles.blurbText}>{blurbText}</p>
            </div>
        </Layout>
    )

}