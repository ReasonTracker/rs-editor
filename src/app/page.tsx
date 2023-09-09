import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Reason Score Editor</h1>
      <Link href="/ui1">UI 1</Link>
      <Link href="/flow">Flow</Link>

    </main>
  )
}
