import { Claim } from "./Claim";
import { Connector } from "./Connector";

export interface DebateData {
    claims: { [id: string] : Claim }
    connectors: { [id: string] : Connector }
 }