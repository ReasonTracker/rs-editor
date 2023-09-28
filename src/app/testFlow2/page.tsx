'use client';
import ReactFlow, { useEdgesState, useNodesState } from 'reactflow';
import { FlowDataContext, FlowDataProvider } from '../flow/[[...slug]]/FlowDataProvider'
import { useContext } from 'react';
import SubCom from './SubCom';

export default function Home() {
    return (<>
        <FlowDataProvider>
            <SubCom />
        </FlowDataProvider>
    </>
  )
}