'use client';

import { FlowDataProvider } from "../components/FlowDataProvider";
import Dev from "../components/DevPanel";
import ArgumentGeneratorFlow from "./components/ArgumentGeneratorFlow";
import { createContext, useState } from "react";

type LoadingContextState = {
    isLoading: boolean;
    setIsLoading: (isDev: boolean) => void;
}
const initialLoadingContextState = {
    isLoading: false,
    setIsLoading: () => { },
}
export const LoadingContext = createContext<LoadingContextState>(initialLoadingContextState);

export default function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            <FlowDataProvider>
                <ArgumentGeneratorFlow />
                <Dev />
            </FlowDataProvider>
        </LoadingContext.Provider>
    )
}