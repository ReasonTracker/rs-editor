'use client';
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Reason Tracker Editor</h1>
      <Link href="/edit">Editor</Link>
    </main>
  )
}
