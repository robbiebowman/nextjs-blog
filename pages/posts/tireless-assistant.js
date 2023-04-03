import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from './tireless-assistant.module.css'
import Layout from "../../components/layout";

export default function TirelessAssistant() {
    return (
        <Layout>
            <Head>
                <title>A Slack bot powered by GPT</title>
            </Head>
            <div className={styles.mainBox}>
                <h1>A Slack bot powered by GPT</h1>
                <div className={styles.slackBotBox}>
                    <div className={styles.slackAvatar}>
                        <Image
                            src="/images/tireless-assistant.png "
                            height={144}
                            width={144}
                            alt="A robotic typewriter cartoon"

                        />
                    </div>
                    <div>
                        <h1><Link href="https://wonderedhq.slack.com/apps/APQNFGHEC-tireless-assistant">Tireless Assistant</Link></h1>
                        <p>Invite Tireless Assistant into a channel and ask it to summarize all the previous messages you've missed via its slash command.</p>
                    </div>
                </div>
                <p>
                    I've written a Slack bot which I'm calling <strong>Tireless Assistant</strong>. It's purpose is to quickly catch you up on the latest in a
                    channel without you having to read through a litany of old messages.
                </p>
                <p>
                    The mechanism is pretty simple:
                    <ol>
                        <li>Parse the incoming slash command for a timespan <em>(e.g. "2 days", "3h 30 min")</em></li>
                        <li>Fetch all the messages between now and that amount of time in the past</li>
                        <li>Format it in a way that can be easily read</li>
                        <li>Send it to <Link href="https://platform.openai.com/docs/guides/chat">GPT</Link> and ask it to summarise it</li>
                        <li>Privately post that summary to the requesting user</li>
                    </ol>
                </p>
                <h2>Usage</h2>
                <p>
                    Use the slash command <span className={styles.codeSpan}>/sum</span> to have Tireless Assistant read and summarise the last 6 hours.
                </p>
                <p>
                    Add custom time spans to change how far back it reads.
                </p>
                <p>
                    Add <span className={styles.codeSpan}>publicly</span> to the end of the command to post the summary in the channel for all to see.
                </p>
                <h2>Examples</h2>
                <p>
                    <span className={styles.codeSpan}>/sum 1h30m</span> will summarise the past <strong>1 hour and 30 minutes</strong> of messages.
                </p>
                <p>
                    <span className={styles.codeSpan}>/sum 1 day 2 hours</span> will summarise the past <strong>26 hours</strong>.
                </p>
                <p>
                    <span className={styles.codeSpan}>/sum 45 min publicly</span> will summarise the past <strong>45 minutes</strong> of messages and post that summary in the channel.
                </p>
            </div>
        </Layout>
    )

}