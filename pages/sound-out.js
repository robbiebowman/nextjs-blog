import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from './tireless-assistant.module.css' // Reusing existing styles
import Layout from "../components/layout";

export default function SoundOut() {
    return (
        <Layout>
            <Head>
                <title>Sound Out - Browser Tab Audio Manager</title>
            </Head>
            <div className={styles.mainBox}>
                <h1>Sound Out - Browser Tab Audio Manager</h1>
                <div className={styles.slackBotBox}>
                    <div className={styles.slackAvatar}>
                        <Image
                            src="/images/icon_on128.png"
                            height={144}
                            width={144}
                            alt="Sound Out extension icon"
                        />
                    </div>
                    <div className={styles.slackBotDescBox}>
                        <h1>Sound Out</h1>
                        <p>A browser extension that automatically manages audio across your tabs to prevent multiple sources playing simultaneously.</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="https://addons.mozilla.org/firefox/addon/sound-out" className={styles.installButton}>
                                Install for Firefox
                            </a>
                            <a href="https://chrome.google.com/webstore/detail/sound-out" className={styles.installButton}>
                                Install for Chrome
                            </a>
                        </div>
                    </div>
                </div>

                <h2>What is Sound Out?</h2>
                <p>
                    It's a browser extension that automatically manages audio across tabs to prevent the chaos
                    of multiple playing sound simultaneously. It keeps the sound on in whatever tab you have open.
                    Then when you navigate away, it mutes the tab and unmutes what you navigate to.
                </p>
                <h2>Features</h2>
                <ul>
                    <li>Automatically mutes background tabs while keeping active tab unmuted</li>
                    <li>Preserves manual mute settings for excluded tabs</li>
                    <li>Visual feedback with orange/grey icon indicating managed state</li>
                    <li>Quick toggle via extension icon</li>
                    <li>Two operating modes: Exclusion (default) and Inclusion</li>
                </ul>

                <h2>How to Use</h2>
                <h3>Basic Usage</h3>
                <p>
                    Once installed, Sound Out works automatically. It will mute background tabs while keeping your active tab unmuted.
                    The extension icon shows orange when a tab is being managed and grey when it's not.
                </p>

                <h3>Operating Modes</h3>
                <p>
                    <strong>Exclusion Mode (Default):</strong> Manages all tabs except those you specifically exclude.
                    Perfect for when you want most tabs managed but need certain sites (like Spotify) to keep playing.
                </p>
                <p>
                    <strong>Inclusion Mode:</strong> Only manages the tabs you specifically include.
                    Ideal when you only want to manage certain sites like YouTube or Twitch.
                </p>

                <h2>Real World Examples</h2>
                <h3>Scenario 1: Music While Browsing</h3>
                <p>
                    Want to keep Spotify playing while browsing? Simply:
                </p>
                <ol>
                    <li>Enable Exclusion Mode</li>
                    <li>Add spotify.com to your exclusion list</li>
                    <li>Browse freely - Spotify will keep playing when you switch tabs</li>
                </ol>

                <h3>Scenario 2: Managing Video Sites</h3>
                <p>
                    Want to manage just YouTube and Twitch?
                </p>
                <ol>
                    <li>Enable Inclusion Mode</li>
                    <li>Add youtube.com and twitch.tv to your inclusion list</li>
                    <li>Only these sites will be muted when inactive</li>
                </ol>

                <h2>Source Code</h2>
                <p>
                    Sound Out is completely open source. You can view the source code and contribute on
                    <Link href="https://github.com/robbiebowman/sound-out"> GitHub</Link>.
                </p>

                <div style={{ position: 'relative', width: '100%', height: '20rem' }}>
                    <Image
                        src="/images/sound-wave.png"
                        layout="fill"
                        objectFit="contain"
                        alt="Sound waves illustration"
                    />
                </div>
                <h3>What's With The Name?</h3>
                <p>
                    Where I grew up, saying "sound out" means "thanks very much", and I thought it was a funny name.
                </p>
            </div>
        </Layout>
    )
} 