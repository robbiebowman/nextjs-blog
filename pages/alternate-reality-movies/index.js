import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { formatDate } from '../../lib/date-funcs'


export default function Home() {
    const router = useRouter()

    const localDate = formatDate(new Date())

    useEffect(() => {
        router.prefetch(`/alternate-reality-movies/${localDate}`)
        router.push(`/alternate-reality-movies/${localDate}`)
    }, [])

    return null
}