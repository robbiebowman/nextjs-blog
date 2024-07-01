import { useCallback, useMemo, useState } from 'react'
import styles from './clues.module.css'
import { FlexWrapDetector } from './utils'

/**
 * 
 * @param {clues} { across: { 1: { clue:"...", answer: "...", x: 0, y: 0 } } }
 */
export default function Clues({ clues, onClueClick, activeClue }) {
    const [isMobile, setIsMobile] = useState(false);

    const formatClues = useCallback((clueObject) => {
        let formattedClues = []
        Object.entries(clueObject || {}).forEach(([number, { clue, answer, x, y }]) => {
            const formattedClue = { number, clue }
            formattedClues.push(formattedClue)
        })
        return formattedClues
    }, [clues])

    const acrossClues = useMemo(() => {
        if (clues?.across) {
            return formatClues(clues.across)
        }
    }, [clues])

    const downClues = useMemo(() => {
        if (clues?.down) {
            return formatClues(clues.down)
        }
    }, [clues])

    return (
        <div>
            {isMobile && activeClue && <div className={styles.bannerClue}>
                <span className={styles.highlightRow}><span className={styles.number}>{activeClue.number}</span> {activeClue.clue}</span>
            </div>}
            <FlexWrapDetector className={styles.box} onWrap={setIsMobile}>
                <div className={styles.clueBox}>
                    <h1>Across</h1>
                    {acrossClues && acrossClues.map(c => {
                        const { number, clue } = c;
                        const isActiveClue = activeClue?.number == number && activeClue.direction == 'across'
                        return (<div key={number + 'across'} className={isActiveClue ? styles.highlightRow : styles.clueRow} onClick={() => { onClueClick(number, 'across') }}>
                            <span className={styles.number}>{number}</span> {clue}
                        </div>)
                    })}
                </div>
                <div className={styles.clueBox}>
                    <h1>Down</h1>
                    {downClues && downClues.map(c => {
                        const { number, clue } = c;
                        const isActiveClue = activeClue?.number == number && activeClue.direction == 'down'
                        return (<div key={number + 'down'} className={isActiveClue ? styles.highlightRow : styles.clueRow} onClick={() => { onClueClick(number, 'down') }}>
                            <span className={styles.number}>{number}</span> {clue}
                        </div>)
                    })}
                </div>
            </FlexWrapDetector>
        </div>)
}