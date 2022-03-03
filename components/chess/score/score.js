import { useCookies } from "react-cookie"
import { createRef } from 'react'
import styles from "./score.module.css"

export default function Score({ answer, evaluation, fen, nextClicked }) {

    const fenBox = createRef()

    // result { correct: boolean, guess: char (=,-,+), fen: string, nextClicked: func }
    if (!evaluation) return (<div>Loading...</div>)
    var result
    var wasCorrect
    const wasMate = evaluation[0] == '#'
    if (wasMate) {
        wasCorrect = answer == evaluation[1]
        result = `${evaluation[1] == '+' ? "White" : "Black"} has mate in ${evaluation.substring(2)}!`
    } else {
        wasCorrect = (answer == "+" && evaluation > 0) || (answer == "-" && evaluation < 0) || (answer == "=" && evaluation == 0)
        result = evaluation > 0 ? "White is winning" : evaluation < 0 ? "Black is winning" : "The position is even"
    }
    const resultMessage = `${wasCorrect ? "Correct!" : "According to Stockfish:"} ${result}`

    return (
        <div className={styles.feedbackBox}>
            <div className={styles.resultsBox}>
                <p>{resultMessage}</p>
                <button className="btn btn-success" onClick={nextClicked}>Next</button>
            </div>
            <div className={styles.copyFenBox}>
                <input type="text" id="fen" name="fen" value={fen} className={styles.fenBox} />
                <button className={`btn btn-info btn-sm ${styles.copyFen}`} onClick={() => {navigator.clipboard.writeText(fen)}}>Copy FEN</button>
            </div>
        </div>
    )
}