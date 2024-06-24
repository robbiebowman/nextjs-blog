import Head from "next/head";
import useSWR from 'swr';
import React, { useEffect, useRef, useState } from 'react';
import utilStyles from '../../styles/utils.module.css';
import { formatDate } from '../../lib/date-funcs'
import { hasCompleted, setCompleted } from '../../lib/crossword-cookies';
import styles from './index.module.css';
import Layout from "../../components/layout";
import MiniCrosswordGame from "../../components/mini-crossword/mini-crossword-game";
import { CrosswordGameSelector } from "../../components/game-selector/game-selector";

export default function MiniCrossword() {

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
    return (
        <Layout>
            <Head>
                <title>Crossword Creator</title>
            </Head>
            <CrosswordGameSelector selectedTitle="Creator" />
            <div className={styles.puzzleBox}>
                <MiniCrosswordGame date={selectedDate} />
            </div>
        </Layout>
    )

}