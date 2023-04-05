import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from './tireless-assistant.module.css'
import Layout from "../components/layout";

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
                            src="/images/tireless-assistant.png"
                            height={144}
                            width={144}
                            alt="A robotic typewriter cartoon"
                        />
                    </div>
                    <div className={styles.slackBotDescBox}>
                        <h1><Link href="https://work-distractions.slack.com/apps/APQNFGHEC-tireless-assistant?tab=more_info">Tireless Assistant</Link></h1>
                        <p>Invite Tireless Assistant into a channel and ask it to summarize all the previous messages you've missed via its slash command.</p>
                        <a className={styles.slackButtonLink} href="https://slack.com/oauth/v2/authorize?client_id=370994026455.806763561488&scope=channels:history,channels:join,channels:read,chat:write,commands,users:read&user_scope=channels:history,channels:read,users:read">
                            <div className={styles.slackButton}>
                                <Image
                                    className={styles.slackButtonIcon}
                                    src="/images/slack_icon.png"
                                    height={20}
                                    width={20} />
                                <span>Add to Slack</span>
                            </div>
                        </a>
                    </div>
                </div>
                <p>
                    I've written a Slack bot which I'm calling <strong>Tireless Assistant</strong>. It's purpose is to quickly catch you up on the latest in a
                    channel without you having to read through a litany of old messages.
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

                <h2>FAQ</h2>
                <h3 className={styles.faqHeading}>How does it work?</h3>
                <p>
                    The mechanism is pretty simple:
                    <ol>
                        <li>Parse the incoming slash command for a timespan <em>(e.g. "2 days", "3h 30 min")</em></li>
                        <li>Fetch all the messages between now and that amount of time in the past</li>
                        <li>Format it in a way that can be easily interpreted</li>
                        <li>Send it to <Link href="https://platform.openai.com/docs/guides/chat">GPT</Link> and ask it to summarise it</li>
                        <li>Privately post that summary to the requesting user</li>
                    </ol>
                </p>
                <h3 className={styles.faqHeading}>Can Tireless Assistant read my private channels or DM's?</h3>
                <p>
                    No. Tireless Assistant can only read messages in channels or conversations it's been added to. If someone uses <span className={styles.codeSpan}>/sum</span> in a private conversation, it will do nothing as the bot cannot join a private channel or DM group by itself. If you or a member explicitly invites Tireless Assistant in, the bot will work as usual.
                </p>
                <h3 className={styles.faqHeading}>
                    Does Tireless Assistant store any information from my Slack?
                </h3>
                <p>No. The bot is stateless. Any information it reads only exists for the life of that http request. The only stored value is an access token granted by Slack when you install the app. The bot uses this token to communicate with Slack so it can read what it needs to summarise and subsequently send the summary.</p>
                <p>The full source code is available on <Link href="https://github.com/robbiebowman/personal-api/blob/master/src/main/kotlin/com/robbiebowman/personalapi/service/SlackSummaryService.kt">the bot's repo on my Github</Link>.</p>
                <h3 className={styles.faqHeading}>After you ask GPT to summarise something, will it store and use that for training?</h3>
                <p>As stipulated in <Link href="https://openai.com/policies/terms-of-use">OpenAI's Terms of Use</Link>, OpenAI will not use any content from their API requests to train their language models. See: <strong>3. Content - (c) Use of Content to Improve Services</strong>. This is how Tireless Assistant communicates with GPT.</p>
                <h3 className={styles.faqHeading}>
                    Will Tireless Assistant always be free?
                </h3>
                <p>Probably. However GPT is not a free service. If the bot becomes very popular and the OpenAI API bills get unmanageable, I may seek to monetise it for enterprise orgs.</p>
                <h2 className={styles.faqHeading}>Privacy Policy</h2>
                <p>You can read the full privacy policy <Link href="/tireless-assistant/privacy-policy">here</Link></p>
                <div>
                    <Image
                        src="/images/typewriter-footer.png"
                        width="100%" height="40rem" layout="responsive" objectFit="contain" />
                </div>
            </div>
        </Layout>
    )

}