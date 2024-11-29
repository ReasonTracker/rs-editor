import { Connector } from "@/reasonScore/types/Connector";
import { DebateData } from "@/reasonScore/types/DebateData";


export function createConnectorsByTarget(debateData: DebateData,) {
    let connectorsByTarget: { [id: string]: Connector[]; } = {};
    Object.values(debateData.connectors).forEach(connector => {
        (connectorsByTarget[connector.target] ??= []).push(connector);
    });
    return connectorsByTarget;
}

export function createConnectorsIndexes(debateData: DebateData) {
    const connectorsIndexes: {
        bySource: { [id: string]: Connector[]; }
        byTarget: { [id: string]: Connector[]; }
    } = {bySource: {}, byTarget: {}};
    Object.values(debateData.connectors).forEach(connector => {
        (connectorsIndexes.byTarget[connector.target] ??= []).push(connector);
        (connectorsIndexes.bySource[connector.source] ??= []).push(connector);
    });
    return connectorsIndexes;
}
