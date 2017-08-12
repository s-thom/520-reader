export default class BookEvent {
  constructor({
    fragment,
    text,
    mode,
    characters,
  }) {
    this.f = fragment;
    this.t = text;
    this.m = mode || 'ANY';
    this.c = characters || [];
  }

  get fragment() {
    return this.f;
  }

  get text() {
    return this.t;
  }

  matchesCharacters(characters) {
    if (this.c.length === 0) {
      return characters.length === 0;
    }

    let res;
    switch (this.m) {
      case 'ANY':
        return !!this.c.find(c => characters.find(c1 => c1.name === c));
      case 'ALL':
        res = [];
        // Add all characters found in both arrays
        this.c.forEach((c) => {
          if (characters.find(c1 => c1.name === c)) {
            res.push(c);
          }
        });

        return res.length === this.c.length;
      default:
        console.log(`UNKNOWN MODE ${this.m}, ALLOWING`);
        return true;
    }
  }
}
