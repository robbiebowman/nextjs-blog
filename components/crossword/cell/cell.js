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
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isActiveCell]);

  const handleInput = (e) => {
    e.preventDefault();
  };

  return (
    <div className={boxStyle} style={{ aspectRatio: 1 }} onClick={onClick}>
      {number && <div className={styles.number}>{number}</div>}
      <input
        className={styles.mobileInput}
        ref={inputRef}
        type="text"
        inputMode="none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        maxLength="1"
        value={letter || ''}
        onChange={handleInput}
        onInput={handleInput}
      />
      <div className={styles.innerLetter}>{letter.toLowerCase()}</div>
    </div>
  )
}