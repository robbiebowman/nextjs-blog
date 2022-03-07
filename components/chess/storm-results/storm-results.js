import styles from './storm-results.module.css'
import { useState } from 'react'
import { isCorrect } from '/lib/chess'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faXmark, faCopy } from '@fortawesome/free-solid-svg-icons'
import CopyFen from '../score/copy-fen'

export default function StormResults({ positions, display, answers }) {

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

    return (
        <div className={`${styles.stormResultsBox}`} style={{ display: (display ? "block" : "none") }}>
            <span className={styles.closeResults} onClick={() => resetGame()}><FontAwesomeIcon icon={faXmark} /></span>
            <div className={styles.resultsHeaderBox}>
                <span className={styles.resultNumber}>{answers.filter((a, i) => isCorrect(positions[i].evaluation, a)).length}</span>
                <button onClick={shareClicked} className="btn btn-lg btn-primary"><FontAwesomeIcon icon={faCopy} /> Share</button>
            </div>
            {answers.map((a, i) => {
                const p = positions[i]
                const correct = isCorrect(p.evaluation, a)
                return <div key={`answer${i}`} className={styles.resultRow} style={i == 0 ? { borderTop: "0rem #FFF solid" } : i == answers.length - 1 ? { borderBottom: "0rem #FFF solid" } : {}}>
                    <span className={correct ? styles.correctGuess : styles.wrongGuess}>
                        <FontAwesomeIcon icon={correct ? faCircleCheck : faCircleXmark} /> {mapAnswerToName(a)}
                    </span>
                    <span className={styles.stockfishSays}>
                        Stockfish: <span className={getStockfishEvalStyle(p.evaluation)}>
                            {p.evaluation[0] == '#' ? p.evaluation : parseFloat(p.evaluation) / 100}
                            </span>
                    </span>
                    <CopyFen className={styles.fenBox} fen={p.fen} />
                </div>
            })}
        </div>)
}