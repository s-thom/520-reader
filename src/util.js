/* eslint-env browser */
/**
 * Requests the content at a URL
 * 
 * @param {string} url URL to request
 * @returns {Promise} Resolves with requested content
 */
export function request(url) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', url);

    request.addEventListener('load', () => {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(new Error(`Invalid response code ${request.status}`));
      }
    });
    request.addEventListener('error', (err) => {
      reject(err);
    });
    request.send();
  });
}

/**
 * Splits text up into smaller chunks
 * 
 * @param {any} text Text to split between pages
 * @returns {string[]} Text for each page
 */
export function paginate(text) {
  return text
      .match(/(?:([\w\W]{1,500})(?:[.!?,\n]|$))/g);
}

/**
 * Splits the string up to the given length, stopping at the final punctuation mark
 * Returns an array:
 *     0: The text that was split off
 *     1: The remainder of the text
 * Returns null if no match was found
 * 
 * @export
 * @param {string} text Text to split
 * @param {number} length Maximum length
 * @returns {string[]} 
 */
export function extractLength(text, length) {
  let exp = new RegExp(`(?:([\\s\\S]{1,${length}})(?:[.!?,\\n]|$))([\\s\\S]+)`);
  let match = text.match(exp);
  if (match) {
    return match.slice(1, 2);
  } else {
    return null;
  }
}

export function punctuationSplit(text) {
  return text
      .match(/(?:([\s\S]+?)(?:['’.!?,\n]+|$))/g);
}

/**
 * Finds the average of an array of numbers
 * 
 * @export
 * @param {number[]} arr Array to average
 * @returns number Average value
 */
export function average(arr) {
  if (arr.length === 0) {
    return undefined;
  }

  let total = arr.reduce((c, t) => c + t, 0);
  return total / arr.length;
}

/**
 * Document and Window globals
 */
// @ts-ignore
export {document, window};

/**
 * The window dimensions
 * Does not update with orientation change
 * TODO: Update with window resizing
 */
export let dimensions = {
  x: window.innerHeight,
  y: window.innerWidth
};
