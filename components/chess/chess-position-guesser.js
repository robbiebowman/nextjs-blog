import useSWR from 'swr';
import { Chessboard } from "react-chessboard";
import styles from './chess.module.css'
import { useState, useEffect } from 'react';

export default function ChessPositionGuesser() {
    const [resultMsg, setResultMsg] = useState("Who has the better position?")
    const [data, setData] = useState({ fen: "", evaluation: 0 })
    const [isLoading, setLoading] = useState(false)
    const [newPuzzleRequested, setNewPuzzleRequested] = useState(true)

    useEffect(() => {
        if (newPuzzleRequested && !isLoading) {
            setLoading(true)
            fetch("api/chess-position").then(res => res.json()).then((data) => {
                setData(data)
                setLoading(false)
                setNewPuzzleRequested(false)
            })
        }
    }, [newPuzzleRequested])

    const selectAnswer = (answer) => {
        const result = data.evaluation > 0 ? "White is winning" : data.evaluation < 0 ? "Black is winning" : "The position is even"

        const wasCorrect = (answer == "+" && data.evaluation > 0) || (answer == "-" && data.evaluation < 0) || (answer == "=" && data.evaluation == 0)

        const resultMessage = (wasCorrect ? "Correct!" : "According to Stockfish:") + " " + result

        setResultMsg(resultMessage)
    }

    return (
        <div className={styles.boardBox}>
            <button type="button" disabled={isLoading} onClick={() => { setNewPuzzleRequested(true) }}>Load new puzzle</button>
            <div>
                <Chessboard arePiecesDraggable={false} position={data.fen} />
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