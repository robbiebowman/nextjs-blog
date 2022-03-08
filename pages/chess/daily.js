import Head from "next/head";
import Layout from "../../components/layout";
import ChessDaily from "../../components/chess/chess-daily";
import GameSelector from "../../components/chess/game-selector/game-selector";

export default function Daily() {

    return (
        <Layout>
            <Head>
                <title>Who has the better position?</title>
            </Head>
            <GameSelector selectedTab="Daily" />
            <div style={{ margin: "0 1rem" }}>
                <ChessDaily />
            </div>
        </Layout>
    )
}