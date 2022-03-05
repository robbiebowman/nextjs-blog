import useSWR from 'swr'
import DifficultySelector from "./difficulty-selector/difficulty-selector"
import styles from './chess.module.css'
import { useState, useEffect, createRef } from 'react'
import { loadNewRandomPuzzle, isCorrect } from '/lib/chess'
import Score from './score/score'
import Board from './board'
import StormTimer from './storm-timer/storm-timer'

export default function ChessStorm() {

    const [positions, setPositions] = useState([])
    const [gameStarted, setGameStarted] = useState(false)
    const [answers, setAnswers] = useState([])
    const [currPosIndex, setCurrPosIndex] = useState(0)
    const [correctGuesses, setCorrectGuesses] = useState(0)
    const [wrongGuesses, setWrongGuesses] = useState(0)
    const [ready, setReady] = useState(false)
    const [difficulty, setDifficulty] = useState("Medium")
    const difficultySelector = <DifficultySelector setDifficulty={(level) => { setDifficulty(level) }} />

    useEffect(() => {
        if (positions.length == currPosIndex) {
            setReady(false)
        }
        if (positions.length < currPosIndex + 3) {
            for (let i = 0; i < 3; i++) {
                loadNewRandomPuzzle(difficulty).then((pos) => {
                    positions.push(pos)
                    setPositions(positions)
                    if (!ready) {
                        setReady(true)
                    }
                })
            }
        }
    }, [currPosIndex, ready])

    const selectAnswer = (answer, correct) => {
        answers.push({ answer, correct })
        setAnswers(answers)
        setCurrPosIndex(currPosIndex + 1)
        if (correct) {
            setCorrectGuesses(correctGuesses + 1)
        } else {
            setWrongGuesses(wrongGuesses + 1)
        }
    }

    if (positions.length == 0) {
        return <p>Loading...</p>
    }

    return (<>
        <div className={styles.boardAndTimer}>
            <StormTimer
             onTimerPressed={() => { setGameStarted(true) }}
             correctGuesses={correctGuesses}
             wrongGuesses={wrongGuesses}
             />
        </div>
        <div className={`${styles.boardBox} ${gameStarted ? styles.unblurred : styles.blurred}`}>
            <Board
                data={positions[currPosIndex]}
                difficulty={difficulty}
                showResults={false}
                onCorrect={(answer) => { selectAnswer(answer, true) }}
                onWrong={(answer) => { selectAnswer(answer, false) }}
                whomToMoveSibling={difficultySelector}
            />
        </div>
    </>)
}