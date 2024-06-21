import { act, useCallback, useEffect, useState, useMemo } from 'react'
import styles from './crossword.module.css'
import Cell from './cell/cell';
import { getGridProgress, setGridProgress } from '../../lib/crossword-cookies'
/**
 * 
 * @param {puzzle} 2d array of chars
 * @param {clues} { across: { 1: { clue:"...", answer: "...", x: 0, y: 0 } } }
 */
export default function Crossword({ puzzle, clues }) {

    const puzzleId = useMemo(() => {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(JSON.stringify(puzzle)).digest('hex')
    }, [puzzle])

    const [guessGrid, setGuessGrid] = useState([
        ['l', 'o', 'a', '', ''],
        ['', '', 'd', 'i', ''],
        ['', '', '#', 'n', ''],
        ['', '.', '.', 'g', ''],
        ['', '.', '', '#', '']
    ]);
    const [orientation, setOrientation] = useState('horizontal')
    const [activeCell, setActiveCell] = useState({ x: 0, y: 0 })

    const blankGrid = useMemo(() => {
        return puzzle.map(row => row.map(c => c == '#' ? '#' : ''))
    }, [puzzle])

    const createCellCallback = useCallback((x, y) => {
        return () => {
            if (x == activeCell.x && y == activeCell.y) {
                setOrientation(orientation == 'horizontal' ? 'vertical' : 'horizontal');
            }
            const newActiveCell = { x: x, y: y }
            setActiveCell(newActiveCell)
        }
    }, [guessGrid, orientation, activeCell])

    const isHighlightedRow = useCallback((x, y) => {
        if (orientation == 'horizontal') {
            return y == activeCell.y
        } else {
            return x == activeCell.x
        }
    }, [orientation, activeCell])

    const findNextCell = useCallback((x, y, dx, dy, skipLetters = false, wrap = false) => {
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

    useEffect(() => {
        const savedProgress = getGridProgress(puzzleId) ?? blankGrid
        setGuessGrid(savedProgress)
    })

    const keyPressedHandler = useCallback((key) => {
        if (key === 'Backspace') {
            if (guessGrid[activeCell.y][activeCell.x] == '') {
                const dx = orientation == 'horizontal' ? -1 : 0
                const dy = orientation == 'horizontal' ? 0 : -1
                const backspaceCell = findNextCell(activeCell.x, activeCell.y, dx, dy, false, true)
                setActiveCell(backspaceCell)
            } else {
                setGuessGrid(oldGrid => {
                    const newGrid = [...oldGrid]
                    newGrid[activeCell.y][activeCell.x] = ''
                    return newGrid
                })
            }
        } else if (key.length == 1 && ((key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z'))) {
            setActiveCell((oldCell) => {
                const dx = orientation == 'horizontal' ? 1 : 0
                const dy = orientation == 'horizontal' ? 0 : 1
                return findNextCell(oldCell.x, oldCell.y, dx, dy, true, true)
            })
            setGuessGrid(oldGrid => {
                const newGrid = [...oldGrid]
                newGrid[activeCell.y][activeCell.x] = key
                return newGrid
            })
        } else if (key.startsWith("Arrow")) {
            let newCell;
            const x = activeCell.x
            const y = activeCell.y

            switch (key) {
                case 'ArrowUp':
                    newCell = findNextCell(x, y, 0, -1);
                    break;
                case 'ArrowDown':
                    newCell = findNextCell(x, y, 0, 1);
                    break;
                case 'ArrowLeft':
                    newCell = findNextCell(x, y, -1, 0);
                    break;
                case 'ArrowRight':
                    newCell = findNextCell(x, y, 1, 0);
                    break;
            }

            if (newCell.x !== x) {
                setActiveCell(newCell);
                setOrientation('horizontal')
            } else if (newCell.y !== y) {
                setActiveCell(newCell)
                setOrientation('vertical')
            }
        }
    }, [activeCell, guessGrid, orientation, findNextCell])

    useEffect(() => {
        const handleKeyDown = (event) => {
            keyPressedHandler(event.key)
        };
        window.addEventListener('keydown', handleKeyDown);
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [keyPressedHandler]);

    let y = -1

    return (
        <div className={styles.box}>
            {
                guessGrid.map(row => {
                    y++
                    let x = -1
                    return <div className={styles.crosswordRow}>
                        {row.map((char) => {
                            x++
                            return <Cell
                                letter={char}
                                onClick={char == '#' ? null : createCellCallback(x, y)}
                                isActiveCell={activeCell.x == x && activeCell.y == y}
                                isHighlightedRow={isHighlightedRow(x, y)}
                                number={y % 2 == 0 ? y : null}
                            />
                        })}
                    </div>
                })
            }
        </div>
    )
}