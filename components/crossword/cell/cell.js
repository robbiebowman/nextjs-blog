import React, { useRef, useEffect } from 'react';
import styles from './cell.module.css'

export default function Cell({ letter, onClick, isHighlightedRow, isActiveCell, number }) {

  const inputRef = useRef(null);

  useEffect(() => {
    if (isActiveCell && inputRef.current) {
      console.log('Active cell activated')
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      inputRef.current.focus();
    }
  }, [isActiveCell]);

  const boxStyle = styles.cellBox + " " + (
    letter == '#' ? `${styles.blackBox}` :
      isActiveCell ? styles.activeBox :
        isHighlightedRow ? styles.highlightedBox : ""
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={boxStyle} style={{ aspectRatio: 1 }} onClick={handleClick}>
      <input
        className={styles.mobileInput}
        ref={inputRef}
        type="text"
        maxLength="1"
        readOnly={true}
        inputMode="none"
      />
      <div className={styles.number}>{number ?? ""}</div>
      <div className={styles.innerLetter}>{letter.toLowerCase()}</div>
    </div>
  )
}