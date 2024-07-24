import { act, useCallback, useEffect, useState, useMemo, useRef } from 'react'
import styles from './title-game.module.css'
/**
 * 
 * @param {puzzle} 2d array of chars
 * @param {clues} { across: { 1: { clue:"...", answer: "...", x: 0, y: 0 } } }
 */
export default function TitleGameInput({ solution, onSolutionFound, isSolved }) {

    const [guessTitle, setGuessTitle] = useState('')
    const [inputHistory, setInputHistory] = useState('');

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

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            inputRef.current.focus();
        }
    };

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
        if (key.match(/[a-zA-Z0-9]/)) {
            setGuessTitle((prev) => prev.replace('_', key))
        }
    };

    const keyPressedHandler = (event) => {

        // Check if any modifier keys are pressed
        const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;

        // If a modifier key is pressed, don't handle the event
        if (isModifierKeyPressed) {
            return;
        }

        const inputKey = event.key;

        if (inputKey === 'Backspace') {
            event.preventDefault(); // Prevent default backspace behavior
            handleBackspace();
        } else if (inputKey === ' ') {
            event.preventDefault(); // Prevent default backspace behavior
        } else if (inputKey.length === 1) {
            event.preventDefault(); // Prevent default letter input behavior
            handleLetterInput(inputKey);
        }
    };

    const handleInput = (e) => {
        const currentValue = e.target.value;
        
        if (currentValue.length < inputHistory.length) {
          // Backspace was pressed
          setInputHistory(prevHistory => prevHistory.slice(0, -1));
          handleBackspace();
        } else if (currentValue.length > inputHistory.length) {
          // New character was added
          const newChar = currentValue[currentValue.length - 1];
          setInputHistory(prevHistory => prevHistory + newChar);
          handleLetterInput(newChar);
        }
      };

    useEffect(() => {
        const handleKeyDown = (event) => {
            keyPressedHandler(event)
        };
        const handleInputFunc = (event) => {
            handleInput(event)
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('input', handleInputFunc);
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('input', handleInputFunc);
        };
    }, [keyPressedHandler, handleInput]);

    const titleStyle = `${styles.newTitle} ${isSolved ? styles.successTitle : ''}`

    return (
        <>
            <p
                onClick={handleClick}
                className={titleStyle}>{guessTitle}
            </p>
            <input
                ref={inputRef}
                style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-quicktypes="off"
            />

        </>
    )
}