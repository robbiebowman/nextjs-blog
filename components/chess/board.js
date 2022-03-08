import styles from './chess.module.css'
import { loadNewRandomPuzzle, isCorrect } from '/lib/chess'
import { Chessboard } from "react-chessboard"
import EvalBar from "./eval-bar/eval-bar"
import { useState, useEffect, createRef } from 'react'

export default function Board({ data, difficulty, onCorrect, onWrong, showResults, whomToMoveSibling, disableButtons }) {
    if (data === undefined) {
        data = {fen: "", evaluation: ""}
    }
    const whomToMove = data.fen.split(' ')[1] == 'w' ? "⬜ White" : "⬛ Black" || "⬜ Loading..."

    const usedForGettingRemSize = createRef()
    const [boardWidth, setBoardWidth] = useState(400)

    const selectAnswer = (answer) => {
        if (isCorrect(data.evaluation, answer)) {
            onCorrect(answer)
        } else {
            onWrong(answer)
        }
    }

    useEffect(() => {
        const width = parseFloat(getComputedStyle(usedForGettingRemSize.current).width);
        setBoardWidth(Math.min(width, 500))
    }, []);

    return (<>
        <div className={styles.difficultyAndWhomToMove}>
            <div className={styles.whomToMove}><span>{`${whomToMove} to move`}</span></div>
            {whomToMoveSibling}
        </div>
        <div className={styles.boardAndEval} ref={usedForGettingRemSize}>
            <div className={showResults ? styles.visibleEval : styles.invisibleEval}><EvalBar evaluation={data.evaluation} /></div>
            <Chessboard boardWidth={boardWidth} arePiecesDraggable={false} position={data.fen} />
            <div className={styles.thingToMakeBoardSymmetrical} />
        </div>
        <div className={styles.guessBox}  ref={usedForGettingRemSize}>
            <button type="button"
                className="btn btn-light"
                disabled={showResults || disableButtons}
                onClick={() => selectAnswer("+")}>White</button>
            <button type="button"
                className={"btn btn-secondary " + (difficulty == 'Hard' ? styles.visibleButton : styles.hiddenButton)}
                disabled={showResults || difficulty != 'Hard' || disableButtons}
                onClick={() => selectAnswer("=")}>Even</button>
            <button type="button"
                className="btn btn-dark"
                disabled={showResults || disableButtons}
                onClick={() => selectAnswer("-")}>Black</button>
        </div>
    </>)

}