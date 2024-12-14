'use client';
import { FlowDataProvider } from './components/FlowDataProvider'
import Flow from './components/ReactFlow';

import dynamic from 'next/dynamic';

// @ts-ignore
const DynamicHeader = dynamic(() => import('./noSsrHome'), {
  ssr: false,
})
// const DynamicHeader = dynamic(noSsrHome, {
//     ssr: false,
//   })

export default function Home() {
    return (
        <DynamicHeader />
    )
}

