import { act, useCallback, useEffect, useState, useMemo } from 'react'
import styles from './crossword.module.css'
import Cell from './cell/cell';

export default function Crossword({ data }) {

    const [clues, setClues] = useState(null)
    const [clueStartCoordinates] = useState([])
    const [grid, setGrid] = useState([
        ['l', 'o', 'a', '', ''],
        ['', '', 'd', 'i', ''],
        ['', '', ' ', 'n', ''],
        ['', '.', '.', 'g', ''],
        ['', '.', '', ' ', '']
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
        for (const key in data.across) {
            const clue = data.across[key];
            updateMax(clue.row, clue.col, clue.answer.length, true);
        }
        for (const key in data.down) {
            const clue = data.down[key];
            updateMax(clue.row, clue.col, clue.answer.length, false);
        }

        return {
            rows: maxRow + 1,
            cols: maxCol + 1
        };
    }, [data])
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
    
        for (const key in data.across) {
            const clue = data.across[key];
            placeAnswer(clue.row, clue.col, clue.answer, true);
        }
    
        for (const key in data.down) {
            const clue = data.down[key];
            placeAnswer(clue.row, clue.col, clue.answer, false);
        }
    
        console.log(`Dimensions: ${JSON.stringify(grid)}`)
        return grid;
    }, [data])
    const clueCoordinates = useMemo(() => {
        
        return data.across
    }, [data])
    const createCellCallback = useCallback((x, y) => {
        return () => {
            console.log(`Clicked on x:${x} y:${y}`)
            if (x == activeCell.x && y == activeCell.y) {
                setOrientation(orientation == 'horizontal' ? 'vertical' : 'horizontal');
            }
            setActiveCell({ x: x, y: y })
        }
    }, [grid, orientation, activeCell])

    const isHighlightedRow = useCallback((x, y) => {
        if (orientation == 'horizontal') {
            return x == activeCell.x
        } else {
            return y == activeCell.y
        }
    }, [orientation, activeCell]);


    let x = -1

    return (
        <div className={styles.box}>
            {
                grid ? grid.map(row => {
                    x++
                    let y = -1
                    return <div className={styles.crosswordRow}>
                        {row.map((char) => {
                            y++
                            return <Cell
                                letter={char}
                                onClick={createCellCallback(x, y)}
                                isActiveCell={activeCell.x == x && activeCell.y == y}
                                isHighlightedRow={isHighlightedRow(x, y)}
                            />
                        })}
                    </div>
                })
                    : ""}
        </div>
    )
}