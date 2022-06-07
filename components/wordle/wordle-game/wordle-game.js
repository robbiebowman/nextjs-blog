import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import useSWR from 'swr';
import HardModeToggle from '../hard-mode-toggle/hard-mode-toggle';
import Letter from "../letter/letter";
import RemainingAnswers from '../remaining-answers/remaining-answers';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import styles from './wordle-game.module.css';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { isMobile } from 'react-device-detect';

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
      if (e.key == "Enter") {
        // Enter submits the form, triggering the Reset button
        e.preventDefault();
      }
      handleInput(e.key)
    })
  }, [])

  const onScreenKeyPress = (key) => {
    var mappedKey = key
    if (key == "<<") {
      mappedKey = "Backspace"
    } else if (key == "{enter}") {
      mappedKey = "Enter"
    } else {
      mappedKey = key
    }
    handleInput(mappedKey)
  }

  const handleInput = (key) => {
    if (isAlphabetic(key)) {
      inputGuessChar(key)
    }
    if (key == "Backspace") {
      if (currentGuessRef.current.length > 0) {
        setCurrentGuess(currentGuessRef.current.slice(0, -1))
      }
    }
  }

  const inputGuessChar = (c) => {
    if (currentGuessRef.current.length < 5) {
      setCurrentGuess(currentGuessRef.current + c)
    }
  }

  return (<div>
    <div className={styles.doublePanel}>
      <div className={styles.leftColumn}>
        <div>
          <HardModeToggle disabled={oldAnswers.length != 0} hardModeOn={hardMode} onToggled={() => setHardMode((h) => !h)} />
        </div>
        {
          oldAnswers.map((a, i) => {
            return (
              <div key={i} className={styles.letterBox}>
                <div className={styles.xButtonBox} />
                {[...a].map((ans, j) => <Letter key={j} letter={ans} result={oldResults[i][j]} />)}
                <div className={styles.xButtonBox} />
              </div>
            )
          })
        }
        {complete && bestGuess != oldAnswers[oldAnswers.length - 1]
          ? (<>
            <div className={styles.letterBox}>
              <div className={styles.xButtonBox} />
              {[...bestGuess].map((l, i) => <Letter key={i + l} letter={l} result='g' />)}
              <div className={styles.xButtonBox} />
            </div></>)
          : <></>}
        {/* Input/current guess */}
        {complete || errors
          ? <></>
          : <div className={styles.letterBox}>
            <div className={styles.xButtonBox} />
            {result.map((r, i) => <Letter key={i} letter={(currentGuess)[i]} onClick={() => toggleLetter(i)} result={r} />)}
            <div className={styles.xButtonBox}>
              <span onClick={() => eraseGuess()}><FontAwesomeIcon icon={faClose} /> </span>
            </div>
          </div>}

        <div className={styles.buttonBox}>
          {errors
            ? <div className={`${styles.resultBox} ${styles.errorBox}`}>
              <p>I can't find a word in my vocabulary to fit what you've input. Want to try again?</p>
              <button type="button"
                className="btn btn-secondary"
                onClick={() => reset()}>Reset</button>
            </div>
            : complete
              ? <div className={`${styles.resultBox} ${styles.successBox}`}>
                <p className={styles.successText}>The answer is <span>{bestGuess.toUpperCase()}!</span></p>
                <button type="button"
                  className="btn btn-success"
                  onClick={() => reset()}>Reset</button>
              </div>
              : <>
                <button type="button"
                  className="btn btn-secondary"
                  onClick={() => reset()}>Reset</button>
                <button type="button"
                  className="btn btn-success"
                  disabled={complete || errors}
                  onClick={() => submit()}>Next</button>
              </>
          }
        </div>
        <div className={styles.onScreenKeyboard}
          style={isMobile ? null :  {display: "none"} }>
          <Keyboard
            onChange={() => { console.log("Keyboard changed") }}
            onKeyPress={(a) => onScreenKeyPress(a)}
            layout={{
              'default': [
                'q w e r t y u i o p',
                'a s d f g h j k l',
                'z x c v b n m <<'
              ]
            }}
          />
        </div>

      </div>
      <div className={styles.rightColumn}>
        <p style={{ opacity: complete ? 0 : 1, transition: 'all 500ms linear' }}>Try: {bestGuess}</p>
        <RemainingAnswers count={remainingAnswerCount} wordList={someRemainingAnswers} />
      </div>
    </div>
  </div>
  )
}