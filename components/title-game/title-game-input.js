import { act, useCallback, useEffect, useState, useMemo } from 'react'
import styles from './title-game.module.css'
/**
 * 
 * @param {puzzle} 2d array of chars
 * @param {clues} { across: { 1: { clue:"...", answer: "...", x: 0, y: 0 } } }
 */
export default function TitleGameInput({ solution }) {

    const [guessTitle, setGuessTitle] = useState('')

    useEffect(() => {
        if (solution) {
            setGuessTitle(solution.replace(/[a-zA-Z]/g, '_'))
        }
    }, [solution])

    const handleBackspace = () => {
        setGuessTitle((prev) => {
            const lastIndex = prev.split('').reverse().findIndex(char => /[a-zA-Z0-9]/.test(char));

            if (lastIndex === -1) {
                // No alphanumeric characters found
                return prev;
            }

            // Convert to array, replace the character, and join back to string
            const strArray = prev.split('');
            strArray[prev.length - 1 - lastIndex] = '_';
            return strArray.join('')
        })
    }

    const handleLetterInput = (key) => {
        setGuessTitle((prev) => prev.replace('_', key))
    };

    const keyPressedHandler = (event) => {

        const key = event.key;

        if (key === 'Backspace') {
            event.preventDefault(); // Prevent default backspace behavior
            handleBackspace();
        } else if (key === 'Space') {
            event.preventDefault(); // Prevent default backspace behavior
        } else if (key.length === 1 && key.match(/[a-zA-Z]/)) {
            event.preventDefault(); // Prevent default letter input behavior
            handleLetterInput(key);
        }

    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            keyPressedHandler(event)
        };
        window.addEventListener('keydown', handleKeyDown);
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [keyPressedHandler]);

    return (<p className={styles.newTitle}>{guessTitle}</p>
    )
}