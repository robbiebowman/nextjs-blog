import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { SpeedInsights } from "@vercel/speed-insights/next"
import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { createGlobalStyle } from "styled-components";
import { config, dom } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
const GlobalStyles = createGlobalStyle`
    ${dom.css()}
`;

const name = 'Robbie Bowman'
export const siteTitle = 'Robbie Bowman dot com'

const emailPortionA = 'robbiebo'
const emailPortionB = 'wman'
const emailPortionC = '@gmail.com'

export default function Layout({ children, maxWidth = '45rem' }) {
    const [showEmail, setShowEmail] = useState(false)
    return (
        <div className={styles.container} style={{ maxWidth: maxWidth }}>
            <Head>
                <link rel="icon" href="/images/favicon.ico" />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <SpeedInsights/>
            <header className={styles.header}>

                <GlobalStyles />
                <div className={styles.avatarContainer}>
                    <Link href="/">
                        <Image
                            priority
                            src="/images/portrait.png"
                            className={utilStyles.borderCircle}
                            height={108}
                            width={108}
                            alt={name}
                        />
                    </Link>
                    <h2 className={utilStyles.headingLg}>
                        <Link href="/">
                            <span className={utilStyles.colorInherit}>{name}</span>
                        </Link>
                    </h2>
                </div>
                <div className={styles.headerLinks}>
                    <Link href="https://github.com/robbiebowman/">
                        <div><div className={styles.socialIcon}><Image src="/images/github.webp" height={14} width={14} alt="Github icon" /></div>Github</div>
                    </Link>

                    <div>
                        <div className={styles.socialIcon}>
                            <Image src="/images/gmail.webp" height={14} width={14} alt="Gmail icon" />
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
                        <div><div className={styles.socialIcon}><Image src="/images/linkedin.webp" height={14} width={14} alt="LinkedIn icon" /></div>LinkedIn</div>
                    </Link>
                    <Link href="https://www.instagram.com/robbiebowman/">
                        <div><div className={styles.socialIcon}><Image src="/images/instagram.webp" height={14} width={14} alt="Instagram icon" /></div>Instagram</div>
                    </Link>
                </div>
            </header>
            <main className={styles.mainContent}>{children}</main>
        </div>
    )
}