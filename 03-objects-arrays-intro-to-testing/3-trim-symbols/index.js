/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (typeof size !== 'number') {
    return string;
  }
  if (string === '') {
    return '';
  }

  let newString = [], find, col;
  if (string) {
    for (const char of string) {
      if (char !== find) {
        find = char;
        col = 1;
      } else {
        ++col;
      }

      if (col <= size) {
        newString.push(char);
      }
    }
    return newString.join('');
  }
}
