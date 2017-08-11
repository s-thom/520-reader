/**
 * Represents information about a page
 * 
 * @export
 * @class PageInfo
 */
export default class PageInfo {
  /**
   * Creates an instance of PageInfo.
   * @param {string} text Text on this page
   * @param {number} startId Initial fragment ID
   * @memberof PageInfo
   */
  constructor(text, startId) {
    this.t = text;
    this.i = startId;
  }

  /**
   * Text on this page
   * 
   * @return {string} Text on this page
   * @readonly
   * @memberof PageInfo
   */
  get text() {
    return this.t;
  }

/**
   * Initial fragment ID
   * 
   * @return {number} Initial fragment ID
   * @readonly
   * @memberof PageInfo
   */
  get id() {
    return this.i;
  }
}
