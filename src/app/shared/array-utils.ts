// removes duplicates of elements of original array of primitive types
export function uniqueElements(array): [] {
    return array.filter((element, index, self) => {
        return index === self.indexOf(element);
    });
}


// removes duplicates of objects of original array comparing by field specified
export function uniqueObjects(array, compareFieldName) {
    return array.filter((object, index, self) => {
        return index === self.findIndex((t) => {
            return t[compareFieldName] === object[compareFieldName];
        });
    });
}
