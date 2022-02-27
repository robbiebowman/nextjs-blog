import styles from './letter.module.css'

export default function Letter({letter, result}) {
    
    return (
        <span className={result == 'y' ? styles.yBox : result == 'g' ? styles.gBox : styles.bBox}>{letter}</span>
        )
}