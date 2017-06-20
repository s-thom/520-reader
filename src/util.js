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
 * Splits text on punctuation
 * 
 * @export
 * @param {string} text Text to split
 * @returns {string[]} List of sequence fragments
 */
export function punctuationSplit(text) {
  return text
      .match(/(?:([\s\S]+?)(?:['’.!?,\n]+|$))/g);
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
