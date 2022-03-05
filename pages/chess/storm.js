import Head from "next/head";
import Layout from "../../components/layout";
import ChessPositionGuesser from "../../components/chess/chess-position-guesser";
import GameSelector from "../../components/chess/game-selector/game-selector";
import StormTimer from "../../components/chess/storm-timer/storm-timer";
import { useState } from "react";
import styles from './chess-games.module.css'

export default function Storm() {

    const [gameStarted, setGameStarted] = useState(false)

    return (
        <Layout>
            <Head>
                <title>Who has the better position?</title>
            </Head>
            <GameSelector selectedTab="Storm" />
            <StormTimer timerPressed={() => { setGameStarted(true) }} />
            <div className={gameStarted ? styles.unblurred : styles.blurred}>
                <ChessPositionGuesser mode="Storm" />
            </div>
        </Layout>
    )
}