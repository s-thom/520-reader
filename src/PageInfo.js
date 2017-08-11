export default class PageInfo {
  constructor(text, startId) {
    this.t = text;
    this.i = startId;
  }

  get text() {
    return this.t;
  }

  get id() {
    return this.i;
  }
}
