'use client';
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
    return (
        <main className={styles.main + " bp5-running-text"}>
            <h1 className="">Reason Tracker</h1>
            <h2>COMING SOON</h2>

            <h2>Decision analysis for all*!</h2>
            <h3>Videos about hard decisions</h3>
            <p>
                A video series where you help map out all the reasons for and against controvertial decisions.
            </p>
            <p>
                Each video analyzes and maps a specific controversial decision and invites audience feedback.
                New videos will be created based on audience feedback, refining the analysis with each iteration.
                We hope this will make collective decision-making clearer and more accessible.

            </p>
            {/* <Link href="/edit">Editor</Link> */}
        </main>
    )
}
