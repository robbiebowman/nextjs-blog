import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group'

const name = 'Robbie Bowman'
export const siteTitle = 'Robbie Bowman dot com'

const emailPortionA = 'robbiebo'
const emailPortionB = 'wman'
const emailPortionC = '@gmail.com'

export default function Layout({ children, home }) {
    const [showEmail, setShowEmail] = useState(false)
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/images/favicon.ico" />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"></link>
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <header className={styles.header}>
                <div className={styles.avatarContainer}>
                    <Link href="/">
                        <a>
                            <Image
                                priority
                                src="/images/13639947.jpg"
                                className={utilStyles.borderCircle}
                                height={108}
                                width={108}
                                alt={name}
                            />
                        </a>
                    </Link>
                    <h2 className={utilStyles.headingLg}>
                        <Link href="/">
                            <a className={utilStyles.colorInherit}>{name}</a>
                        </Link>
                    </h2>
                </div>
                <div className={styles.headerLinks}>
                    <Link href="https://github.com/robbiebowman/">
                        <a><div><div className={styles.socialIcon}><Image src="/images/github.webp" height={14} width={14} /></div>Github</div></a>
                    </Link>

                    <div>
                        <div className={styles.socialIcon}>
                            <Image src="/images/gmail.webp" height={14} width={14} />
                        </div>
                        <div className={styles.emailBox}>

                            <SwitchTransition>
                                <CSSTransition
                                    key={showEmail}
                                    addEndListener={(node, done) => {
                                        node.addEventListener("transitionend", done, false);
                                    }}
                                    classNames="fade">
                                    <span>
                                        {showEmail
                                            ? `${emailPortionA}${emailPortionB}${emailPortionC}`
                                            : <a onClick={() => setShowEmail(true)}>Email</a>}
                                    </span>
                                </CSSTransition>
                            </SwitchTransition>
                        </div>
                    </div>
                    <Link href="https://www.linkedin.com/in/robbie-bowman/">
                        <a><div><div className={styles.socialIcon}><Image src="/images/linkedin.webp" height={14} width={14} /></div>LinkedIn</div></a>
                    </Link>
                    <Link href="https://www.instagram.com/robbiebowman/">
                        <a><div><div className={styles.socialIcon}><Image src="/images/instagram.webp" height={14} width={14} /></div>Instagram</div></a>
                    </Link>
                </div>
            </header>
            <main>{children}</main>
        </div>
    )
}