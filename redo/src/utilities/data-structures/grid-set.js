export class GridSet {
  constructor(coords_set = []) {
    this.set = new Set();
    this.addMultiple(coords_set);
  }
  add = (coords) => {
    this.set.add(JSON.stringify(coords));
    return this;
  };
  addMultiple = (coords_set) => {
    for (let coords of coords_set) this.add(coords);
  };
  has = (coords) => this.set.has(JSON.stringify(coords));
  toArray = () => [...this.set].map((str) => JSON.parse(str));
  at = (index) =>
    index < this.size() ? JSON.parse([...this.set][index]) : null;
  popRandom = () => {
    let coords = this.at(Math.floor(Math.random() * this.set.size));
    if (coords) this.set.delete(JSON.stringify(coords));
    return coords;
  };
  size = () => this.set.size;
}
