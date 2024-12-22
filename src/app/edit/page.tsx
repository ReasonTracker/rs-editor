'use client';
import dynamic from 'next/dynamic';

const NoSSRHome = dynamic(() => import('./NoSsrHome'), {
  ssr: false,
})

export default function Home() {
    return (
        <NoSSRHome />
    )
}

