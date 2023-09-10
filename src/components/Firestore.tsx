import { getFirestore, doc } from 'firebase/firestore';
import React from "react";
import { useDocument } from 'react-firebase-hooks/firestore';
import { firebaseApp } from "../utils/firebaseApp";

export function Firestore({ id }: { id: string }) {
    const [rsDataSnapshot, loading, error] = useDocument(
        doc(getFirestore(firebaseApp), 'beta01', id),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    return <>
        <p>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Loading...</span>}
            {rsDataSnapshot && <pre>{JSON.stringify(rsDataSnapshot.data(), undefined, 2)}</pre>
            }


        </p>
    </>
}
