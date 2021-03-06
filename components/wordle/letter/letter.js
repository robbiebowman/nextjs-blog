import styles from './letter.module.css'

export default function Letter({letter, result, onClick}) {
    
    return (
        <div style={{ aspectRatio: 1 }} onClick={onClick} className={`${styles.box} ${result == 'y' ? styles.yBox : result == 'g' ? styles.gBox : styles.bBox}`}>
          <span className={styles.innerLetter}>{letter?.toUpperCase()}</span>
        </div>
        )
}