import { useCookies } from "react-cookie"
import styles from "./score.module.css"

export default function Score({ answer, evaluation, fen, nextClicked }) {

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
        <div className={styles.resultBox}>
            <p>{resultMessage}</p>
            <button className="btn" onClick={nextClicked}>Next</button>
        </div>
    )
}