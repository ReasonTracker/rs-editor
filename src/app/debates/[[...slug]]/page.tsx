'use client';
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from 'firebase/firestore';
import { firestore } from "@/utils/firebaseApp";

export default function Page({ params }: { params: { slug: string[] } }) {
    const [debatesData, loading, error] = useCollection(
        collection(firestore, 'beta01'));
    return <>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Loading Debates...</span>}
        {debatesData && debatesData.docs.map((doc) => (
            <a href={'/data/' + doc.id} style={{ margin: '10px', border: '1px solid white', display:'block' }} key={doc.id}>
                {doc.id.replace('f-', '').replace('-', ' ')} 
            </a>
        ))}
    </>
}