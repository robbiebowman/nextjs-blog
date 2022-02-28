import Head from "next/head";
import Layout from "../components/layout";
import ChessPositionGuesser from "../components/chess/chess-position-guesser";

export default function ChessPositionGame() {

    return (
        <Layout>
            <Head>
                <title>Who has the better position?</title>
            </Head>
            <ChessPositionGuesser />
        </Layout>
    )

}