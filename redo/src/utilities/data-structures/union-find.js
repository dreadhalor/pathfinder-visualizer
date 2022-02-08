//THIS IS BROKEN SOMEHOW BUT I CAN'T TELL HOW
export class UnionFind {
  constructor(elements = []) {
    // Number of disconnected components
    this.count = elements.length;

    // Keep track of connected components
    this.parentsMap = new Map();

    // Initialize the data structure such that all elements have themselves as parents
    for (let element of elements) this.parentsMap.set(element, element);
  }

  union(a, b) {
    let root_a = this.find(a);
    let root_b = this.find(b);
    if ((root_a ?? null) === null) return false;
    if ((root_b ?? null) === null) return false;

    // Roots are same so these are already connected.
    if (root_a === root_b) return true;

    // Always make the element with smaller root the parent.
    if (root_a < root_b) {
      if (this.parentsMap.get(b) !== b) this.union(this.parentsMap.get(b), a);
      this.parentsMap.set(b, this.parentsMap.get(a));
    } else {
      if (this.parentsMap.get(a) !== a) this.union(this.parentsMap.get(a), b);
      this.parentsMap.set(a, this.parentsMap.get(b));
    }
    return true;
  }

  // Add new node
  add(a) {
    if (this.parentsMap.has(a)) return false; //node already exists in union-find
    this.parentsMap.set(a, a); //add to map
    this.count++; //increase count
    return true;
  }

  // Returns final parent of a node
  find(a) {
    if (!this.parentsMap.has(a)) return null;
    while (this.parentsMap.get(a) !== a) a = this.parentsMap.get(a);
    return a;
  }

  // Checks connectivity of the 2 nodes
  connected = (a, b) => this.find(a) === this.find(b);

  sets() {
    let setMap = new Map();
    for (let element of this.parentsMap.keys()) {
      let parent = this.parentsMap.get(element);
      if (!setMap.has(parent)) setMap.set(parent, new Set());
      setMap.get(parent).add(element);
    }
    return setMap.values();
  }
}
