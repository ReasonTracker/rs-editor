'use client';
import { FlowDataProvider } from './components/FlowDataProvider'
import Dev from './components/DevPanel';
import ReactFlowComponent from './components/ReactFlow';

export default function Home() {
    return (
        <FlowDataProvider>
            <ReactFlowComponent />
            <Dev/>
        </FlowDataProvider>
  )
}