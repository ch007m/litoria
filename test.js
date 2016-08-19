var nums = [2, 5, , 9];

function logArrayElements(element, index, array) {
    console.log('a[' + index + '] = ' + element);
}

// Notice that index 2 is skipped since there is no item at
// that position in the array.
if (Array.isArray(nums)) {
    console.log("Number of elements : %s",nums.length);
    nums.forEach(logArrayElements);
}