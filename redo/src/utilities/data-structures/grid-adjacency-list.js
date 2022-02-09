export class GridAdjacencyList {
  constructor() {
    this.list = new Map();
  }

  get = (coords) => this.list.get(JSON.stringify(coords));
  at = (index) => JSON.parse([...this.list.keys()][index]);
  getRandom = () => this.at(Math.floor(Math.random() * this.list.size));
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
