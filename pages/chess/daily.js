import Head from "next/head";
import Layout from "../../components/layout";
import ChessPractice from "../../components/chess/chess-practice";
import GameSelector from "../../components/chess/game-selector/game-selector";

export default function Daily() {

    return (
        <Layout>
            <Head>
                <title>Who has the better position?</title>
            </Head>
            <GameSelector selectedTab="Daily" />
            <ChessPractice />
        </Layout>
    )
}