export class UnionFind {
  constructor(elements) {
    // Number of disconnected components
    this.count = elements.length;

    // Keep Track of connected components
    this.parentsMap = new Map();

    // Initialize the data structure such that all elements have themselves as parents
    for (let element of elements) this.parentsMap.set(element, element);
  }

  union(a, b) {
    let root_a = this.find(a);
    let root_b = this.find(b);

    // Roots are same so these are already connected.
    if (root_a === root_b) return;

    // Always make the element with smaller root the parent.
    if (root_a < root_b) {
      if (this.parentsMap.get(b) !== b) this.union(this.parentsMap.get(b), a);
      this.parentsMap.set(b, this.parentsMap.get(a));
    } else {
      if (this.parentsMap.get(a) !== a) this.union(this.parentsMap.get(a), b);
      this.parentsMap.set(a, this.parentsMap.get(b));
    }
  }

  // Returns final parent of a node
  find(a) {
    while (this.parentsMap.get(a) !== a) {
      a = this.parentsMap.get(a);
    }
    return a;
  }

  // Checks connectivity of the 2 nodes
  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}
