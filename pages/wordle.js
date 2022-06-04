import Head from "next/head";
import useSWR from 'swr';
import React, { useState } from 'react';
import Layout from "../components/layout";
import Letter from "../components/wordle/letter/letter";
import WordleGame from "../components/wordle/LetterBox/letter-box";

export default function Wordle() {

    return (
        <Layout>
            <Head>
                <title>Wordle Solver</title>
            </Head>
            <WordleGame />
        </Layout>
    )

}