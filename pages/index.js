import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: { allPostsData }
  }
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={utilStyles.mainPageContent}>
        <section className={utilStyles.headingMd}>
          <p>I write code for fun. It's also my job.</p>
        </section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h1 className={utilStyles.headingLg}>Things I made</h1>
          <ul className={utilStyles.list}>
            <li className={utilStyles.listItem}>
              <Link href={`/crossword/daily`}>
                📰 Daily Mini Crossword 🗞️
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                A daily mini crossword game with clever LLM generated clues.
                <br/>
                <Link href="https://github.com/robbiebowman/personal-api/blob/master/src/main/kotlin/com/robbiebowman/personalapi/MiniCrosswordController.kt">LLM prompting code.</Link>
                <br/>
                <Link href="https://github.com/robbiebowman/mini-crossword-maker">Crossword algorithm library.</Link>
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href={`/tireless-assistant`}>
                🤖 A Slack bot that summarises recent messages
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                Uses GPT to summarise all the messages you've missed in a Slack channel.
                <br/>
                <Link href="https://github.com/robbiebowman/personal-api/blob/master/src/main/kotlin/com/robbiebowman/personalapi/service/SlackSummaryService.kt">Source code.</Link>
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href={`/wordle`}>
                Wordle solver ⬜🟨🟩
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                Suggests words based on how many remaining possibilities they'll exclude.
                <br/>
                <Link href="https://github.com/robbiebowman/WordleSolver">Library source code.</Link>
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href={`/chess`}>
                ♟️Chess position game♟️
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                Can you tell which side Stockfish favours?
                <br/>
                <Link href="https://github.com/robbiebowman/nextjs-blog/tree/main/components/chess">Front end source code.</Link>
                </small>
            </li>
          </ul>
        </section>

        {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        { allPostsData.length > 0 ? <h2 className={utilStyles.headingLg}>Posts</h2> : "" }
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                {title}
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section> */}

      </div>
    </Layout>
  )
}
