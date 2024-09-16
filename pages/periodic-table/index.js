import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import Link from 'next/link'
import styles from './index.module.css'
import AnswerValue from '../../components/periodic-table/answer-value'

export default function PeriodicTable() {

    const [entries, setEntries] = useState([])

    useEffect(() => {
        fetch(`/api/periodic-table-index`).then(res => res.json()).then(data => setEntries(data.entries))
    }, [])

    return (
        <Layout>
            <Head>
                <title>Periodic Table</title>
            </Head>
            <div className={styles.indexContainer}>
                <h1 className={styles.indexTitle}>Maps of the Periodic Table of the Elements</h1>
                <ul className={styles.indexList}>
                    {entries.map(entry => (
                        <li key={entry.id}>
                            <Link href={`/periodic-table/${entry.id}`}>
                                <span className={styles.indexEntry}>{entry.query}</span>
                                <span className={styles.indexType} style={{ backgroundColor: entry.type === 'Category' ? '#FFA500' : entry.type === 'Range' ? '#6895a3' : '#733c58' }}>{entry.type}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    )
}