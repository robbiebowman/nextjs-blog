import useSWR from 'swr'
import DifficultySelector from "./difficulty-selector/difficulty-selector"
import styles from './chess.module.css'
import { useState, useEffect, createRef } from 'react'
import { loadNewRandomPuzzle, isCorrect } from '/lib/chess'
import Score from './score/score'
import Board from './board'

export default function ChessPositionGuesser({ mode }) {
    // mode: ["Practice", "Daily", "Storm"]

    const [data, setData] = useState({ fen: "", evaluation: 0 })
    const [isLoading, setLoading] = useState(false)
    const [difficulty, setDifficulty] = useState("Medium")
    const [newPuzzleRequested, setNewPuzzleRequested] = useState(true)
    const [showResults, setShowResults] = useState(false)
    const [answer, setAnswer] = useState(null)
    const [whomToMove, setWhomToMove] = useState("...")
    const [streak, setStreak] = useState(0)

    useEffect(() => {
        if (newPuzzleRequested && !isLoading) {
            setLoading(true)
            loadNewRandomPuzzle(difficulty).then((data) => {
                const move = data.fen.split(' ')[1] == 'w' ? "⬜ White" : "⬛ Black"
                setShowResults(false)
                setData(data)
                setLoading(false)
                setNewPuzzleRequested(false)
                setWhomToMove(move)
            })
        }
    }, [newPuzzleRequested])

    const selectAnswer = (answer, correct) => {
        setShowResults(true)
        setAnswer(answer)
        if (correct) {
            setStreak(streak + 1)
        } else {
            setStreak(0)
        }
    }

    return (
        <div className={styles.boardBox}>
            <div className={styles.difficultyAndWhomToMove}>
                <div className={styles.whomToMove}><span>{`${whomToMove} to move`}</span></div>
                <DifficultySelector setDifficulty={(level) => { setDifficulty(level) }} />
            </div>
            <Board
                data={data}
                difficulty={difficulty}
                showResults={showResults}
                onCorrect={(answer) => { selectAnswer(answer, true) }}
                onWrong={(answer) => { selectAnswer(answer, false) }}
            />
            <div className={showResults ? styles.visibleEval : styles.invisibleEval}>
                <Score answer={answer}
                    fen={data.fen}
                    evaluation={data.evaluation}
                    nextClicked={() => { setNewPuzzleRequested(true) }}
                    evaluator={isCorrect}
                    currentStreak={streak}
                />
            </div>
        </div>
    )
}