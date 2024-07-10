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

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AlternateRealityMovies() {
    const date = new Date();
    const { data, error } = useSWR(`/api/title-game?date=${formatDate(date)}`, fetcher);

    // Blurb states
    const [originalTitle, setOriginalTitle] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [blurbText, setBlurbText] = useState('');

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
                <p className={styles.newTitle}>{
                        newTitle.replace(/[a-zA-Z]/g, '_')
                    }</p>
                <p className={styles.blurbText}>{blurbText}</p>
            </div>
        </Layout>
    )

}