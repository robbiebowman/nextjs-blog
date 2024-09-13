import React from 'react';
import Element from './element';
import styles from './table.module.css';
import { getPosition, getElementColor, symbolLookup } from '../../lib/periodic-table';

const PeriodicTable = ({ query, rangeMin, rangeMax, categories, elements, onSelect }) => {
    
    return (
        <div className={styles.periodicTable}>
            {elements.map((element) => {
                const position = getPosition(element.atomicNumber);
                const color = getElementColor(categories, rangeMin, rangeMax, element.answerValue);
                return (
                    <div
                        key={element.atomicNumber}
                        style={{
                            gridRow: position.row,
                            gridColumn: position.col,
                        }}
                    >
                        <Element
                            atomicNumber={element.atomicNumber}
                            symbol={symbolLookup[element.atomicNumber] || element.symbol}
                            hexColor={color}
                            onClick={() => onSelect(element)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default PeriodicTable;
