import { useCookies } from "react-cookie"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faFire, faFireFlameCurved, faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import styles from "./score.module.css"

export default function Score({ answer, evaluation, fen, nextClicked, evaluator, currentStreak }) {

    const [fenBoxOpen, setFenBoxOpen] = useState(false)

    if (!evaluation) return (<div>Loading...</div>)

    const wasCorrect = evaluator(evaluation, answer)

    const getReact = (streak) => {
        if (streak == 2) {
            return (
                <p className={styles.streakOne}>
                    <FontAwesomeIcon icon={faFireFlameCurved} size="xl" />
                    <span className={styles.streakText}>{currentStreak} in a row!</span>
                </p>)
        }
        if (streak == 3) {
            return (
                <p className={styles.streakTwo}>
                    <FontAwesomeIcon icon={faFireFlameCurved} size="xl" />
                    <span className={styles.streakText}>{currentStreak} in a row!</span>
                </p>)
        }
        if (streak == 4) {
            return (
                <p className={styles.streakThree}>
                    <FontAwesomeIcon icon={faFireFlameCurved} size="xl" />
                    <span className={styles.streakText}>{currentStreak} in a row!</span>
                </p>)
        }
        if (streak == 5 || streak == 6) {
            return (
                <p className={styles.streakThree}>
                    <Image src="/images/chess-reacts/doge.png" height={40} width={40} />
                    <span className={styles.streakText}>{currentStreak} in a row!</span>
                </p>)
        }
        if (streak < 10) {
            return (
                <p className={styles.streakThree}>
                    <Image src="/images/chess-reacts/cool-doge.gif" height={40} width={40} />
                    <span className={styles.streakText}>{currentStreak} in a row!</span>
                </p>)
        }
        if (streak < 12) {
            return (
                <p className={styles.streakThree}>
                    <Image src="/images/chess-reacts/cat.png" height={40} width={40} />
                    <span className={styles.streakText}>{currentStreak} in a row!</span>
                </p>)
        }
        if (streak < 15) {
            return (
                <p className={styles.streakThree}>
                    <Image src="/images/chess-reacts/catjam.gif" height={40} width={40} />
                    <span className={styles.streakText}>{currentStreak} in a row!</span>
                </p>)
        }
        if (streak >= 15) {
            return (
                <p className={styles.streakThree}>
                    <Image src="/images/chess-reacts/amaze.gif" height={40} width={40} />
                    <span className={styles.streakText}>{currentStreak} in a row!</span>
                </p>)
        }
    }

    return (
        <div className={styles.feedbackBox}>
            <div className={styles.resultsBox}>
                {wasCorrect ? <span styles={{ display: (wasCorrect ? "block" : "none") }} className={styles.correctAnswer}>Correct!</span>
                    : <span styles={{ display: (wasCorrect ? "none" : "block") }} className={styles.incorrectAnswer}>Stockfish disagrees 🤖</span>}
                <button className="btn btn-success" onClick={nextClicked}><FontAwesomeIcon icon={faArrowRightLong} size="s" /></button>
            </div>
            {currentStreak > 1 ?
                <div className={styles.streakBox}>
                    {getReact(currentStreak)}
                </div>
                : <div />}
                <div className={styles.expandCopyFenBox} onClick={() => {setFenBoxOpen(!fenBoxOpen)}}>
                    <span>{fenBoxOpen ? <FontAwesomeIcon icon={faAngleUp} size="s" /> : <FontAwesomeIcon icon={faAngleDown} size="s" />}</span>
                </div>
            <div className={fenBoxOpen ? styles.copyFenBox : styles.copyFenBoxClosed}>
                <a className={styles.chessDotComLink} target="_blank" rel="noopener noreferrer" href={`https://www.chess.com/play/computer?fen=${fen}`}>Open in Chess.com</a>
                <input type="text" id="fen" name="fen" value={fen} className={styles.fenBox} />
                <button className={`btn btn-info btn-sm ${styles.copyFen}`} onClick={() => { navigator.clipboard.writeText(fen) }}>Copy FEN</button>
            </div>
        </div>
    )
}