export class EllersSet {
  constructor(elements = []) {
    this.count = elements.length; // Number of disconnected components
    this.next_id = 0; // To keep track of set IDs
    this.setMap = new Map(); // Keep track of connected components
    // Initialize the data structure such that all elements have themselves as parents
    for (let element of elements) this.setMap.set(element, this.next_id++);
  }

  union(a, b) {
    let a_id = this.setMap.get(a),
      b_id = this.setMap.get(b);
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
  add(element) {
    this.setMap.set(element, this.next_id++);
  }

  // Find the set ID
  find = (element) => this.setMap.get(element);

  // Checks connectivity of the 2 nodes
  connected = (a, b) => this.setMap.get(a) === this.setMap.get(b);

  sets() {
    //very non-optimal but it works
    let reverseMap = new Map();
    for (let [element, id] of this.setMap.entries()) {
      if (!reverseMap.has(id)) reverseMap.set(id, []);
      reverseMap.get(id).push(element);
    }
    return reverseMap.values();
  }
}
