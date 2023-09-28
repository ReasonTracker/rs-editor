'use client';
import { FlowDataProvider } from '../flow/[[...slug]]/FlowDataProvider'
import SubCom from './SubCom';

export default function Home() {
    return (<>
        <FlowDataProvider>
            <SubCom />
        </FlowDataProvider>
    </>
  )
}