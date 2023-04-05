import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from './privacy-policy.module.css'
import Layout from "../../components/layout";

export default function PrivacyPolicy() {
    return (
        <Layout>
            <Head>
                <title>Tireless Assistant - Privacy Policy</title>
            </Head>
            <div className={styles.mainBox}>
                <h1>Privacy Policy</h1>
                <p>Thank you for using Tireless Assistant! This privacy policy explains how we collect, use, and protect your personal information.</p>
                    <h2>Information We Collect</h2>
                    <p>Tireless Assistant uses GPT to summarize messages in a Slack channel that the bot is in. We do not store any user data or conversations. The bot sends the conversations to OpenAI, which does not use the data for training. We do not store any personal information about you.</p>

                    <h2>Use of Information</h2>
                    <p>We use GPT to summarize messages for your convenience. The information is sent to OpenAI, which does not use the data for training. We do not use the information for any other purpose.</p>

                    <h2>Information Sharing</h2>
                    <p>We do not share any personal information with third parties. First parties are those considered material for the functioning of the app. They are Azure, OpenAI, and Slack. Tireless Assistant is a web app hosted on Azure. Information is sent directly from Slack to the bot in Azure, and then from the bot to OpenAI. This information is sent securely over SSL.</p>

                    <h2>Data Security</h2>
                    <p>We take reasonable measures to protect your personal information from unauthorized access or disclosure. No conversation or data from your Slack is written to long-term storage. After a request is complete, all personal information in the request is gone.</p>

                    <h2>Your Choices</h2>
                    <p>You can choose not to use Tireless Assistant if you do not agree to this privacy policy. If you have any questions or concerns about this policy, please contact me at robbiebowman@gmail.com.</p>

                    <h2>Updates to Privacy Policy</h2>
                    <p>I may update this privacy policy from time to time. We will notify you of any material changes by posting a notice on our website or by using the bot to notify users. Your continued use of Tireless Assistant after the changes have been made will constitute your acceptance of the new privacy policy.</p>
            </div>
        </Layout>
    )
}