import { act, useCallback, useEffect, useState, useMemo } from 'react'
import styles from './crossword.module.css'
import Cell from './cell/cell';
import { getGridProgress, setGridProgress } from '../../lib/crossword-cookies'

export default function Crossword({ puzzle }) {

    const puzzleId = useMemo(() => {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(JSON.stringify(puzzle)).digest('hex')
    }, [puzzle])

    const [clues, setClues] = useState(null)
    const [guessGrid, setGuessGrid] = useState([
        ['l', 'o', 'a', '', ''],
        ['', '', 'd', 'i', ''],
        ['', '', '#', 'n', ''],
        ['', '.', '.', 'g', ''],
        ['', '.', '', '#', '']
    ]);
    const [orientation, setOrientation] = useState('horizontal')
    const [activeCell, setActiveCell] = useState({ x: 0, y: 0 })

    const dimensions = useMemo(() => {
        let maxRow = 0;
        let maxCol = 0;

        // Helper function to update maxRow and maxCol
        function updateMax(row, col, length, isAcross) {
            if (isAcross) {
                maxRow = Math.max(maxRow, row);
                maxCol = Math.max(maxCol, col + length - 1);
            } else {
                maxRow = Math.max(maxRow, row + length - 1);
                maxCol = Math.max(maxCol, col);
            }
        }
        for (const key in puzzle.across) {
            const clue = puzzle.across[key];
            updateMax(clue.row, clue.col, clue.answer.length, true);
        }
        for (const key in puzzle.down) {
            const clue = puzzle.down[key];
            updateMax(clue.row, clue.col, clue.answer.length, false);
        }

        return {
            rows: maxRow + 1,
            cols: maxCol + 1
        };
    }, [puzzle])
    const completedGrid = useMemo(() => {
        const grid = Array.from({ length: dimensions.rows }, () => Array(dimensions.cols).fill('#'));

        function placeAnswer(row, col, answer, isAcross) {
            for (let i = 0; i < answer.length; i++) {
                if (isAcross) {
                    grid[row][col + i] = answer[i];
                } else {
                    grid[row + i][col] = answer[i];
                }
            }
        }

        for (const key in puzzle.across) {
            const clue = puzzle.across[key];
            placeAnswer(clue.row, clue.col, clue.answer, true);
        }

        for (const key in puzzle.down) {
            const clue = puzzle.down[key];
            placeAnswer(clue.row, clue.col, clue.answer, false);
        }

        console.log(`Dimensions: ${JSON.stringify(grid)}`)
        return grid;
    }, [puzzle])
    const blankGrid = useMemo(() => {
        let newArray = [];
        for (let i = 0; i < completedGrid.length; i++) {
            let newRow = [];
            for (let j = 0; j < completedGrid[i].length; j++) {
                if (completedGrid[i][j] !== '#') {
                    newRow.push('');
                } else {
                    newRow.push(completedGrid[i][j]);
                }
            }
            newArray.push(newRow);
        }
        return newArray;
    }, [completedGrid])
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
            return x == activeCell.x
        } else {
            return y == activeCell.y
        }
    }, [orientation, activeCell])

    useEffect(() => {
        const savedProgress = getGridProgress(puzzleId) ?? blankGrid
        setGuessGrid(savedProgress)
    }, [completedGrid])

    const keyPressedHandler = useCallback((key) => {
        let xSize = guessGrid[0].length
        let ySize = guessGrid.length
        if (key === 'Backspace') {
            if (guessGrid[activeCell.y][activeCell.x] == '') {
                if (activeCell.x == 0 && activeCell.y == 0) return;
                if (orientation == 'vertical') {
                    if (activeCell.x == 0) {
                        setActiveCell({ x: xSize - 1, y: activeCell.y - 1 })
                    } else {
                        setActiveCell({ x: activeCell.x - 1, y: activeCell.y })
                    }
                } else {
                    if (activeCell.y == 0) {
                        setActiveCell({ x: activeCell.x - 1, y: ySize - 1 })
                    } else {
                        setActiveCell({ x: activeCell.x, y: activeCell.y - 1 })
                    }
                }
            } else {
                setGuessGrid(oldGrid => {
                    const newGrid = [...oldGrid]
                    newGrid[activeCell.y][activeCell.x] = ''
                    return newGrid
                })
            }
        } else if (key.length == 1 && ((key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z'))) {
            setActiveCell((oldCell) => {
                let x = oldCell.x
                let y = oldCell.y
                while (guessGrid[y][x] != '') {
                    if (orientation == 'vertical') {
                        x = (x + 1) % xSize
                        if (x == 0) {
                            y = (y + 1) % ySize
                        }
                    } else {
                        y = (y + 1) % xSize
                        if (y == 0) {
                            x = (x + 1) % xSize
                        }
                    }
                    if (x == oldCell.x && y == oldCell.y) {
                        return oldCell
                    }
                }
                return { x: x, y: y }
            })
            setGuessGrid(oldGrid => {
                const newGrid = [...oldGrid]
                newGrid[activeCell.y][activeCell.x] = key
                return newGrid
            })
        }
    }, [activeCell, guessGrid, orientation])

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
                                onClick={createCellCallback(x, y)}
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