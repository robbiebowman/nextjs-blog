import Head from "next/head";
import Layout from "../components/layout";
import ChessPractice from "../components/chess/chess-practice";
import GameSelector from "../components/chess/game-selector/game-selector";


export default function Chess() {

    return (
        <Layout>
            <Head>
                <title>Who has the better position?</title>
            </Head>
            <GameSelector selectedTab="Practice" />
            <div style={{margin: "0 1rem"}}>
                <ChessPractice />
            </div>
        </Layout>
    )

}