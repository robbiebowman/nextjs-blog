import Link from 'next/link'
import styles from './game-selector.module.css'

export default function GameSelector({ selectedTab }) {

    return (
        <div className={styles.gametypeBox}>
            <span className={selectedTab == "Practice" ? styles.selectedTab : styles.unselectedTab}>
                <Link href="/chess">Practice</Link>
            </span>
            <span className={selectedTab == "Daily" ? styles.selectedTab : styles.unselectedTab}>
                <Link href="/chess/daily">Daily</Link>
            </span>
            <span className={selectedTab == "Storm" ? styles.selectedTab : styles.unselectedTab}>
                <Link href="/chess/storm">Storm</Link>
            </span>
        </div>
    )
}