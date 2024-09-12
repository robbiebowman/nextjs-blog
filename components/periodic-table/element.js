import React from 'react';
import styles from './element.module.css';

const Element = ({ atomicNumber, symbol, fullName, hexColor, customValue }) => {
  return (
    <div className={styles.element} style={{ backgroundColor: hexColor }}>
      <div className={styles.atomicNumber}>{atomicNumber}</div>
      <div className={styles.symbol}>{symbol}</div>
    </div>
  );
};

export default Element;
