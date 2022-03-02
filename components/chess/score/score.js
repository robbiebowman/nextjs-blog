import { useCookies } from "react-cookie"

export default function Score({ answer, evaluation, fen, nextClicked }) {

    // result { correct: boolean, guess: char (=,-,+), fen: string, nextClicked: func }
    const result = evaluation > 0 ? "White is winning" : evaluation < 0 ? "Black is winning" : "The position is even"
    const wasCorrect = (answer == "+" && evaluation > 0) || (answer == "-" && evaluation < 0) || (answer == "=" && evaluation == 0)
    const resultMessage = (wasCorrect ? "Correct!" : "According to Stockfish:") + " " + result

    return (
        <div>
            <p>{resultMessage}</p>
            <button onClick={nextClicked}>Next</button>
        </div>
    )
}