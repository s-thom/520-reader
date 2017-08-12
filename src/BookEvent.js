export default class BookEvent {
  constructor({
    fragment,
    text,
    mode,
  }) {
    this.f = fragment;
    this.t = text;
    this.m = mode || 'ANY';
  }

  get fragment() {
    return this.f;
  }

  get text() {
    return this.t;
  }
}
