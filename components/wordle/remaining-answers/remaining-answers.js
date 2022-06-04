import styles from './remaining-answers.module.css'

export default function RemainingAnswers({ wordList, count }) {

  const listSize = 20;

  return (
    <div>
      <p>Remaining possibilities: {count}</p>
      <ul className={styles.answerList}>
        {
          wordList.map((w, i) => {
            return (<li style={{opacity: ((listSize - i) / 20)}}>{w}</li>)
          })
        }
      </ul>
    </div>
  )
}