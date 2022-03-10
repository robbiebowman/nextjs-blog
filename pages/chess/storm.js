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
            <meta
                property="og:image"
                content={"https://www.robbiebowman.com/images/social-preview.png"}
            />
            <meta name="og:title" content="A timed chess game by Robbie" />
            <meta name="twitter:card"
                content={"https://www.robbiebowman.com/images/social-preview.png"} />
        </Head>
            <GameSelector selectedTab="Storm" />
            <div style={{ margin: "0 1rem" }}>
                <ChessStorm />
            </div>
        </Layout>
    )
}