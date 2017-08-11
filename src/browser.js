/* eslint-env browser */
/**
 * Document and Window globals
 */
// @ts-ignore
export { document, window };

/**
 * Quick export for localStorage
 */
export let localStorage = window.localStorage;

/**
 * Attaches something to window
 * Should be used sparingly
 * 
 * @export
 * @param {string} name 
 * @param {any} item 
 */
export function globalize(name, item) {
  window[name] = item;
}

/**
 * The window dimensions
 * Does not update with orientation change
 * TODO: Update with window resizing
 */
export let dimensions = {
  x: window.innerWidth,
  y: window.innerHeight
};
