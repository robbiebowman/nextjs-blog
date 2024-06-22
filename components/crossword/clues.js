import { act, useCallback, useEffect, useState, useMemo } from 'react'
import styles from './clues.module.css'
import Cell from './cell/cell';
import { getGridProgress, setGridProgress } from '../../lib/crossword-cookies'
/**
 * 
 * @param {clues} { across: { 1: { clue:"...", answer: "...", x: 0, y: 0 } } }
 */
export default function Clues({ clues, onClueClick, activeClue }) {

    const formatClues = useCallback((clueObject) => {
        let formattedClues = []
        Object.entries(clueObject || {}).forEach(([number, { clue, answer, x, y }]) => {
            const formattedClue = { number, clue }
            formattedClues.push(formattedClue)
        })
        return formattedClues
    }, [clues])

    const acrossClues = useMemo(() => {
        return formatClues(clues.across)
    }, [clues])

    const downClues = useMemo(() => {
        return formatClues(clues.down)
    }, [clues])

    return (<div className={styles.box}>
        <div className={styles.clueBox}>
            <h1>Across</h1>
            {acrossClues.map(c => {
                const { number, clue } = c;
                const isActiveClue = activeClue?.number == number && activeClue.direction == 'across'
                return (<div key={number + 'across'} className={isActiveClue ? styles.highlightRow : styles.clueRow} onClick={() => { onClueClick(number, 'across') }}>
                    <span className={styles.number}>{number}</span> {clue}
                </div>)
            })}
        </div>
        <div className={styles.clueBox}>
            <h1>Down</h1>
            {downClues.map(c => {
                const { number, clue } = c;
                const isActiveClue = activeClue?.number == number && activeClue.direction == 'down'
                return (<div key={number + 'down'} className={isActiveClue ? styles.highlightRow : styles.clueRow} onClick={() => { onClueClick(number, 'down') }}>
                    <span className={styles.number}>{number}</span> {clue}
                </div>)
            })}
        </div>
    </div>)
}