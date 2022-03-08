import styles from './chess.module.css'

export default function DailyStage({ stage }) {
    // stage = Easy, Medium, Hard

    return (
        <div className={styles.dailyStageBox}>
            <span className={stage == "Easy" ? styles.dailyStageActive : styles.dailyStageInactive}>☀️</span>
            <span className={stage == "Medium" ? styles.dailyStageActive : styles.dailyStageInactive}>☁️</span>
            <span className={stage == "Hard" ? styles.dailyStageActive : styles.dailyStageInactive}>⛈️</span>
        </div>
    )
}