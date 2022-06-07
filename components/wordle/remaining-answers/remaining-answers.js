import styles from './remaining-answers.module.css'

export default function RemainingAnswers({ wordList, count }) {

  const listSize = 20;
  const allShowing = count <= 20;

  return (
    <div className={styles.container} style={allShowing ? null : { borderBottom: "0"}}>
      <p className={styles.title}><span className={styles.count}>{count} remaining</span></p>
      <ul className={styles.answerList}>
        {
          wordList.map((w, i) => {
            return (<li key={i} style={{opacity: (allShowing ? 1 : (listSize - i) / 20)}}>{w}</li>)
          })
        }
      </ul>
    </div>
  )
}