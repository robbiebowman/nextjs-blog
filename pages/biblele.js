import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Layout from "../components/layout";
import useSWR from 'swr';
import Letter from "../components/letter/letter";

export default function Wordle() {

    const fetcher = (...args) => fetch(...args).then(res => res.json())

    const { data, error } = useSWR("/api/wordle", fetcher)

    if (error) return <div>Error</div>
    if (!data) return <div>loading...</div>

    const firstLetter = data.bestGuess[0]

    return (
        <Layout>
            <Head>
                <title>Wordle Solver</title>
            </Head>
            <p>Your word is: { error ? error : data.bestGuess}</p>
            <Letter letter={firstLetter} result='g' />
            <Letter letter={firstLetter} result='y' />
            <Letter letter={firstLetter} result='b' />
        </Layout>
    )

}