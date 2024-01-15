'use client';
import { FlowDataProvider } from './FlowDataProvider'
import SubCom from './SubCom';

export default function Home() {
    return (<>
        <FlowDataProvider>
            <SubCom />
        </FlowDataProvider>
    </>
  )
}