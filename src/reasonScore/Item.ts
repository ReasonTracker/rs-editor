
/**
 * An item is a contract of what exists on all data objects. Mostly just an ID and a type. 
 * This is often extended by the data items
 */
export interface Item {
    type: string,
    id: string,
}


