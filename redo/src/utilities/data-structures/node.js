export class Node {
  constructor(coords) {
    this.id = JSON.stringify(coords);
    this.coords = coords;
  }
}
