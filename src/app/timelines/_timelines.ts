import { ActionTypes } from "@/reasonScore/types/ActionTypes";
import { Fictional_City } from "./Fictional_City";
import { ReactFlowInstance } from "reactflow";
import { FlowDataState } from "../edit/types/types";
import { Test_Timeline } from "./Test_Timeline";

export const timelines:{[id:string]:timelineMeta} = {
    Test_Timeline,
    Fictional_City,
}

export type timelineMeta = {
    name: string;
    id: string;
    timelineConstructor: (props: TimelineProps)=>gsap.core.Timeline;
}

export type TimelineProps = {
    dispatch: (actions: ActionTypes[]) => void,
    refs: React.MutableRefObject<{
        flowDataState: FlowDataState;
        reactFlowInstance: ReactFlowInstance<any, any>;
    }>,
    gsap: typeof globalThis.gsap

}