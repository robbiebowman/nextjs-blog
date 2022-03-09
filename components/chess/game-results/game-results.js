import styles from './game-results.module.css'
import { useState } from 'react'
import { isCorrect, getDailyNumber } from '/lib/chess'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faXmark, faCopy } from '@fortawesome/free-solid-svg-icons'
import CopyFen from '../score/copy-fen'
import ReactTooltip from 'react-tooltip'

export default function GameResults({ mode, positions, display, answers, onResultsClosed, difficulty, records, streak }) {


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

    const shareStormClicked = () => {
        // Robbie's Chess Z /\ /\
        // y y y n y
        // y n y n
        console.log("Share clicked")
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

    const getDailySymbol = (i) => {
        if (i == 0) {
            return "☀️"
        } else if (i == 1) {
            return "☁️"
        } else {
            return "⛈️"
        }
    }

    const shareDailyClicked = () => {
        // Robbie's Daily
        // /\ [} #1
        // ☀️ ☁️ ⛈️
        // y n y
        const dayDiff = getDailyNumber()
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
        const shareString = `Robbie's Daily\n♟️🧩#${dayDiff}\n☀️☁️⛈️\n${correctList}`
        navigator.clipboard.writeText(shareString)
    }

    let resultsHeader

    if (mode == "Daily") {
        const barHeightRems = 5
        const getHeight = (max, thisOne) => {
            return (Math.round((thisOne / max) * 10) / 10) * barHeightRems
        }
        const maxRecord = Math.max(records.Easy, records.Medium, records.Hard)
        const heights = [getHeight(maxRecord, records.Easy), getHeight(maxRecord, records.Medium), getHeight(maxRecord, records.Hard)]

        resultsHeader = <div className={styles.dailyResultsHeader}>
            <div className={styles.recordsAndDifficultyBox}>
                <span className={styles.recordsCount}>{records.Easy}</span>
                <div className={styles.recordsBar} style={{ height: `${heights[0]}rem` }} />
                <span className={styles.recordBarDifficulty}>☀️</span>
            </div>
            <div className={styles.recordsAndDifficultyBox}>
                <span className={styles.recordsCount}>{records.Medium}</span>
                <div className={styles.recordsBar} style={{ height: `${heights[1]}rem` }} />
                <span className={styles.recordBarDifficulty}>☁️</span>
            </div>
            <div className={styles.recordsAndDifficultyBox}>
                <span className={styles.recordsCount}>{records.Hard}</span>
                <div className={styles.recordsBar} style={{ height: `${heights[2]}rem` }} />
                <span className={styles.recordBarDifficulty}>⛈️</span>
            </div>
        </div>
    } else {
        resultsHeader = <span className={styles.resultNumber}>
            {answers.filter((a, i) => isCorrect(positions[i].evaluation, a)).length}
        </span>
    }

    return (
        <div className={`${styles.stormResultsBox}`} style={{ display: (display ? "block" : "none") }}>
            {mode == "Daily" ? "" : <span className={styles.closeResults} onClick={onResultsClosed}><FontAwesomeIcon icon={faXmark} /></span>}
            <div className={styles.resultsHeaderBox}>
                {resultsHeader}
                <div>
                    <button
                        className="btn btn-lg btn-primary"
                        data-tip="Copied to clipboard!"
                        data-place="top"
                        data-effect="solid"
                        data-event="click"
                    ><FontAwesomeIcon icon={faCopy} /> Share!</button>
                </div>
            </div>
            {answers.map((a, i) => {
                const p = positions[i] || {evaluation: "", fen: ""}
                const correct = isCorrect(p.evaluation, a)
                return <div
                    key={`answer${i}`}
                    className={styles.resultRow}
                    style={i == 0 ? { borderTop: "0rem #FFF solid" } : i == answers.length - 1 ? { borderBottom: "0rem #FFF solid" } : {}}>
                    {mode == "Daily" ? getDailySymbol(i) : ""}
                    <span className={correct ? styles.correctGuess : styles.wrongGuess}>
                        <FontAwesomeIcon icon={correct ? faCircleCheck : faCircleXmark} /> {mapAnswerToName(a)}
                    </span>
                    <span className={styles.stockfishSays}>
                        Stockfish: <span className={getStockfishEvalStyle(p.evaluation)}>
                            {p.evaluation ? p.evaluation[0] == '#' ? p.evaluation : parseFloat(p.evaluation) / 100 : ""}
                        </span>
                    </span>
                    <CopyFen className={styles.fenBox} fen={p.fen} />
                </div>
            })}
            <ReactTooltip afterShow={mode == "Daily" ? shareDailyClicked : shareStormClicked} />
        </div>) //Why the afterShow must be defined on the ReactTooltip, I do not know. https://github.com/wwayne/react-tooltip/issues/496
}