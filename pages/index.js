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
              <Link href={`/chess`}>
                <a>♟️Chess position game♟️</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                Can you tell which side Stockfish favours?
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
                <a>{title}</a>
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
