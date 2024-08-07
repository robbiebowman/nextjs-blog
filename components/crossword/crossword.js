import { act, useCallback, useEffect, useState, useMemo } from 'react'
import styles from './crossword.module.css'
import Cell from './cell/cell';
import { getPuzzleId } from './utils';
import Clues from './clues';
/**
 * 
 * @param {puzzle} 2d array of chars
 * @param {clues} { across: { 1: { clue:"...", answer: "...", x: 0, y: 0 } } }
 */
export default function Crossword({ puzzle, clues, guessGrid, setGuessGrid, selectedClue, onActiveClueChange, disabled = false, isEditMode = false }) {

    const processClues = useCallback((clueSet, direction) => {
        const lookup = [];
        Object.entries(clueSet || {}).forEach(clueRaw => {
            const [number, clue] = clueRaw
            const { x, y } = clue
            if (!lookup[y]) lookup[y] = []
            if (!lookup[y][x]) lookup[y][x] = { ...clue, number, direction }
        })
        return lookup
    }, []);

    const acrossClueLookup = useMemo(() => {
        if (!clues) {
            return []
        }
        return clues && processClues(clues.across, 'across');
    }, [clues])

    const downClueLookup = useMemo(() => {
        if (!clues) {
            return []
        }
        return processClues(clues.down, 'down');
    }, [clues])

    const [orientation, setOrientation] = useState('horizontal')
    const [activeCell, setActiveCell] = useState({ x: 0, y: 0 })

    const createCellCallback = useCallback((x, y) => {
        return () => {
            if (x == activeCell.x && y == activeCell.y) {
                setOrientation(orientation == 'horizontal' ? 'vertical' : 'horizontal');
            }
            const newActiveCell = { x: x, y: y }
            setActiveCell(newActiveCell)
        }
    }, [guessGrid, orientation, activeCell])

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

    const findCellBeforeBlack = useCallback((x, y, dx, dy) => {
        if (!guessGrid) return null;
        const gridHeight = guessGrid.length;
        const gridWidth = guessGrid[0].length;
        let currentX = x;
        let currentY = y;
        let lastValidX = x;
        let lastValidY = y;

        while (true) {
            // Calculate the next position
            currentX += dx;
            currentY += dy;

            // Check if we've gone out of bounds
            if (currentX < 0 || currentX >= gridWidth || currentY < 0 || currentY >= gridHeight) {
                return { x: lastValidX, y: lastValidY };
            }

            // Check if we've hit a black box
            if (guessGrid[currentY][currentX] === '#') {
                return { x: lastValidX, y: lastValidY };
            }

            // Update the last valid position
            lastValidX = currentX;
            lastValidY = currentY;
        }
    }, [guessGrid]);

    const activeClue = useMemo(() => {
        if (orientation == 'horizontal') {
            const startingCell = findCellBeforeBlack(activeCell.x, activeCell.y, -1, 0)
            const answer = startingCell && acrossClueLookup[startingCell?.y]?.[startingCell?.x]
            const activeClue = clues?.['across']?.[answer?.number]
            return activeClue
        } else {
            const startingCell = findCellBeforeBlack(activeCell.x, activeCell.y, 0, -1)
            const answer = startingCell && downClueLookup[startingCell.y]?.[startingCell.x]
            const activeClue = clues?.['down']?.[answer?.number]
            return activeClue
        }
    }, [activeCell, orientation, downClueLookup, acrossClueLookup, clues, findCellBeforeBlack]);

    useEffect(() => {
        onActiveClueChange && onActiveClueChange(activeClue)
    }, [activeClue, onActiveClueChange])

    const handleBackspace = useCallback(() => {
        if (guessGrid[activeCell.y][activeCell.x] === '') {
            const dx = orientation === 'horizontal' ? -1 : 0;
            const dy = orientation === 'horizontal' ? 0 : -1;
            const backspaceCell = findNextCell(activeCell.x, activeCell.y, dx, dy, false, true);
            setActiveCell(backspaceCell);
        } else {
            setGuessGrid(oldGrid => {
                const newGrid = [...oldGrid];
                newGrid[activeCell.y][activeCell.x] = '';
                return newGrid;
            });
        }
    }, [activeCell, guessGrid, orientation, findNextCell]);

    const handleLetterInput = useCallback((key) => {
        setActiveCell((oldCell) => {
            const dx = orientation === 'horizontal' ? 1 : 0;
            const dy = orientation === 'horizontal' ? 0 : 1;
            return findNextCell(oldCell.x, oldCell.y, dx, dy, true, true);
        });
        setGuessGrid(oldGrid => {
            if (oldGrid[activeCell.y][activeCell.x] == '#') {
                return oldGrid
            }
            const newGrid = [...oldGrid];
            newGrid[activeCell.y][activeCell.x] = key;
            return newGrid;
        });
    }, [activeCell, orientation, findNextCell]);

    const handleArrowKey = useCallback((key) => {
        const { x, y } = activeCell;
        let dx = 0, dy = 0;
        switch (key) {
            case 'ArrowUp': dy = -1; break;
            case 'ArrowDown': dy = 1; break;
            case 'ArrowLeft': dx = -1; break;
            case 'ArrowRight': dx = 1; break;
        }
        const newCell = findNextCell(x, y, dx, dy);
        if (newCell.x !== x || newCell.y !== y) {
            setActiveCell(newCell);
            setOrientation(dx !== 0 ? 'horizontal' : 'vertical');
        }
    }, [activeCell, findNextCell]);

    const keyPressedHandler = useCallback((event) => {
        if (disabled) {
            return;
        }
        if (isEditMode && event.key === ' ') {
            setGuessGrid(oldGrid => {
                const newGrid = [...oldGrid];
                newGrid[activeCell.y][activeCell.x] = newGrid[activeCell.y][activeCell.x] === '#' ? '' : '#';
                return newGrid;
            });
        }
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
        } else if (key.length === 1 && key.match(/[a-zA-Z]/)) {
            event.preventDefault(); // Prevent default letter input behavior
            handleLetterInput(key.toLowerCase());
        } else if (key.startsWith("Arrow")) {
            event.preventDefault(); // Prevent default arrow key behavior
            handleArrowKey(key);
        }
        
    }, [disabled, isEditMode, handleBackspace, handleLetterInput, handleArrowKey]);

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

    const clueCells = useMemo(() => {
        if (!activeClue) return
        let x = activeClue.x
        let y = activeClue.y
        let clueCells = [{ x: x, y: y }]
        for (let i = 1; i < activeClue.answer.length; i++) {
            if (activeClue.direction == 'across') {
                clueCells.push({ x: x + i, y: y })
            } else {
                clueCells.push({ x: x, y: y + i })
            }
        }
        return clueCells
    }, [activeClue, clues])

    const isHighlightedRow = useCallback((x, y) => {
        if (!clueCells) return
        for (let cell of clueCells) {
            if (cell.x == x && cell.y == y) {
                return true
            }
        }
        return false
    }, [clueCells])

    useEffect(() => {
        if (!selectedClue) return;
        const dx = orientation === 'horizontal' ? 1 : 0;
        const dy = orientation === 'horizontal' ? 0 : 1;
        const newCell = findNextCell(selectedClue.coordinates.x, selectedClue.coordinates.y, dx, dy, true, false);
        setActiveCell(newCell)
        setOrientation(selectedClue.orientation)
    }, [selectedClue])

    return (
        <div className={styles.crosswordBox}>
            {guessGrid && guessGrid.map((row, y) => (
                <div key={`${y}-row`} className={styles.crosswordRow}>
                    {row.map((char, x) => {
                        const number = (acrossClueLookup[y]?.[x] || downClueLookup[y]?.[x])?.number
                        return <Cell
                            key={`${x}-${y}`}
                            letter={char}
                            onClick={createCellCallback(x, y)}
                            isActiveCell={activeCell.x == x && activeCell.y == y}
                            isHighlightedRow={isHighlightedRow(x, y)}
                            number={number}
                            isEditMode={isEditMode}
                        />
                    })}
                </div>
            ))}
        </div>
    )
}