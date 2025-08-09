import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from './tireless-assistant.module.css' // Reusing existing styles
import Layout from "../components/layout";

export default function FullTab() {
    return (
        <Layout>
            <Head>
                <title>Full Tab - Video & Iframe Maximizer</title>
            </Head>
            <div className={styles.mainBox}>
                <h1>Full Tab - Video & Iframe Maximizer</h1>
                <div className={styles.slackBotBox}>
                    <div className={styles.slackAvatar}>
                        <Image
                            src="/images/full-tab-icon.png"
                            height={144}
                            width={144}
                            alt="Full Tab extension icon"
                        />
                    </div>
                    <div className={styles.slackBotDescBox}>
                        <h1>Full Tab</h1>
                        <p>A browser extension that toggles videos or iframes to fill the entire browser tab with pixel-perfect fit.</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="https://addons.mozilla.org/en-US/firefox/addon/full-tab/" className={styles.installButton}>
                                Install for Firefox
                            </a>
                            <a href="https://chromewebstore.google.com/detail/full-tab/dhkcndahfmecapcghdcegojdpnadbkgp" className={styles.installButton}>
                                Install for Chrome
                            </a>
                        </div>
                    </div>
                </div>

                <h2>How it Works</h2>
                <p>
                    Click the extension icon while on any webpage and it will find the largest video or iframe 
                    and expand it to fill the entire browser tab. Click again to return to normal view.
                </p>
                
                <p>
                    Perfect for YouTube, embedded videos, or any site with iframes. Videos maintain their aspect 
                    ratio for a clean viewing experience.
                </p>

                <h2>Source Code</h2>
                <p>
                    Full Tab is completely open source. You can view the source code and contribute on
                    <Link href="https://github.com/robbiebowman/full-tab"> GitHub</Link>.
                </p>
            </div>
        </Layout>
    )
}