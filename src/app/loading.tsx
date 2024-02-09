'use client';
import { Spinner } from "@blueprintjs/core";

export default function Loading() {
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <Spinner />
        </div>
    );
}
