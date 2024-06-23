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
    const availableDates = useRef(getAvailableDates())

    return (
        <Layout>
            <Head>
                <title>Daily Mini Crossword</title>
            </Head>
            <CrosswordGameSelector selectedTitle="Daily" />
            <div className={styles.puzzleBox}>
                <MiniCrosswordGame date={selectedDate} />
            </div>
            <div className={styles.dateSelector}>
                {
                    availableDates.current ? availableDates.current.map((date) => {
                        const dateString = date.toLocaleDateString('en-us', { month: "short", day: "numeric" })
                        const buttonStyle = date.getDate() == selectedDate.getDate() ? "btn btn-dark" : "btn btn-light"
                        return (<button key={date.getDate()} type="button"
                            className={buttonStyle}
                            onClick={() => setSelectedDate(date)}>{dateString}</button>)
                    }) : ""
                }
            </div>
        </Layout>
    )

}