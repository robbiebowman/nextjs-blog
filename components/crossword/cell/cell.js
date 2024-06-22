import React, { useRef, useEffect } from 'react';
import styles from './cell.module.css'

export default function Cell({ letter, onClick, isHighlightedRow, isActiveCell, number }) {

  const boxStyle = styles.cellBox + " " + (
    letter == '#' ? `${styles.blackBox}` :
      isActiveCell ? styles.activeBox :
        isHighlightedRow ? styles.highlightedBox : ""
  );

  const inputRef = useRef(null);

  useEffect(() => {
    if (isActiveCell && inputRef.current) {
      inputRef.current.focus();
      // Try to force the keyboard to open
      inputRef.current.click();
    }
  }, [isActiveCell]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleInput = (e) => {
    e.preventDefault();
    const input = e.target.value;
    if (input && onInput) {
      onInput(input[input.length - 1].toUpperCase());
    }
  };

  return (
    <div className={boxStyle} style={{ aspectRatio: 1 }} onClick={handleClick}>
      <div className={styles.number}>{number ?? ""}</div>
      <div className={styles.innerLetter}>{letter.toLowerCase()}</div>
      <input
        className={styles.mobileInput}
        ref={inputRef}
        type="text"
        maxLength="1"
        readOnly={true}
        inputMode="text"
      />
    </div>
  )
}