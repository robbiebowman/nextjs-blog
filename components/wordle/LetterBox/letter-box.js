import styles from './letter-box.module.css'
import Head from "next/head";
import useSWR from 'swr';
import React, { useState, useEffect } from 'react';
import Letter from "../letter/letter"
import RemainingAnswers from '../remaining-answers/remaining-answers';

export default function WordleGame() {

  const [hardMode, setHardMode] = useState(false)
  const [complete, setComplete] = useState(false)
  const [result, setResult] = useState(['b', 'b', 'b', 'b', 'b'])
  const [oldAnswers, setOldAnswers] = useState([])
  const [oldResults, setOldResults] = useState([])
  const [bestGuess, setBestGuess] = useState("")
  const [remainingAnswerCount, setRemainingAnswerCount] = useState(0)
  const [someRemainingAnswers, setSomeRemainingAnswers] = useState([])
  const [errors, setErrors] = useState(null)

  const fetcher = (...args) => fetch(...args).then(res => res.json());

  const { data, mutate } = useSWR(() => `/api/wordle?guesses=${oldAnswers}&results=${oldResults}&hardMode=${hardMode}`, fetcher, {
    onSuccess: (data, key, config) => {
      setBestGuess(data.bestGuess)
      setRemainingAnswerCount(data.remainingAnswerCount)
      setSomeRemainingAnswers(data.someRemainingAnswers ?? [])
      setErrors(errors)
    }})


  console.log(`Response: ${JSON.stringify(data)}`)

  const error = data?.status == 500
  console.log(`error: ${error}`)

  useEffect(() => {
    if (oldAnswers && !complete) {
      mutate()
    }
  }, [oldAnswers])
 
  const [one, two, three, four, five] = data && data.bestGuess || "     "

  const toggleLetter = (index) => {
    const existingAnswer = result[index]
    const newResult = [...result]
    newResult[index] = existingAnswer == 'b' ? 'y' : existingAnswer == 'y' ? 'g' : 'b'
    console.log(`newResult: ${newResult}`)
    setResult(newResult)
  }

  const submit = () => {
    const submittedResult = result.join('')
    if (submittedResult == 'ggggg') setComplete(true)
    const answers = [...oldAnswers, data.bestGuess]
    const res = [...oldResults, submittedResult]
    setOldAnswers(answers)
    setOldResults(res)
    setResult(['b', 'b', 'b', 'b', 'b'])
  }

  const reset = () => {
    setOldAnswers([])
    setOldResults([])
    setComplete(false)
    setResult(['b', 'b', 'b', 'b', 'b'])
  }

  return (<div>
    <div className={styles.doublePanel}>
      <div>
      <p style={{opacity:complete ? 0 : 1, transition: 'all 500ms linear'}}>Try: {error ? error : bestGuess}</p>
        {
          oldAnswers.map((a, i) => {
            console.log(`a is ${a}`)
            return (
              <div className={styles.letterBox}>
                <Letter letter={a[0]} result={oldResults[i][0]} />
                <Letter letter={a[1]} result={oldResults[i][1]} />
                <Letter letter={a[2]} result={oldResults[i][2]} />
                <Letter letter={a[3]} result={oldResults[i][3]} />
                <Letter letter={a[4]} result={oldResults[i][4]} />
              </div>
            )
          })
        }
        {complete || error
          ? <></>
          : <div className={styles.letterBox}>
            <Letter letter={one} onClick={() => toggleLetter(0)} result={result[0]} />
            <Letter letter={two} onClick={() => toggleLetter(1)} result={result[1]} />
            <Letter letter={three} onClick={() => toggleLetter(2)} result={result[2]} />
            <Letter letter={four} onClick={() => toggleLetter(3)} result={result[3]} />
            <Letter letter={five} onClick={() => toggleLetter(4)} result={result[4]} />
          </div>}
        <div className={styles.buttonBox}>
          <button type="button"
            className="btn btn-success"
            disabled={complete || error}
            onClick={() => submit()}>Next</button>
          <button type="button"
            className="btn btn-secondary"
            onClick={() => reset()}>Reset</button>
        </div>
      </div>
      <div>
        <RemainingAnswers count={remainingAnswerCount} wordList={someRemainingAnswers} />
      </div>
    </div>
  </div>
  )
}