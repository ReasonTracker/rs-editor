'use client';
import { Firestore } from "@/components/Firestore";

export default function Page({ params }: { params: { slug: string[] } }) {
    return (
        <Firestore id={params.slug[0]} />
    )
}