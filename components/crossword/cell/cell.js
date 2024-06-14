import styles from './cell.module.css'

export default function Cell({ letter, onClick, isHighlightedRow, isActiveCell }) {

  const boxStyle = styles.cellBox + " " + (
    letter == ' ' ? `${styles.blackBox}` :
     isActiveCell ? styles.activeBox :
     isHighlightedRow ? styles.highlightedBox : 
     isHighlightedRow? `${styles.cellBox}`: ""
  );
  
  return (
    <div className={boxStyle} style={{ aspectRatio: 1 }} onClick={onClick}>
      <span className={styles.innerLetter}>{letter?.toUpperCase()}</span>
    </div>
  )
}