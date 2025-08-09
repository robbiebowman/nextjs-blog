import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import Image from "next/image";
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import { formatDate } from '../lib/date-funcs'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: { allPostsData }
  }
}

export default function Home({ allPostsData }) {
  const currentDate = formatDate(new Date())
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
          <h1 className={utilStyles.headingLg}>Weekend Projects</h1>
          <ul className={utilStyles.list}>
            <li className={utilStyles.listItem}>
              <Link href={`/full-tab`}>
                📺 Full Tab - Video & Iframe Maximizer 🖥️
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.85em' }}>August 2025</span>
                <br />
                Toggle videos or iframes to fill the entire browser tab with pixel-perfect fit.
                <br/>
                <a href="https://addons.mozilla.org/en-US/firefox/addon/full-tab/" className={utilStyles.storeButton}>
                  <Image
                    src="/images/firefox.png"
                    width={16}
                    height={16}
                    alt="Firefox"
                    className={utilStyles.storeIcon}
                  />
                  Firefox
                </a>
                <a href="https://chromewebstore.google.com/detail/full-tab/dhkcndahfmecapcghdcegojdpnadbkgp" className={utilStyles.storeButton}>
                  <Image
                    src="/images/chrome.png"
                    width={16}
                    height={16}
                    alt="Chrome"
                    className={utilStyles.storeIcon}
                  />
                  Chrome
                </a>
                <Link href="https://github.com/robbiebowman/full-tab">Source code</Link>
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href="https://www.taxonomystery.com">
                🧩 The Daily Taxonomystery 🔍
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.85em' }}>July 2025</span>
                <br />
                Can you identify Wikipedia articles from their categories? A daily puzzle that challenges your knowledge and deductive reasoning.
                <br />
                <Link href="https://github.com/robbiebowman/taxonomystery">Source code</Link>
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href={`/sound-out`}>
                🔊 Sound Out - Smart Tab Audio Manager 🔇
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.85em' }}>January 2025</span>
                <br />
                A browser extension that automatically manages audio across your tabs.
                <br/>
                <a href="https://addons.mozilla.org/firefox/addon/sound-out" className={utilStyles.storeButton}>
                  <Image
                    src="/images/firefox.png"
                    width={16}
                    height={16}
                    alt="Firefox"
                    className={utilStyles.storeIcon}
                  />
                  Firefox
                </a>
                <a href="https://chromewebstore.google.com/detail/sound-out/emgjfabfplbjfndkgodlkfhnajagobme" className={utilStyles.storeButton}>
                  <Image
                    src="/images/chrome.png"
                    width={16}
                    height={16}
                    alt="Chrome"
                    className={utilStyles.storeIcon}
                  />
                  Chrome
                </a>
                <Link href="https://github.com/robbiebowman/sound-out">Source code</Link>
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href={`/alternate-reality-movies/${currentDate || ''}`}>
                🍿 Alternate Reality Movies 🎬
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.85em' }}>July 2024</span>
                <br />
                By changing just 1 letter in a movie title, we end up with an entirely new plot.
                Try to guess the new title based on the blurb!
                <br />
                <Link href="https://github.com/robbiebowman/title-game">Source code</Link>
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href={`/crossword/daily`}>
                📰 Daily Mini Crossword 🗞️
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.85em' }}>May 2024</span>
                <br />
                A daily mini crossword game with clever LLM generated clues.
                <br />
                <Link href="https://github.com/robbiebowman/personal-api/blob/master/src/main/kotlin/com/robbiebowman/personalapi/MiniCrosswordController.kt">LLM prompting code.</Link>
                <br />
                <Link href="https://github.com/robbiebowman/mini-crossword-maker">Crossword algorithm library.</Link>
                <br />
                You can also <Link href={`/crossword/creator`}>create and share your own crosswords</Link> using the same algorithm!
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href={`/tireless-assistant`}>
                🤖 A Slack bot that summarises recent messages
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.85em' }}>April 2023</span>
                <br />
                Uses GPT to summarise all the messages you've missed in a Slack channel.
                <br />
                <Link href="https://github.com/robbiebowman/personal-api/blob/master/src/main/kotlin/com/robbiebowman/personalapi/service/SlackSummaryService.kt">Source code.</Link>
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href={`/wordle`}>
                Wordle solver ⬜🟨🟩
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.85em' }}>February 2022</span>
                <br />
                Suggests words based on how many remaining possibilities they'll exclude.
                <br />
                <Link href="https://github.com/robbiebowman/WordleSolver">Library source code.</Link>
              </small>
            </li>
            <li className={utilStyles.listItem}>
              <Link href={`/chess`}>
                ♟️Chess position game♟️
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.85em' }}>February 2022</span>
                <br />
                Can you tell which side Stockfish favours?
                <br />
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
