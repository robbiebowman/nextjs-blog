import { act, useCallback, useEffect, useState, useMemo } from 'react'
import styles from './crossword.module.css'
import Cell from './cell/cell';
import Clues from './clues';
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

    const clueNumberCoordinateLookup = useMemo(() => {
        const lookup = {};

        const processClues = (clueSet) => {
            Object.entries(clueSet || {}).forEach(([number, { x, y }]) => {
                if (!lookup[y]) lookup[y] = {};
                if (!lookup[y][x]) lookup[y][x] = parseInt(number, 10);
            });
        };
        processClues(clues.across);
        processClues(clues.down);

        return lookup;
    }, [clues])



    const [guessGrid, setGuessGrid] = useState([
        ['l', 'o', 'a', '', ''],
        ['', '', 'd', 'i', ''],
        ['', '', '#', 'n', ''],
        ['', '.', '.', 'g', ''],
        ['', '.', '', '#', '']
    ]);
    const [orientation, setOrientation] = useState('horizontal')
    const [activeCell, setActiveCell] = useState({ x: 0, y: 0 })

    const activeClue = useMemo(() => {
        let newActiveClue;
        if (orientation == 'horizontal') {
            Object.entries(clues.across).forEach(([number, { x, y }]) => {
                if (y == activeCell.y) {
                    console.log(`mnatch`)
                    newActiveClue = { number, direction: 'across' }
                }
            })
        } else if (orientation == 'vertical') {
            Object.entries(clues.down).forEach(([number, { x, y }]) => {
                if (x == activeCell.x) {
                    console.log(`mnatch`)
                    newActiveClue = { number, direction: 'down' }
                }
            })
        }
        return newActiveClue

    }, [activeCell, orientation, clues]);

    const onClueClicked = useCallback((number, acrossOrDown) => {
        const newOrientation = acrossOrDown == 'across' ? 'horizontal' : 'vertical'
        setOrientation(newOrientation)
        const { x, y } = clues[acrossOrDown][number]
        if (guessGrid[y][x] === '') {
            setActiveCell({ x: x, y: y })
        } else {
            const dx = newOrientation === 'horizontal' ? 1 : 0;
            const dy = newOrientation === 'horizontal' ? 0 : 1;
            const newCoordinate = findNextCell(x, y, dx, dy, true, false)
            setActiveCell(newCoordinate)
        }
    }, [clues, guessGrid])

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
    }, [puzzleId])

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

    const keyPressedHandler = useCallback((key) => {
        if (key === 'Backspace') {
            handleBackspace();
        } else if (key.length === 1 && key.match(/[a-zA-Z]/)) {
            handleLetterInput(key.toLowerCase());
        } else if (key.startsWith("Arrow")) {
            handleArrowKey(key);
        }
    }, [handleBackspace, handleLetterInput, handleArrowKey]);

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

    console.log(`activeClue: ${JSON.stringify(activeClue)}`)

    return (
        <div className={styles.box}>
            <div className={styles.crosswordBox}>
                {
                    guessGrid.map(row => {
                        y++
                        let x = -1
                        return <div key={`${y}-row`} className={styles.crosswordRow}>
                            {row.map((char) => {
                                x++
                                return <Cell
                                    key={`${x}-${y}`}
                                    letter={char}
                                    onClick={char == '#' ? null : createCellCallback(x, y)}
                                    isActiveCell={activeCell.x == x && activeCell.y == y}
                                    isHighlightedRow={isHighlightedRow(x, y)}
                                    number={clueNumberCoordinateLookup[y]?.[x]}
                                />
                            })}
                        </div>
                    })
                }
            </div>
            <Clues clues={clues} onClueClick={onClueClicked} activeClue={activeClue} />
        </div>
    )
}