import { useState } from 'react';
import styles from './difficulty-selector.module.css'

export default function DifficultySelector({setDifficulty, disabled}) {

    const [selected, setSelected] = useState('Medium')

    const selectDifficulty = (level) => {
        if (disabled) {
            return
        }
        setDifficulty(level)
        setSelected(level)
    }

    return (
        <div className={styles.selectorBox} style={{cursor: disabled ? "" : "pointer"}}>
            <span className={selected == 'Easy' ? styles.selected : styles.unselected} onClick={() => {selectDifficulty('Easy')}}>Easy</span>
            <span className={selected == 'Medium' ? styles.selected : styles.unselected} onClick={() => {selectDifficulty('Medium')}}>Medium</span>
            <span className={selected == 'Hard' ? styles.selected : styles.unselected} onClick={() => {selectDifficulty('Hard')}}>Hard</span>
        </div>
    )
}