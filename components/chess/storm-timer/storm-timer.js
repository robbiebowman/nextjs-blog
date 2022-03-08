import { useState, useEffect } from "react"
import styles from './storm-timer.module.css'


export default function StormTimer({ onTimerPressed, correctGuesses, wrongGuesses, onGameEnded }) {

    const [seconds, setSeconds] = useState(60)
    const [gameStage, setGameStage] = useState('Pregame') // Pregame, Live, Postgame

    const [handledCorrectGuesses, setHandledCorrectGuesses] = useState(0)
    const [handledWrongGuesses, setHandledWrongGuesses] = useState(0)

    const [pulseCorrectTime, setPulseCorrectTime] = useState(false)
    const [pulseWrongTime, setPulseWrongTime] = useState(false)

    useEffect(() => {
        if (correctGuesses != 0) {
            setSeconds(sec => sec + 3)
            setPulseCorrectTime(true)
            setTimeout(() => {
                setPulseCorrectTime(false)
            }, 300)
        }
    }, [handledCorrectGuesses])

    useEffect(() => {
        if (wrongGuesses != 0) {
            setSeconds(sec => sec - 10)
            setPulseWrongTime(true)
            setTimeout(() => {
                setPulseWrongTime(false)
            }, 300)
        }
    }, [handledWrongGuesses])

    if (handledCorrectGuesses != correctGuesses) {
        setHandledCorrectGuesses(correctGuesses)
    }

    if (handledWrongGuesses != wrongGuesses) {
        setHandledWrongGuesses(wrongGuesses)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (gameStage == "Live") {
                setSeconds(seconds - 1);
            }
        }, 1000);
        if (seconds < 1) {
            clearTimeout(timer)
            if (gameStage == "Live") {
                setGameStage("Postgame")
                onGameEnded()
            }
        }
        return () => {
            clearTimeout(timer);
        };
    }, [seconds, gameStage]);

    const timerPressed = () => {
        onTimerPressed()
        setGameStage("Live")
    }

    return (
        <div className={styles.timerBox}>
            {gameStage == "Pregame"
                ? <button className="btn btn-primary" onClick={timerPressed}>Start!</button>
                : gameStage == "Live"
                    ? <span className={`${styles.timerText} ${pulseCorrectTime ? styles.correctTimerText : pulseWrongTime ? styles.wrongTimerText : styles.standardTimerText}`}>{seconds}</span>
                    : <></>
            }
            <div className={styles.wrongGuessCounter}>
                <span>{wrongGuesses >= 1 ? "❌" : "⬜"}</span>
                <span>{wrongGuesses >= 2 ? "❌" : "⬜"}</span>
                <span>{wrongGuesses >= 3 ? "❌" : "⬜"}</span>
            </div>
        </div>
    )
}