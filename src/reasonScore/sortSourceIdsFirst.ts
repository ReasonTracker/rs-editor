import { ConnectorRequired } from "./types/Connector";
const toposort = require('toposort')

export function sortSourceIdsFirst(connectors: { [id: string]: ConnectorRequired }) {
    return toposort(
        Object.values(connectors).map(c => [c.target, c.source])
    ).reverse() as string[]
}