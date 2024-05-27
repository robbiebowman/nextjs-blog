import Head from "next/head";
import useSWR from 'swr';
import React, { useState } from 'react';
import utilStyles from '../styles/utils.module.css';
import Layout from "../components/layout";
import MiniCrosswordGame from "../components/mini-crossword/mini-crossword-game";

export default function MiniCrossword() {

    return (
        <Layout>
            <Head>
                <title>Daily Mini Crossword</title>
            </Head>
            <div style={{ margin: "0 1rem" }}>
                <MiniCrosswordGame />
            </div>
        </Layout>
    )

}