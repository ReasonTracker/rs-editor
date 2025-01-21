import { ReactFlowInstance } from 'reactflow';

export function zoomToNew(claimId: string, id: string, reactFlowInstance: ReactFlowInstance<any, any>) {
    setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.1, duration: 1000, nodes: [{ id }, { id: claimId }] });
    }, 100);
}
