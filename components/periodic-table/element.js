import React from 'react';
import styles from './element.module.css';
import { getContrastColor } from '../../lib/periodic-table';
const Element = ({ atomicNumber, symbol, hexColor, onClick }) => {

  const textColor = getContrastColor(hexColor);

  return (
    <div className={styles.element} style={{ backgroundColor: hexColor }} onClick={onClick}>
      <div className={styles.atomicNumber} style={{ color: textColor }}>{atomicNumber}</div>
      <div className={styles.symbol} style={{ color: textColor }}>{symbol}</div>
    </div>
  );
};

export default Element;
