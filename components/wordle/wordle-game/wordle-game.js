import styles from './wordle-game.module.css'
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
      if (data.error) {
        setErrors(true)
        setRemainingAnswerCount(0)
        setSomeRemainingAnswers([])
        setBestGuess("")
      } else {
        setErrors(false)
        setRemainingAnswerCount(data.remainingAnswerCount)
        setSomeRemainingAnswers(data.someRemainingAnswers)
        setBestGuess(data.bestGuess)
        if (data.remainingAnswerCount == 1) {
          setComplete(true)
        }
      }
    }
  })

  useEffect(() => {
    if (oldAnswers && !complete) {
      mutate()
    }
  }, [oldAnswers])

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
    setErrors(false)
    setResult(['b', 'b', 'b', 'b', 'b'])
  }

  return (<div>
    <div className={styles.doublePanel}>
      <div>
        <p style={{ opacity: complete ? 0 : 1, transition: 'all 500ms linear' }}>Try: {bestGuess}</p>
        {
          oldAnswers.map((a, i) => {
            return (
              <div key={i} className={styles.letterBox}>
                {[...a].map((ans, j) => <Letter key={j} letter={ans} result={oldResults[i][j]} />)}
              </div>
            )
          })
        }
        {complete ? (<div className={styles.letterBox}>
                {[...bestGuess].map((l, i) => <Letter key={i + l} letter={l} result='g' />)}
        </div>) : <></>}
        {complete || errors
          ? <></>
          : <div className={styles.letterBox}>
            {result.map((r, i) => <Letter key={i} letter={(bestGuess)[i]} onClick={() => toggleLetter(i)} result={r} />)}
          </div>}
        <div className={styles.buttonBox}>
          {errors
            ? <div className={styles.errorBox}>
              <p>I can't find a word in my vocabulary to fit what you've input. Want to try again?</p>
              <button type="button"
                className="btn btn-secondary"
                onClick={() => reset()}>Reset</button>
            </div>
            : <><button type="button"
              className="btn btn-success"
              disabled={complete || errors}
              onClick={() => submit()}>Next</button>
              <button type="button"
                className="btn btn-secondary"
                onClick={() => reset()}>Reset</button></>
          }
        </div>
      </div>
      <div>
        <RemainingAnswers count={remainingAnswerCount} wordList={someRemainingAnswers} />
      </div>
    </div>
  </div>
  )
}