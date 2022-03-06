import { useState } from 'react';
import styles from './difficulty-selector.module.css'

export default function DifficultySelector({difficulty, onDifficultyChanged, disabled}) {


    const selectDifficulty = (level) => {
        if (disabled) {
            return
        }
        onDifficultyChanged(level)
    }

    return (
        <div className={styles.selectorBox} style={{cursor: disabled ? "" : "pointer"}}>
            <span className={difficulty == 'Easy' ? styles.selected : styles.unselected} onClick={() => {selectDifficulty('Easy')}}>Easy</span>
            <span className={difficulty == 'Medium' ? styles.selected : styles.unselected} onClick={() => {selectDifficulty('Medium')}}>Medium</span>
            <span className={difficulty == 'Hard' ? styles.selected : styles.unselected} onClick={() => {selectDifficulty('Hard')}}>Hard</span>
        </div>
    )
}