/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  let newArr = [];

  if (arr === undefined) {
    return [];
  }

  for (const item of arr) {
    if (!newArr.includes(item)) {
      newArr.push(item);
    }
  }

  return newArr;
}
