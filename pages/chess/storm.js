import Head from "next/head";
import Layout from "../../components/layout";
import GameSelector from "../../components/chess/game-selector/game-selector";
import StormTimer from "../../components/chess/storm-timer/storm-timer";
import { useState } from "react";
import styles from './chess-games.module.css'
import ChessStorm from "../../components/chess/chess-storm";

export default function Storm() {

    return (
        <Layout>
            <Head>
                <title>Who has the better position?</title>
            </Head>
            <GameSelector selectedTab="Storm" />
            <ChessStorm />
        </Layout>
    )
}