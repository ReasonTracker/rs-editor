'use client';

import { FlowDataProvider } from "../components/FlowDataProvider";
import Dev from "../components/DevPanel";
import ArgumentGenerator from "./components/ArgumentGenerator";


export default function Home() {
    return (
        <FlowDataProvider>
            <ArgumentGenerator />
            <Dev />
        </FlowDataProvider>
    )
}