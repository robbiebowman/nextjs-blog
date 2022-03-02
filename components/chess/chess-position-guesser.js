import useSWR from 'swr';
import { Chessboard } from "react-chessboard";
import EvalBar from "./eval-bar/eval-bar";
import DifficultySelector from "./difficulty-selector/difficulty-selector"
import styles from './chess.module.css'
import { useState, useEffect } from 'react';
import Score from './score/score';

export default function ChessPositionGuesser() {
    const [resultMsg, setResultMsg] = useState("Who has the better position?")
    const [data, setData] = useState({ fen: "", evaluation: 0 })
    const [isLoading, setLoading] = useState(false)
    const [difficulty, setDifficulty] = useState("Medium")
    const [newPuzzleRequested, setNewPuzzleRequested] = useState(true)
    const [guessed, setGuessed] = useState(false)
    const [answer, setAnswer] = useState(null)

    useEffect(() => {
        if (newPuzzleRequested && !isLoading) {
            setLoading(true)
            setResultMsg("Who has the better position?")
            fetch("api/chess-position?difficulty=" + difficulty).then(res => res.json()).then((data) => {
                setGuessed(false)
                setData(data)
                setLoading(false)
                setNewPuzzleRequested(false)
            })
        }
    }, [newPuzzleRequested])

    const selectAnswer = (answer) => {
        setGuessed(true)
        setAnswer(answer)
    }

    return (
        <div className={styles.boardBox}>
            <DifficultySelector setDifficulty={(level) => { setDifficulty(level) }} />
            <div className={styles.boardAndEval}>
                <div className={guessed ? styles.visibleEval : styles.invisibleEval}><EvalBar evaluation={data.evaluation} /></div>
                <Chessboard arePiecesDraggable={false} position={data.fen} />
            </div>
            <div className={styles.guessBox}>
                <button type="button" className="btn btn-light" disabled={guessed} onClick={() => selectAnswer("+")}>White</button>
                <button type="button" className="btn btn-secondary" disabled={guessed} onClick={() => selectAnswer("=")}>Even</button>
                <button type="button" className="btn btn-dark" disabled={guessed} onClick={() => selectAnswer("-")}>Black</button>
            </div>
            <div className={guessed ? styles.visibleEval : styles.invisibleEval}>
                <Score answer={answer} fen={data.fen} evaluation={data.evaluation} nextClicked={() => { setNewPuzzleRequested(true) }} />
            </div>
        </div>
    )
}