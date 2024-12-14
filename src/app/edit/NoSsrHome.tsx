import { FlowDataProvider } from "./components/FlowDataProvider";
import Flow from "./components/ReactFlow";

export default function NoSsrHome() {
    return (
        <FlowDataProvider>
            <Flow />
        </FlowDataProvider>
    )
}