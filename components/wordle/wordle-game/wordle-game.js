import React, { useEffect, useState, useRef } from 'react';
import useSWR from 'swr';
import HardModeToggle from '../hard-mode-toggle/hard-mode-toggle';
import Letter from "../letter/letter";
import RemainingAnswers from '../remaining-answers/remaining-answers';
import styles from './wordle-game.module.css';

export default function WordleGame() {

  const [hardMode, setHardMode] = useState(false)
  const [shouldFetch, setShouldFetch] = useState(true)
  const [complete, setComplete] = useState(false)
  const [result, setResult] = useState(['b', 'b', 'b', 'b', 'b'])
  const [oldAnswers, setOldAnswers] = useState([])
  const [oldResults, setOldResults] = useState([])
  const [bestGuess, setBestGuess] = useState("")
  const [currentGuess, _setCurrentGuess] = useState("")
  const currentGuessRef = useRef(currentGuess)
  const setCurrentGuess = (guess) => {
    currentGuessRef.current = guess
    _setCurrentGuess(guess)
  }
  const [remainingAnswerCount, setRemainingAnswerCount] = useState(0)
  const [someRemainingAnswers, setSomeRemainingAnswers] = useState([])
  const [errors, setErrors] = useState(null)

  const fetcher = (...args) => fetch(...args).then(res => res.json());

  const { data, mutate } = useSWR(() => shouldFetch ? `/api/wordle?guesses=${oldAnswers}&results=${oldResults}&hardMode=${hardMode}` : null, fetcher, {
    onSuccess: (data, key, config) => {
      setShouldFetch(false)
      setErrors(false)
      setRemainingAnswerCount(data.remainingAnswerCount)
      setSomeRemainingAnswers(data.someRemainingAnswers)
      setBestGuess(data.bestGuess)
      setCurrentGuess(data.bestGuess)
      if (data.remainingAnswerCount == 1) {
        setComplete(true)
      }
    },
    onError: (err, key, config) => {
      setShouldFetch(false)
      setErrors(true)
      setRemainingAnswerCount(0)
      setSomeRemainingAnswers([])
      setBestGuess("")
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
    setResult(newResult)
  }

  const submit = () => {
    setBestGuess("")
    setCurrentGuess("")
    const submittedResult = result.join('')
    if (submittedResult == 'ggggg') setComplete(true)
    const answers = [...oldAnswers, currentGuess]
    const res = [...oldResults, submittedResult]
    setOldAnswers(answers)
    setOldResults(res)
    setResult(['b', 'b', 'b', 'b', 'b'])
    setShouldFetch(true)
  }

  const reset = () => {
    setShouldFetch(true)
    setOldAnswers([])
    setOldResults([])
    setComplete(false)
    setErrors(false)
    setResult(['b', 'b', 'b', 'b', 'b'])
  }

  const eraseGuess = () => {
    console.log(`erasing guess`)
    setCurrentGuess("")
  }

  const isAlphabetic = (c) => {
    return c.length == 1 && c.match(/[a-zA-Z]{1}/)
  }

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (isAlphabetic(e.key)) {
        inputGuessChar(e.key)
      }
      if (e.key == "Enter") {
        // Enter submits the form, triggering the Reset button
        e.preventDefault();
      }
      if (e.key == "Backspace") {
        if (currentGuessRef.current.length > 0) {
          setCurrentGuess(currentGuessRef.current.slice(0, -1))
        }
      }
    })
  }, [])

  const inputGuessChar = (c) => {
    if (currentGuessRef.current.length < 5) {
      setCurrentGuess(currentGuessRef.current + c)
    }
  }

  return (<div>
    <div className={styles.doublePanel}>
      <div>
        <div>
          <HardModeToggle disabled={oldAnswers.length != 0} hardModeOn={hardMode} onToggled={() => setHardMode((h) => !h)} />
        </div>
        {
          oldAnswers.map((a, i) => {
            return (
              <div key={i} className={styles.letterBox}>
                {[...a].map((ans, j) => <Letter key={j} letter={ans} result={oldResults[i][j]} />)}
              </div>
            )
          })
        }
        {complete && bestGuess !== oldAnswers[oldAnswers.length] ? (<div className={styles.letterBox}>
          {[...bestGuess].map((l, i) => <Letter key={i + l} letter={l} result='g' />)}
        </div>) : <></>}
        {/* Input/current guess */}
        {complete || errors
          ? <></>
          : <div className={styles.letterBox}>
            {result.map((r, i) => <Letter key={i} letter={(currentGuess)[i]} onClick={() => toggleLetter(i)} result={r} />)}
            <div><button
              className="btn btn-secondary btn-sm"
              onClick={() => eraseGuess()}>X</button></div>
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
        <p style={{ opacity: complete ? 0 : 1, transition: 'all 500ms linear' }}>Try: {bestGuess}</p>
        <RemainingAnswers count={remainingAnswerCount} wordList={someRemainingAnswers} />
      </div>
    </div>
  </div>
  )
}