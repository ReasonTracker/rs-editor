
export function createDict<T, K extends string & keyof T>(list: T[], prop: K): { [key: string]: T | undefined } {
    return list.reduce((dict: { [key: string]: T }, item: T) => {
        dict[String(item[prop])] = item;
        return dict;
    }, {} as { [P in K]: T });
}

export type Dictionary<T, K extends string | number | symbol = string> = {
    [P in K]: T | undefined;
};

export function keys<T, K extends string>(
    dict: { [P in K]: T; }
) {
    return Object.keys(dict) as K[];
}

export function getEntries<T, K extends string>(
    dict: { [P in K]: T; }
) {
    return (Object.entries(dict) as [K, T][]).filter(([, value]) => value !== undefined) as [K, Exclude<T, undefined>][];
}

export function getValues<T, K extends string>(
    dict: { [P in K]: T; }
) {
    return (Object.values(dict) as T[]).filter((value) => value !== undefined) as Exclude<T, undefined>[];
}


// export function createHierarchy<T>(list: T[], rootId: string, keyProp: keyof T, getChildren: (id: string) => T[]) {
//     const dict = createDict(list, keyProp);
// }

// export function createDict<T>(list: T[], prop: keyof T) {
//     return list.reduce((dict: Dictionary<T>, item) => {
//         //@ts-ignore
//         dict[item[prop]] = item;
//         return dict;
//     }, {});
// }

// export interface Dictionary<T> {
//     [Id: string]: T;
// }