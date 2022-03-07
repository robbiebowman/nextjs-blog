import useSWR from 'swr'
import DifficultySelector from "./difficulty-selector/difficulty-selector"
import styles from './chess.module.css'
import { useState, useEffect, createRef } from 'react'
import { loadNewRandomPuzzle, isCorrect } from '/lib/chess'
import Score from './score/score'
import Board from './board'
import StormTimer from './storm-timer/storm-timer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faXmark, faCopy } from '@fortawesome/free-solid-svg-icons'
import CopyFen from './score/copy-fen'
import StormResults from './storm-results/storm-results'

export default function ChessStorm() {

    const [positions, setPositions] = useState([])
    const [gameStage, setGameStage] = useState('Pregame') // Pregame, Live, Postgame
    const [answers, setAnswers] = useState([]) // [ {data, correct} ]
    const [currPosIndex, setCurrPosIndex] = useState(0)
    const [correctGuesses, setCorrectGuesses] = useState(0)
    const [wrongGuesses, setWrongGuesses] = useState(0)
    const [ready, setReady] = useState(false)
    const [difficulty, setDifficulty] = useState("Medium")

    const resetGame = (difficulty) => {
        console.log("Reseting with difficulty" + difficulty)
        setPositions([])
        setGameStage('Pregame')
        setAnswers([])
        setCurrPosIndex(0)
        setCorrectGuesses(0)
        setWrongGuesses(0)
        setReady(false)
        setDifficulty(difficulty || "Medium")
    }

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
        answers.push(answer)
        setAnswers(answers)
        setCurrPosIndex(currPosIndex + 1)
        if (correct) {
            setCorrectGuesses(correctGuesses + 1)
        } else {
            setWrongGuesses(wrongGuesses + 1)
            if (wrongGuesses == 2) {
                setGameStage("Postgame")
            }
        }
    }

    if (positions.length == 0) {
        return <p>Loading...</p>
    }

    const mapAnswerToName = (ans) => {
        if (ans == '+') {
            return "⬜ White"
        } else if (ans == '-') {
            return "⬛ Black"
        } else {
            return "🏁 Even"
        }
    }

    const getStockfishEvalStyle = (evaluation) => {
        const sign = evaluation[0] == '#' ? evaluation[1] : evaluation[0]
        if (sign == '-') {
            return styles.stockfishFavoursBlack
        } else if (sign == '+') {
            return styles.stockfishFavoursWhite
        } else {
            return styles.stockfishFavoursEven
        }
    }

    const shareClicked = () => {
        // Robbie's Chess Z /\ /\
        // y y y n y
        // y n y n
        const difficultyComponent = difficulty == 'Easy' ? "☀️" : difficulty == "Medium" ? "☁️☁️" : "⛈️⛈️⛈️"
        const correctList = answers.map((a, i) => {
            const correct = isCorrect(positions[i].evaluation, a)
            let str
            if (correct) {
                str = "✅"
            } else {
                str = "❌"
            }
            if ((i + 1) % 5 == 0) {
                str += "\n"
            }
            return str
        }).join('')
        if (correctList.split('').filter(c => c == "❌").length < 3) {
            correctList += "⏱️"
        }
        const shareString = `${difficultyComponent} Robbie's ♟️ ⚡\n${correctList}`
        navigator.clipboard.writeText(shareString)
    }

    return (<div className={styles.stormBox}>
        <StormResults
            answers={answers}
            display={gameStage == "Postgame"}
            positions={positions}
            onResultsClosed={() => resetGame(difficulty)} />
        <div className={`${styles.difficultySelector} ${gameStage == "Postgame" ? styles.blurred : styles.unblurred}`}>
            <DifficultySelector
                difficulty={difficulty}
                onDifficultyChanged={(level) => { resetGame(level) }}
                disabled={gameStage == 'Live'} />
        </div>
        <div className={styles.stormGameBox}>
            <div className={`${styles.boardAndTimer} ${gameStage == "Postgame" ? styles.blurred : styles.unblurred}`}>
                <StormTimer
                    onTimerPressed={() => { setGameStage("Live") }}
                    correctGuesses={correctGuesses}
                    wrongGuesses={wrongGuesses}
                    onGameEnded={() => { setGameStage("Postgame") }}
                />
            </div>
            <div className={`${styles.boardBox} ${gameStage == "Live" ? styles.unblurred : styles.blurred}`}>
                <Board
                    data={positions[currPosIndex]}
                    difficulty={difficulty}
                    showResults={false}
                    onCorrect={(answer) => { selectAnswer(answer, true) }}
                    onWrong={(answer) => { selectAnswer(answer, false) }}
                />
            </div>
        </div>
    </div>)
}