export class GridSet {
  constructor() {
    this.set = new Set();
  }
  add = (coords) => this.set.add(JSON.stringify(coords));
  has = (coords) => this.set.has(JSON.stringify(coords));
  toArray = () => [...this.set].map((str) => JSON.parse(str));
}
