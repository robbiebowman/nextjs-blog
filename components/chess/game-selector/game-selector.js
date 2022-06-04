import Link from 'next/link'
import styles from './game-selector.module.css'

function GameSelector({ tabs, selectedTitle }) {

    return (<div className={styles.gametypeBox}>
        {tabs.map((t, i) => {
            return <span key={i} className={selectedTitle == t.title ? styles.selectedTab : styles.unselectedTab}>
                <Link href={t.link}>{t.title}</Link>
            </span>
        })}</div>)

    // <div className={styles.gametypeBox}>
    //     <span className={selectedTab == "Practice" ? styles.selectedTab : styles.unselectedTab}>
    //         <Link href="/chess">Practice</Link>
    //     </span>
    //     <span className={selectedTab == "Daily" ? styles.selectedTab : styles.unselectedTab}>
    //         <Link href="/chess/daily">Daily</Link>
    //     </span>
    //     <span className={selectedTab == "Storm" ? styles.selectedTab : styles.unselectedTab}>
    //         <Link href="/chess/storm">Storm</Link>
    //     </span>
    // </div>

}

export function ChessGameSelector({
    selectedTitle
}) {
    return GameSelector({
        tabs: [{ title: "Practice", link: "/chess" }, { title: "Daily", link: "/chess/daily" }, { title: "Storm", link: "/chess/storm" }],
        selectedTitle
    })
}

export function WordleGameSelector({
    selectedTitle
}) {
    return GameSelector({
        tabs: [{ title: "Solver", link: "/wordle" }],
        selectedTitle
    })
}
