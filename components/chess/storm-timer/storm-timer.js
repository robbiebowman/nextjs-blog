import { useState, useEffect } from "react"
import styles from './storm-timer.module.css'


export default function StormTimer({ onTimerPressed, correctGuesses, wrongGuesses }) {

    const [gameInProgress, setGameInProgress] = useState(false)
    const [seconds, setSeconds] = useState(60)

    const [handledCorrectGuesses, setHandledCorrectGuesses] = useState(0)
    const [handledWrongGuesses, setHandledWrongGuesses] = useState(0)

    if (handledCorrectGuesses != correctGuesses) {
        setHandledCorrectGuesses(correctGuesses)
    }

    if (handledWrongGuesses != wrongGuesses) {
        setHandledWrongGuesses(wrongGuesses)
    }

    useEffect(() => {
        setSeconds(sec => sec + 3)
    }, [handledCorrectGuesses])

    useEffect(() => {
        setSeconds(sec => sec - 10)
    }, [handledWrongGuesses])

    useEffect(() => {
        let interval = null;
        if (gameInProgress) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (!gameInProgress && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [gameInProgress, seconds])

    const timerPressed = () => {
        onTimerPressed()
        setGameInProgress(true)
    }

    return (
        <div>
            {gameInProgress
                ? <></>
                : <button className="btn btn-primary" onClick={timerPressed}>Start!</button>
            }
            <span className={`${styles.timerText}`}>{seconds}</span>
        </div>
    )
}