/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let newArr = arr.slice();
  let sort;
  if (param == 'asc') {
    sort = newArr.sort((a, b) => a.localeCompare(b, undefined, {caseFirst: 'upper'}));
  } else if (param == 'desc') {
    sort = newArr.sort((a, b) => b.localeCompare(a, undefined, {caseFirst: 'upper'}));
  }
  return sort;
}
