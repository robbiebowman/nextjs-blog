import useSWR from 'swr';
import { Chessboard } from "react-chessboard";
import styles from './chess.module.css'
import { useState, useEffect } from 'react';

export default function ChessPositionGuesser() {

    const [resultMsg, setResultMsg] = useState("Who has the better position?")

    const fetcher = (...args) => fetch(...args).then(res => res.json())

    const { data, error } = useSWR("/api/chess-position", fetcher)
    const [evalNum, setEvalNum] = useState(null)
    const [fen, setFen] = useState(null)

    useEffect(() => {
        (async function () {
            const { evaluation, fen } = await (await fetch(`/api/chess-position`)).json()
            setEvalNum(parseInt(evaluation))
            setFen(fen)
        })()
    })

    if (!evalNum) return <div>loading...</div>

    const selectAnswer = (answer) => {
        const result = evalNum > 0 ? "White is winning" : evalNum < 0 ? "Black is winning" : "The position is even"

        const wasCorrect = (answer == "+" && evalNum > 0) || (answer == "-" && evalNum < 0) || (answer == "=" && evalNum == 0)

        const resultMessage = (wasCorrect ? "Correct!" : "According to Stockfish:") + " " + result

        setResultMsg(resultMessage)
    }

    return (
        <div className={styles.boardBox}>
            <div>
                <Chessboard arePiecesDraggable={false} position={fen} />
            </div>
            <div className={styles.guessBox}>
                <button type="button" className="btn btn-light" onClick={() => selectAnswer("+")}>White</button>
                <button type="button" className="btn btn-secondary" onClick={() => selectAnswer("=")}>Even</button>
                <button type="button" className="btn btn-dark" onClick={() => selectAnswer("-")}>Black</button>
            </div>
            <div>
                <p>{resultMsg}</p>
            </div>
        </div>
    )

}