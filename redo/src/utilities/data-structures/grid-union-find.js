export class GridUnionFind {
  constructor(coords_set = []) {
    this.count = coords_set.length; // Number of disconnected components
    this.next_id = 0; // To keep track of set IDs
    this.setMap = new Map(); // Keep track of connected components
    // Initialize the data structure such that all elements have themselves as parents
    for (let coords of coords_set)
      this.setMap.set(JSON.stringify(coords), this.next_id++);
  }

  union(coords_a, coords_b) {
    let a_id = this.setMap.get(JSON.stringify(coords_a)),
      b_id = this.setMap.get(JSON.stringify(coords_b));
    if (a_id !== b_id) {
      let min = Math.min(a_id, b_id);
      let max = Math.max(a_id, b_id);
      for (let key of this.setMap.keys()) {
        if (this.setMap.get(key) === max) this.setMap.set(key, min);
      }
    }
    return true;
  }

  // Add new node
  add = (coords) => this.setMap.set(JSON.stringify(coords), this.next_id++);

  // Find the set ID
  find = (coords) => this.setMap.get(JSON.stringify(coords));

  // Checks connectivity of the 2 nodes
  connected = (coords_a, coords_b) =>
    this.setMap.get(JSON.stringify(coords_a)) ===
    this.setMap.get(JSON.stringify(coords_b));

  sets() {
    //very non-optimal but it works
    let reverseMap = new Map();
    for (let [coords_str, id] of this.setMap.entries()) {
      if (!reverseMap.has(id)) reverseMap.set(id, []);
      reverseMap.get(id).push(JSON.parse(coords_str));
    }
    return reverseMap.values();
  }
}
