import Head from "next/head";
import useSWR from 'swr';
import React, { useState } from 'react';
import Layout from "../components/layout";
import WordleGame from "../components/wordle/wordle-game/wordle-game";
import { WordleGameSelector } from "../components/game-selector/game-selector";

export default function Wordle() {

    return (
        <Layout>
            <Head>
                <title>Wordle Solver</title>
            </Head>
            <WordleGameSelector selectedTitle="Solver" />
            <div style={{ margin: "0 1rem" }}>
                <WordleGame />
            </div>
        </Layout>
    )

}