export function compareByName(a, b) {
    let res = 0;
    if (a.name > b.name) {
        res = 1;
    } else if (a.name < b.name) {
        res = -1;
    }
    return res;
}

/**
 * Compare two elements of array by given name.
 * Usage:
 *      import {compareBy} from "@app/shared/compare-utils";
 *      licenses = licenses.sort(compareBy(name));
 *
 * @param fieldName - name of an array element to be compared by
 */
export function compareBy(fieldName) {
    return (a, b) => {
        let res = 0;
        if (a[fieldName] > b[fieldName]) {
            res = 1;
        } else if (a[fieldName] < b[fieldName]) {
            res = -1;
        }
        return res;
    };
}
