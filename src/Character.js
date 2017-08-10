import {escapeRegex} from './util';

export default class Character {
  /**
   * Creates an instance of Character.
   * @param {string} name Display name for the character
   * @param {string[]} names Array of possible names for the character that appear in the text
   * @param {string} image URL of an image representing the character
   * @memberof Character
   */
  constructor(name, names, image) {
    this._name = name;
    this._names = names;
    this._image = image;

    // Store regular expression, so it only is created once
    // Since the list of names is not mutable, it will not change
    let exp = names
      .map(escapeRegex)
      .join('|');
    this._exp = new RegExp(exp, 'ig');
  }

  /**
   * Gets the display name of this character
   * 
   * @readonly
   * @memberof Character
   */
  get name() {
    return this._name;
  }

  /**
   * Gets the possible names for this character in the text
   * 
   * @readonly
   * @memberof Character
   */
  get names() {
    return this._names.slice();
  }

  /**
   * Gets the URL of an iage for the character
   * 
   * @readonly
   * @memberof Character
   */
  get imageUrl() {
    return this._image;
  }

  /**
   * Finds how often a character is mentioned in the body of text 
   * Does not do any semantic analysis
   * 
   * @param {string} text Text to analyse
   * @returns {number} Number of times the character occurs in the text
   * @memberof Character
   */
  numberOfOccurrences(text) {
    let match = text.match(this._exp);
    if (match) {
      return match.length;
    } else {
      return 0;
    }
  }

    /**
     * Tests the given name to see if this character is known by that name
     * 
     * @param {string} name Name to check against
     * @returns {boolean} Whether the character is known by this name
     * @memberof Character
     */
  isCalled(name) {
    return !!this.names.find(n => n.toLowerCase() === name.toLowerCase());
  }
}
