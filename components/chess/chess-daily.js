import styles from './chess.module.css'
import { useState, useEffect, createRef } from 'react'
import Board from './board'
import DailyStage from './daily-stage'
import GameResults from './game-results/game-results'
import { loadDailyPuzzle } from '/lib/chess'
import { getLastDailyAnswers, saveTodaysDailyAnswers, getAllDailyAnswers, hasCompletedToday } from '/lib/cookies'
import { isCorrect } from '../../lib/chess'

export default function ChessDaily() {

    const stages = ["Easy", "Medium", "Hard"]

    const [loaded, setLoaded] = useState([])
    const [stage, setStage] = useState(0)
    const [dailyFinished, setDailyFinished] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [answers, setAnswers] = useState([])
    const [positions, setPositions] = useState({ Easy: null, Medium: null, Hard: null })

    useEffect(() => {
        let today = new Date()
        const day = today.getDate()
        const month = today.getMonth() + 1
        loadDailyPuzzle(day, month, "Easy").then((data) => {
            setPositions(p => ({ ...p, Easy: data }))
            setLoaded(l => [...l, "Easy"])
        })
        loadDailyPuzzle(day, month, "Medium").then((data) => {
            setPositions(p => ({ ...p, Medium: data }))
            setLoaded(l => [...l, "Medium"])
        })
        loadDailyPuzzle(day, month, "Hard").then((data) => {
            setPositions(p => ({ ...p, Hard: data }))
            setLoaded(l => [...l, "Hard"])
        })
    }, [])

    useEffect(() => {
        if (hasCompletedToday()) {
            const results = getLastDailyAnswers()
            setAnswers(results)
            setDailyFinished(true)
        }
    }, [])

    useEffect(() => {
        if (loaded.length == 3 && answers.length == 3) {
            const easyCorrect = isCorrect(positions.Easy.evaluation, answers[0])
            const medCorrect = isCorrect(positions.Medium.evaluation, answers[1])
            const hardCorrect = isCorrect(positions.Hard.evaluation, answers[2])
            saveTodaysDailyAnswers(answers, [easyCorrect, medCorrect, hardCorrect])
        }
    }, [answers, loaded])

    const selectAnswer = (answer) => {
        setShowResults(true)
        setAnswers(a => [...a, answer])
        setTimeout(() => {
            if (stage != 2) {
                setStage(s => s + 1)
                setShowResults(false)
            } else {
                setDailyFinished(true)
            }
        }, 300)
    }

    const difficulty = stages[stage]

    const dailyStage = <DailyStage stage={difficulty} />

    const getFinishedPositionsIterable = (positions) => {
        if (positions.length < 3) {
            return []
        }
        return [positions[stages[0]], positions[stages[1]], positions[stages[2]]]
    }

    return (<div className={styles.stormBox}>
        <GameResults
            mode="Daily"
            answers={answers}
            display={dailyFinished}
            positions={getFinishedPositionsIterable(positions)}
            difficulty={difficulty}
            records={getAllDailyAnswers()}
            streak={getAllDailyAnswers().streak} />
        <div className={`${styles.boardBox} ${dailyFinished ? styles.blurred : styles.unblurred}`}>
            <Board
                data={positions[stages[stage]]}
                difficulty={difficulty}
                showResults={showResults}
                onCorrect={(answer) => { selectAnswer(answer) }}
                onWrong={(answer) => { selectAnswer(answer) }}
                whomToMoveSibling={dailyStage}
            />
            <div className={styles.dailyResultsLoadingBarHolder}>
                <div className={`${styles.dailyResultsLoadingBar} ${showResults ? styles.barFull : styles.barEmpty}`} />
            </div>
        </div>
    </div>)
}