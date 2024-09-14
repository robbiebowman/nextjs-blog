import Head from "next/head";
import React, { useState } from 'react';
import { useRouter } from 'next/router'
import styles from './index.module.css';
import useSWR from 'swr';
import Layout from "../../components/layout";
import PeriodicTable from "../../components/periodic-table/table";
import Element from "../../components/periodic-table/element";
import { symbolLookup, getElementColor, getContrastColor } from "../../lib/periodic-table";
import AnswerValue from "../../components/periodic-table/answer-value";
export default function CustomPeriodicTable() {

    const router = useRouter()
    const { id } = router.query

    const [rawPeriodicTableData, setRawPeriodicTableData] = useState(null)

    const [rangeMin, setRangeMin] = useState(null)
    const [rangeMax, setRangeMax] = useState(null)
    const [categories, setCategories] = useState([])
    const [query, setQuery] = useState(null)
    const [elementDescriptions, setElementDescriptions] = useState([])
    const [selectedElement, setSelectedElement] = useState(null)

    const fetcher = (...args) => fetch(...args).then(res => res.json());
    useSWR(() => `/api/periodic-table?id=${id}`, fetcher, {
        onSuccess: (data, key, config) => {
            if (JSON.stringify(data) != JSON.stringify(rawPeriodicTableData)) {
                setRawPeriodicTableData(data)
                setRangeMin(data.definition.rangeMin)
                setRangeMax(data.definition.rangeMax)
                setCategories(data.definition.categories)
                setQuery(data.definition.query)
                setElementDescriptions(data.description.elementDescriptions)
            }
        },
        onError: (err, key, config) => {
            setRawPeriodicTableData(null)
        }
    })

    console.log(JSON.stringify(selectedElement))

    return (
        <Layout maxWidth="68rem">
            <Head>
                <title>Periodic Table - {query}</title>
            </Head>
            <div className={styles.periodicTableContainer}>
                <div className={styles.infoContainer}>
                    <div className={styles.selectedElementContainer + " " + styles.section}>
                        <Element
                            atomicNumber={selectedElement?.atomicNumber || 0}
                            symbol={symbolLookup[selectedElement?.atomicNumber] || ""}
                            hexColor={getElementColor(categories, rangeMin, rangeMax, selectedElement?.answerValue)}
                        />
                        <div className={styles.selectedElementBox}>
                            <h2>{selectedElement?.elementName ? selectedElement.elementName.charAt(0).toUpperCase() + selectedElement.elementName.slice(1).toLowerCase() : 'Click an element'}</h2>
                            <AnswerValue
                                text={selectedElement?.answerValue || "Value"}
                                backgroundColor={getElementColor(categories, rangeMin, rangeMax, selectedElement?.answerValue)}
                            />
                            <p className={styles.selectedElementJustification}>
                                {selectedElement?.justification || "Click an element to see more information"}
                            </p>
                        </div>
                    </div>
                    <div className={styles.legendContainer + " " + styles.section}>
                        <h2>Legend</h2>
                        <div className={styles.legend}>
                            {categories && categories.map((category, index) => (
                                <AnswerValue
                                    text={category.name}
                                    backgroundColor={getElementColor(categories, rangeMin, rangeMax, category.name)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <h1 className={styles.periodicTableTitle}>{query}</h1>
                <div className={styles.section}>
                    <PeriodicTable
                        query={query}
                    rangeMin={rangeMin}
                    rangeMax={rangeMax}
                    categories={categories}
                    elements={elementDescriptions}
                    onSelect={setSelectedElement}
                    />
                </div>
            </div>
        </Layout>
    )

}