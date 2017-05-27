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
      .match(/(?:([\w\W]{1,1000})(?:[.!?,\n]|$))/g);
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
