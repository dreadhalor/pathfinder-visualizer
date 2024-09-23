import { Coordinates } from '../../types';

export class GridAdjacencyList {
  private list: Map<string, Coordinates[]>;

  constructor(map?: Map<string, Coordinates[]>) {
    this.list = map || new Map<string, Coordinates[]>();
  }

  /**
   * Checks if the adjacency list contains the specified coordinates.
   * @param coords - The coordinates to check.
   * @returns True if the coordinates exist, otherwise false.
   */
  has(coords: Coordinates): boolean {
    return this.list.get(JSON.stringify(coords)) !== undefined;
  }

  /**
   * Retrieves the neighbors of the specified coordinates.
   * @param coords - The coordinates whose neighbors are to be retrieved.
   * @returns An array of neighboring coordinates or undefined if not found.
   */
  get(coords: Coordinates): Coordinates[] | undefined {
    return this.list.get(JSON.stringify(coords));
  }

  /**
   * Retrieves the coordinates at the specified index.
   * @param index - The index of the coordinates to retrieve.
   * @returns The coordinates at the given index.
   * @throws Error if the index is out of bounds.
   */
  at(index: number): Coordinates {
    const key = [...this.list.keys()][index];
    if (!key) {
      throw new Error('Index out of bounds');
    }
    return JSON.parse(key) as Coordinates;
  }

  /**
   * Retrieves a random set of coordinates from the adjacency list.
   * @returns A random set of coordinates or null if the list is empty.
   */
  getRandom(): Coordinates | null {
    const size = this.list.size;
    if (size === 0) return null;
    const index = Math.floor(Math.random() * size);
    return this.at(index);
  }

  /**
   * Sets the neighbors for the specified coordinates.
   * @param coords - The coordinates to set neighbors for.
   * @param neighbors - An array of neighboring coordinates.
   */
  set(coords: Coordinates, neighbors: Coordinates[]): void {
    this.list.set(JSON.stringify(coords), neighbors);
  }

  /**
   * Retrieves all entries in the adjacency list.
   * @returns An array of tuples containing coordinates and their neighbors.
   */
  entries(): [Coordinates, Coordinates[]][] {
    const entries: [Coordinates, Coordinates[]][] = [];
    for (const [key_node, neighbors] of this.list.entries()) {
      const parsedKey = JSON.parse(key_node) as Coordinates;
      entries.push([parsedKey, neighbors]);
    }
    return entries;
  }

  /**
   * Creates a clone of the current adjacency list.
   * @returns A new instance of GridAdjacencyList with the same data.
   */
  clone(): GridAdjacencyList {
    return new GridAdjacencyList(new Map(this.list));
  }
}
