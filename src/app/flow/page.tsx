'use client';
import { FlowDataProvider } from './components/FlowDataProvider'
import Dev from './components/DevPanel';
import Flow from './components/ReactFlow';

export default function Home() {
    return (
        <FlowDataProvider>
            <Flow />
            <Dev />
        </FlowDataProvider>
    )
}