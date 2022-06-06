import styles from './remaining-answers.module.css'

export default function RemainingAnswers({ wordList, count }) {

  const listSize = 20;

  return (
    <div className={styles.container}>
      <p className={styles.title}>Remaining possibilities: <span className={styles.count}>{count}</span></p>
      <ul className={styles.answerList}>
        {
          wordList.map((w, i) => {
            return (<li key={i} style={{opacity: (count > 20 ? (listSize - i) / 20 : 1)}}>{w}</li>)
          })
        }
      </ul>
    </div>
  )
}