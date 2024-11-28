'use client';
import { FlowDataProvider } from './components/FlowDataProvider'
import Dev from './components/DevPanel';
import Flow from './components/ReactFlow';
import FilesPanel from './components/FilesPanel';

export default function Home() {
    return (
        <FlowDataProvider>
            <Flow />
            {/* <FilesPanel /> */}
        </FlowDataProvider>
    )
}