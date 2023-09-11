'use client';
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from 'firebase/firestore';
import { firestore } from "@/utils/firebaseApp";

export default function Page({ params }: { params: { slug: string[] } }) {
    const [docdata, loading, error] = useDocument(
        doc(firestore, 'beta01', params.slug[0]));
    return <>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Loading...</span>}
        {docdata && <pre>
            {JSON.stringify(docdata.data(),undefined,2)}
        </pre>
        }
    </>
}