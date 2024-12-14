import { ActionTypes } from "@/reasonScore/types/ActionTypes";
import { Fictional_Clity } from "./Fictional_City";
import { ReactFlowInstance } from "reactflow";
import { FlowDataState } from "../edit/types/types";
import { Test_Timeline } from "./Test_Timeline";

export const timelines: {[id:string]:(props: TimelineProps) => {
    name: string;
    id: string;
    timeline: gsap.core.Timeline;
}} = {
    Test_Timeline,
}

export type TimelineProps = {
    dispatch: (actions: ActionTypes[]) => void,
    refs: React.MutableRefObject<{
        flowDataState: FlowDataState;
        reactFlowInstance: ReactFlowInstance<any, any>;
    }>,
    gsap: typeof globalThis.gsap

}