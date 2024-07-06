import { act, useCallback, useEffect, useState, useMemo } from 'react'
import styles from './crossword.module.css'
import Cell from './cell/cell';
import { getPuzzleId } from './utils';
import Clues from './clues';
import Crossword from './crossword';
/**
 * 
 * @param {puzzle} 2d array of chars
 * @param {clues} { across: { 1: { clue:"...", answer: "...", x: 0, y: 0 } } }
 */
export default function CrosswordGame({ puzzle, clues }) {

    const puzzleId = useMemo(() => {
        return getPuzzleId(puzzle)
    }, [puzzle])

    const [guessGrid, setGuessGrid] = useState([
        ['l', 'o', 'a', '', ''],
        ['', '', 'd', 'i', ''],
        ['', '', '#', 'n', ''],
        ['', '.', '.', 'g', ''],
        ['', '.', '', '#', '']
    ]);
    const [isComplete, setComplete] = useState(false)
    const [selectedClue, setSelectedClue] = useState(null)

    const loadProgress = useCallback(() => {
        const savedState = localStorage.getItem(`${puzzleId}-progress`);
        return savedState ? JSON.parse(savedState) : null;
    }, [puzzleId]);

    const saveProgress = useCallback(() => {
        localStorage.setItem(`${puzzleId}-progress`, JSON.stringify(guessGrid));
    }, [puzzleId, guessGrid]);

    const onClueClicked = useCallback((number, acrossOrDown) => {
        const newOrientation = acrossOrDown == 'across' ? 'horizontal' : 'vertical'
        const { x, y } = (clues)[acrossOrDown][number]
        if (guessGrid[y][x] === '') {
            setSelectedClue({ coordinates: { x: x, y: y }, orientation: newOrientation })
        } else {
            const dx = newOrientation === 'horizontal' ? 1 : 0;
            const dy = newOrientation === 'horizontal' ? 0 : 1;
            const newCoordinate = findNextCell(x, y, dx, dy, true, false)
            setSelectedClue({ coordinates: newCoordinate, orientation: newOrientation })
        }
    }, [clues, guessGrid])

    const blankGrid = useMemo(() => {
        return puzzle?.map(row => row.map(c => c == '#' ? '#' : ''))
    }, [puzzle])

    const findNextCell = useCallback((x, y, dx, dy, skipLetters = false, wrap = false) => {
        if (!guessGrid) return null;
        const gridHeight = guessGrid.length;
        const gridWidth = guessGrid[0].length;
        let newX = x;
        let newY = y;
        let cellsChecked = 0;
        const totalCells = gridWidth * gridHeight;

        while (cellsChecked < totalCells) {
            newX += dx;
            newY += dy;

            // Handle wrapping
            if (wrap) {
                if (newX >= gridWidth) {
                    newX = 0;
                    newY = (newY + 1) % gridHeight;
                } else if (newX < 0) {
                    newX = gridWidth - 1;
                    newY = (newY - 1 + gridHeight) % gridHeight;
                } else if (newY >= gridHeight) {
                    newY = 0;
                    newX = (newX + 1) % gridWidth;
                } else if (newY < 0) {
                    newY = gridHeight - 1;
                    newX = (newX - 1 + gridWidth) % gridWidth;
                }
            } else if (newX < 0 || newX >= gridWidth || newY < 0 || newY >= gridHeight) {
                return { x, y }; // Return original position if out of bounds and not wrapping
            }

            const char = guessGrid[newY][newX];
            if (char !== '#' && (!skipLetters || (char < 'a' || char > 'z'))) {
                return { x: newX, y: newY };
            }
            cellsChecked++;
        }
        return { x, y }; // Return original position if no valid cell found after checking all cells
    }, [guessGrid]);

    const [activeClue, setActiveClue] = useState()

    useEffect(() => {
        const savedProgress = loadProgress()
        if (savedProgress) {
            setGuessGrid(savedProgress)
        } else {
            setGuessGrid(blankGrid)
        }
    }, [puzzleId, puzzle])

    useEffect(() => {
        const savedCompleted = localStorage.getItem(`${puzzleId}-completed`)
        const isCurrentlyCompleted = JSON.stringify(guessGrid) == JSON.stringify(puzzle)
        const eitherCompleted = isCurrentlyCompleted || savedCompleted
        if (eitherCompleted) {
            localStorage.setItem(`${puzzleId}-completed`, true);
        }
        setComplete(eitherCompleted)
        saveProgress()
    }, [guessGrid, saveProgress])

    return (
        <div className={styles.outerBox}>
            {isComplete ? (
                <div className={`${styles.resultBox} ${styles.successBox}`}>
                    <p className={styles.successText}>🎉 Completed Puzzle! 🎉</p>
                </div>
            ) : ""}
            <div className={styles.box}>
                <Crossword
                    puzzle={puzzle}
                    clues={clues}
                    guessGrid={guessGrid}
                    setGuessGrid={setGuessGrid}
                    selectedClue={selectedClue}
                    onActiveClueChange={setActiveClue}
                />
                <Clues clues={clues} onClueClick={onClueClicked} activeClue={activeClue} />
            </div>
        </div>
    )
}