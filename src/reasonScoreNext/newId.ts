import { toBase62 } from "./toBase62";

/**
 * Generate a short sequential unique-ish id
 * @param when for testing - The date to use for the id. Defaults to now
 */
export const newId = (() => {
    let lastNum: number;
    let suffixNum = 0;

    return function (when: Date = new Date()): string {
        const num = 5000000000000 - when.getTime();
        let result = toBase62(num);

        if (num === lastNum) {
            suffixNum++
        } else {
            // Generate a random 30-bit number between 2^29 and 2^30 - 1 
            // which when converted to base 62 will always be 5 characters long
            // But leaves half the space for incrementing the suffix if the timestamp is the same
            suffixNum = Math.floor(Math.random() * ((1073741824 + 536870912) / 2 - 536870912) + 536870912);
        }

        // // Add 5 extra random characters in case multiple ids are creates at the same time
        result = result + toBase62(suffixNum);

        lastNum = num;

        return result;
    }
})();



