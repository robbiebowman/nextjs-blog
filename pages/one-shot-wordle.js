import fs from 'fs'
import Head from 'next/head'
import path from 'path'
import Layout from '../components/layout'
import OneShotWordleGame from '../components/one-shot-wordle/one-shot-wordle-game'
import { WordleGameSelector } from '../components/game-selector/game-selector'
import { parseWords } from '../lib/one-shot-wordle'
import { serializePuzzles } from '../lib/one-shot-wordle-puzzles'

export async function getStaticProps() {
  const dataDirectory = path.join(process.cwd(), 'data', 'one-shot-wordle')
  const answerWords = parseWords(
    fs.readFileSync(path.join(dataDirectory, 'answers.txt'), 'utf8')
  )
  const additionalGuesses = parseWords(
    fs.readFileSync(path.join(dataDirectory, 'allowed-guesses.txt'), 'utf8')
  )
  const validWords = [...new Set([...answerWords, ...additionalGuesses])]
  const { puzzles } = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, 'puzzles.json'), 'utf8')
  )

  if (puzzles.length === 0) {
    throw new Error('No qualifying One-Shot Wordle puzzles were generated.')
  }

  return {
    props: {
      answerCount: answerWords.length,
      serializedPuzzles: serializePuzzles(puzzles),
      validWords: validWords.join(','),
      answers: answerWords.join(','),
    },
  }
}

export default function OneShotWordlePage(props) {
  return (
    <Layout>
      <Head>
        <title>One-Shot Wordle</title>
        <meta
          content="Solve a five-letter Wordle clue with exactly one possible answer."
          name="description"
        />
      </Head>
      <WordleGameSelector selectedTitle="One Shot" />
      <OneShotWordleGame {...props} />
    </Layout>
  )
}
