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
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      inputRef.current.focus();
    }
  }, [isActiveCell]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleInput = (e) => {
    e.preventDefault();
  };

  return (
    <div className={boxStyle} style={{ aspectRatio: 1 }} onClick={handleClick}>
      {number && <div className={styles.number}>{number}</div>}
      <input
        className={styles.mobileInput}
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        data-quicktypes="off"
        maxLength="1"
        value={letter || ''}
        onChange={handleInput}
        onInput={handleInput}
      />
      <div className={styles.innerLetter}>{letter.toLowerCase()}</div>
    </div>
  )
}