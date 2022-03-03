import { useState, useEffect } from 'react';
import styles from './eval-bar.module.css';

// Adapted from Trevor O'Farrell's wonderful Stockfish integrated evalbar:
// https://github.com/trevor-ofarrell/chess-evaluation-bar/blob/main/src/lib/components/EvalBar.js

export default function EvalBar({ evaluation }) {
    const [sfEval, setSfEval] = useState("");
    const [wHeight, setWHeight] = useState(50);

    const evaluateFunc = (x) => {
        if (x === 0) {
            return 0;
        } else if (x < 7) {
            return -(0.322495 * Math.pow(x, 2)) + 7.26599 * x + 4.11834;
        } else {
            return (8 * x) / 145 + 5881 / 145;
        }
    }
    const reevaluate = (evaluation) => {
        if (!evaluation) {
            evaluation = "0"
        }
        if (evaluation.startsWith('#')) {
            console.log('mate', evaluation)
            if (evaluation[1] === '-') {
                setWHeight(0)
            } else {
                setWHeight(100)
            }
            setSfEval(evaluation);
        } else {
            var adv
            if (evaluation.startsWith('-')) adv = 'b';
            else adv = 'w';

            if ((parseFloat(evaluation) / 100).toFixed(1) === 0.0) {
                evaluation = Math.abs(evaluation);
            }
            setSfEval((Math.abs(evaluation) / 100).toFixed(1));

            evaluation = Math.abs(parseFloat(evaluation) / 100);
            const evaluated = evaluateFunc(evaluation);

            if (adv === 'w') setWHeight(50 + evaluated);
            else setWHeight(50 - evaluated);
        }
    }

    useEffect(() => {
        reevaluate(evaluation)
    })

    console.log("Rendering..." + wHeight)

    return (
        <div className={styles.bar}>
            <div style={{ height: `${100 - wHeight}%`}} className={styles.blackEvalBar}>
                <span className={styles.blackEvalBarText}>
                    {wHeight < 50 ? sfEval : ""}
                </span>
            </div>
            <div style={{ height: `${wHeight}%`}} className={styles.whiteEvalBar}>
                <span className={styles.whiteEvalBarText} >
                    {wHeight >= 50 ? sfEval : ""}
                </span>
            </div>
        </div>
    )
}