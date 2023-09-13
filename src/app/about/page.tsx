import Image from 'next/image'

export default function Page() {
    return <article >
        <h2>To Do&apos;s</h2>
        <ul>
            <li>Refactor so that:</li>
            <ul>
                <li>separate calculable data (scores and indexes) from non-calculable data (claims and connectors)</li>
                <li>Do we want to separate the data by type to make it easier to mass delete or is the separation of the calculable enough</li>
            </ul>
            <li>create a new debate</li>
            <li>save data to a local file</li>
            <li>load data from a local file</li>
            <li>Save data to the cloud</li>
            <li>Load data from the cloud</li>
            <li>separate data into calculable, historical, and real?</li>
            <li>add video scripting</li>
            <li>deletions only delete the edge so far not the child scores, clames or edges. Probably ned to be part of the RSData code.</li>
        </ul>
        <h2>Problems</h2>
        <ul >
            <li>proMain on the claim and ProParent on the connector are each calculable from the other. Should both be stored? Pro-main is debate specific but may not be calcuable</li>
        </ul>


        <h2>Large Packages Used</h2>
        <ul >
            <li>https://blueprintjs.com ????</li>
            <li><a href="https://nextjs.org/" rel="nofollow">NEXT.js</a></li>
            <li><a href="https://reactflow.dev/" rel="nofollow">React Flow</a></li>
            <li><a href="https://github.com/CSFrequency/react-firebase-hooks/tree/master/firestore#react-firebase-hooks---cloud-firestore">React Firebase Hooks - Cloud Firestore</a></li>
        </ul>
        <h2 >Deploy</h2>
        <p >deployed to <a href="https://rseditor.netlify.app/" rel="nofollow">https://rseditor.netlify.app/</a></p>
        <p >
            <a href="https://app.netlify.com/sites/rseditor/deploys" rel="nofollow">
                <Image src="https://camo.githubusercontent.com/ba7423bea97c2ddd5a1e27e828010f8abc8f57ef626c3aaf480840fce41c4625/68747470733a2f2f6170692e6e65746c6966792e636f6d2f6170692f76312f6261646765732f38616532613661392d626138662d343631642d626632322d3964643734663736306630652f6465706c6f792d737461747573" alt="Netlify Status" data-canonical-src="https://api.netlify.com/api/v1/badges/8ae2a6a9-ba8f-461d-bf22-9dd74f760f0e/deploy-status" style={{ maxWidth: '100%;' }} />
            </a>
        </p>
    </article>
}