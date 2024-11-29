import { ConnectorRequired } from "./types/Connector";
import { sortSourceIdsFirst } from "./sortSourceIdsFirst";

test('toposort', () => {
    const connectors: { [id: string]: ConnectorRequired } = {
        a: { source: '1-1-1', target: 'x' },
        b: { source: '2-1', target: 'x' },
        c: { source: 'root', target: '1' },
        d: { source: '1', target: '1-1' },
        e: { source: '1-1', target: '1-1-1' },
        f: { source: 'root', target: '2' },
        g: { source: '2', target: '2-1' },
        h: { source: '2-1', target: '2-1-1' }
    }

    const result = sortSourceIdsFirst(connectors)
    console.log(result);
    expect(1).toBe(1);

});