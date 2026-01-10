import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { formatDate } from '../../lib/date-funcs'
import Layout from '../../components/layout'
import styles from './index.module.css'


export default function Home() {
    const router = useRouter()

    const localDate = formatDate(new Date())

    useEffect(() => {
        router.prefetch(`/alternate-reality-movies/${localDate}`)
        router.push(`/alternate-reality-movies/${localDate}`)
    }, [])

    return (
        <Layout>
            <div className={styles.mainBox}>
                <h1>Alternate Reality Movie of the Day</h1>
                <p className={styles.blurbText}>Loading today&apos;s puzzle...</p>
            </div>
        </Layout>
    )
}
