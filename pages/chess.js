import Head from "next/head";
import Layout from "../components/layout";
import ChessPractice from "../components/chess/chess-practice";
import { ChessGameSelector } from "../components/chess/game-selector/game-selector";


export default function Chess() {

    return (
        <Layout>
            <Head>
                <title>Who has the better position?</title>
                <meta
                    property="og:image"
                    content={"https://www.robbiebowman.com/images/social-preview.png"}
                />
                <meta name="og:title" content="A chess game by Robbie" />
                <meta name="twitter:card"
                    content={"https://www.robbiebowman.com/images/social-preview.png"} />
            </Head>
            <ChessGameSelector selectedTitle="Practice" />
            <div style={{ margin: "0 1rem" }}>
                <ChessPractice />
            </div>
        </Layout>
    )

}