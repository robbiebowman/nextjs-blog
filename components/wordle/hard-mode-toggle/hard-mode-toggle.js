import { useState } from 'react';
import styles from './hard-mode-toggle.module.css'

export default function HardModeToggle({hardModeOn, onToggled, disabled}) {

    const toggleHardMode = (hardMode) => {
        if (disabled) {
            return
        }
        onToggled(hardMode)
    }

    return (
        <div className={styles.selectorBox} style={{cursor: disabled ? "" : "pointer"}}>
            <span className={!hardModeOn ? styles.selected : styles.unselected} onClick={() => {toggleHardMode(false)}}>Normal</span>
            <span className={hardModeOn ? styles.selected : styles.unselected} onClick={() => {toggleHardMode(true)}}>Hard Mode</span>
        </div>
    )
}