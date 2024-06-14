import { act, useCallback, useEffect, useState } from 'react'
import styles from './crossword.module.css'
import Cell from './cell/cell';

export default function Crossword({ data }) {

    const [grid, setGrid] = useState([
        ['l', 'o', 'a', '', ''],
        ['', '', 'd', 'i', ''],
        ['', '', ' ', 'n', ''],
        ['', '.', '.', 'g', ''],
        ['', '.', '', ' ', '']
    ]);
    const [orientation, setOrientation] = useState('horizontal')
    const [activeCell, setActiveCell] = useState({ x: 0, y: 0 })

    const createCellCallback = useCallback((x, y) => {
        return () => {
            console.log(`Clicked on x:${x} y:${y}`)
            if (x == activeCell.x && y == activeCell.y) {
                setOrientation(orientation == 'horizontal' ? 'vertical' : 'horizontal');
            }
            setActiveCell({ x: x, y: y })
        }
    }, [grid, orientation, activeCell])

    const isHighlightedRow = useCallback((x,y) => {
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
                    let y = 0
                    return <div className={styles.crosswordRow}>
                        {row.map((char) => {
                            y++
                            return <Cell
                                letter={char}
                                onClick={createCellCallback(x, y)}
                                isActiveCell={activeCell.x == x && activeCell.y == y}
                                isHighlightedRow={isHighlightedRow(x,y)}
                            />
                        })}
                    </div>
                })
                    : ""}
        </div>
    )
}