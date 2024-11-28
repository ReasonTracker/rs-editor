'use client';
import { FlowDataProvider } from './components/FlowDataProvider'
import Flow from './components/ReactFlow';


export default function Home() {
    return (
        <FlowDataProvider>
            <Flow />
        </FlowDataProvider>
    )
}