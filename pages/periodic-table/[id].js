import Head from "next/head";
import React, { useState } from 'react';
import { useRouter } from 'next/router'
import styles from './index.module.css';
import useSWR from 'swr';
import Layout from "../../components/layout";

export default function CustomPeriodicTable() {

    const router = useRouter()
    const { id } = router.query

    const [rawPeriodicTableData, setRawPeriodicTableData] = useState(null)

    const [rangeMin, setRangeMin] = useState(null)
    const [rangeMax, setRangeMax] = useState(null)
    const [categories, setCategories] = useState([])
    const [query, setQuery] = useState(null)
    const [elementDescriptions, setElementDescriptions] = useState([])

    const fetcher = (...args) => fetch(...args).then(res => res.json());
    useSWR(() => `/api/periodic-table?id=${id}`, fetcher, {
        onSuccess: (data, key, config) => {
            if (JSON.stringify(data) != JSON.stringify(rawPeriodicTableData)) {
                setRawPeriodicTableData(data)
                setRangeMin(data.rangeMin)
                setRangeMax(data.rangeMax)
                setCategories(data.categories)
                setQuery(data.query)
                setElementDescriptions(data.description.elementDescriptions)
            }
        },
        onError: (err, key, config) => {
            setRawPeriodicTableData(null)
        }
    })
    return (
        <Layout>
            <Head>
                <title>Periodic Table - {query}</title>
            </Head>
            <div>
                <h1>{query}</h1>
                {
                    elementDescriptions.map((element) => {
                        return (
                            <div key={element.id}>
                                <h2>{element.elementName}</h2>
                                <p>{element.answerValue}</p>
                                <p>{element.justification}</p>
                            </div>
                        )
                    })
                }
            </div>
        </Layout>
    )

}