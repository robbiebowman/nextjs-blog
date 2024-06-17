import styles from './cell.module.css'

export default function Cell({ letter, onClick, isHighlightedRow, isActiveCell, number }) {

  const boxStyle = styles.cellBox + " " + (
    letter == '#' ? `${styles.blackBox}` :
      isActiveCell ? styles.activeBox :
        isHighlightedRow ? styles.highlightedBox : ""
  );

  return (
    <div className={boxStyle} style={{ aspectRatio: 1 }} onClick={onClick}>
      <div className={styles.number}>{number ?? ""}</div>
      <div className={styles.innerLetter}>{letter?.toUpperCase()}</div>
    </div>
  )
}