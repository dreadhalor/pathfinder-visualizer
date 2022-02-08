export class GridAdjacencyList {
  constructor() {
    this.list = new Map();
  }

  get = (coords) => this.list.get(JSON.stringify(coords));
  getRandom = () => {
    let starting_index = Math.floor(Math.random() * this.list.size);
    let starting_node = [...this.list.keys()][starting_index];
    return JSON.parse(starting_node);
  };
  set = (coords, neighbors) => this.list.set(JSON.stringify(coords), neighbors);
  entries = () => {
    let entries = [];
    for (let [key_node, neighbors] of this.list.entries()) {
      key_node = JSON.parse(key_node);
      entries.push([key_node, neighbors]);
    }
    return entries;
  };
}
