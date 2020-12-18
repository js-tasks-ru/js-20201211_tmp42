/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArr = arr.slice();
  let sort, id;
  if (param == "asc") {
    id = 1;
  } else if (param == "desc") {
    id = -1;
  }
  sort = newArr.sort((a, b) => id*a.localeCompare(b, 'ru-en', {caseFirst: "upper"}));
  return sort;
}
