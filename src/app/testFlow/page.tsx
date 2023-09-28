import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Tests</h1>
      <Link href="/testFlow/reactFlowProvider">reactFlowProvider</Link>
      <Link href="/testFlow/dataProvider">dataProvider</Link>
      <Link href="/testFlow/testFlow">testFlow</Link>
      <Link href="/testFlow/puttingItTogether">puttingItTogether</Link>

    </main>
  )
}
