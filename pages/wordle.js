import Head from "next/head";
import useSWR from 'swr';
import React, { useState } from 'react';
import utilStyles from '../styles/utils.module.css';
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
                <div className={utilStyles.descriptionBox}>
                    <p>This bot tells you the optimal word to play in Wordle. Click the letters to change their colour. Click the red x to type your own guess.</p>
                </div>
                <WordleGame />
            </div>
        </Layout>
    )

}