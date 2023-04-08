import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from '../../styles/utils.module.css'
import ChessDaily from "../../components/chess/chess-daily";
import { ChessGameSelector } from "../../components/game-selector/game-selector";

export default function Daily() {

    return (
        <Layout>
            <Head>
                <title>Who has the better position?</title>
                <meta
                    property="og:image"
                    content={"https://www.robbiebowman.com/images/social-preview.png"}
                />
                <meta name="og:title" content="A daily chess game by Robbie" />
                <meta name="twitter:card"
                    content={"https://www.robbiebowman.com/images/social-preview.png"} />
            </Head>
            <ChessGameSelector selectedTitle="Daily" />
            <div className={utilStyles.descriptionBox}>
                <p>Which player does Stockfish favour in this position?</p>
            </div>
            <div style={{ margin: "0 1rem" }}>
                <ChessDaily />
            </div>
        </Layout>
    )
}