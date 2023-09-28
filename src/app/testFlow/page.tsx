import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Tests</h1>
      <Link href="/testFlow/working">working</Link>
    </main>
  )
}
