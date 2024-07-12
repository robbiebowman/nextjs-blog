import { act, useCallback, useEffect, useState, useMemo, useRef } from 'react'
import styles from './title-game.module.css'
/**
 * 
 * @param {puzzle} 2d array of chars
 * @param {clues} { across: { 1: { clue:"...", answer: "...", x: 0, y: 0 } } }
 */
export default function TitleGameInput({ solution, onSolutionFound, isSolved }) {

    const [guessTitle, setGuessTitle] = useState('')

    useEffect(() => {
        if (solution) {
            setGuessTitle(solution.replace(/[a-zA-Z0-9]/g, '_'))
        }
    }, [solution])

    useEffect(() => {
        if (isSolved) {
            setGuessTitle(solution)
        }
    }, [isSolved, solution])

    useEffect(() => {
        if (solution && guessTitle.toLowerCase() === solution.toLowerCase()) {
            onSolutionFound()
        }
    }, [guessTitle])


    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            inputRef.current.focus();
        }
    }, [inputRef]);

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

        // Check if any modifier keys are pressed
        const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;

        // If a modifier key is pressed, don't handle the event
        if (isModifierKeyPressed) {
            return;
        }

        const key = event.key;

        if (key === 'Backspace') {
            event.preventDefault(); // Prevent default backspace behavior
            handleBackspace();
        } else if (key === ' ') {
            event.preventDefault(); // Prevent default backspace behavior
        } else if (key.length === 1 && key.match(/[a-zA-Z0-9]/)) {
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

    const titleStyle = `${styles.newTitle} ${isSolved ? styles.successTitle : ''}`

    return (
        <>
            <p
                ref={inputRef}
                className={titleStyle}>{guessTitle}</p>
            <input
                ref={inputRef}
                style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
            />
        </>
    )
}