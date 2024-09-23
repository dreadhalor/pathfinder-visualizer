import { Coordinates } from '../../types';

export class GridSet {
  private set: Set<string>;

  constructor(coords_set: Coordinates[] = []) {
    this.set = new Set<string>();
    this.addMultiple(coords_set);
  }

  /**
   * Adds a single set of coordinates to the GridSet.
   * @param coords - The coordinates to add.
   * @returns The GridSet instance for chaining.
   */
  add(coords: Coordinates): this {
    this.set.add(JSON.stringify(coords));
    return this;
  }

  /**
   * Adds multiple sets of coordinates to the GridSet.
   * @param coords_set - An array of coordinates to add.
   * @returns An array of coordinates that were successfully added.
   */
  addMultiple(coords_set: Coordinates[]): Coordinates[] {
    const successes: Coordinates[] = [];
    for (const coords of coords_set) {
      const sizeBefore = this.size();
      this.add(coords);
      if (this.size() > sizeBefore) successes.push(coords);
    }
    return successes;
  }

  /**
   * Checks if the GridSet contains the specified coordinates.
   * @param coords - The coordinates to check.
   * @returns True if the coordinates exist, otherwise false.
   */
  has(coords: Coordinates): boolean {
    return this.set.has(JSON.stringify(coords));
  }

  /**
   * Converts the GridSet to an array of coordinates.
   * @returns An array of coordinates.
   */
  toArray(): Coordinates[] {
    return [...this.set].map((str) => JSON.parse(str) as Coordinates);
  }

  /**
   * Retrieves the coordinates at the specified index.
   * @param index - The index of the coordinates to retrieve.
   * @returns The coordinates at the given index or null if out of bounds.
   */
  at(index: number): Coordinates | null {
    if (index < 0 || index >= this.size()) return null;
    const arr = [...this.set];
    if (!arr[index]) return null;
    return JSON.parse(arr[index]) as Coordinates;
  }

  /**
   * Removes and returns a random set of coordinates from the GridSet.
   * @returns The removed coordinates or null if the set is empty.
   */
  popRandom(): Coordinates | null {
    const size = this.size();
    if (size === 0) return null;
    const index = Math.floor(Math.random() * size);
    const coords = this.at(index);
    if (coords) this.set.delete(JSON.stringify(coords));
    return coords;
  }

  /**
   * Deletes the specified coordinates from the GridSet.
   * @param coords - The coordinates to delete.
   * @returns True if the coordinates were deleted, otherwise false.
   */
  delete(coords: Coordinates): boolean {
    return this.set.delete(JSON.stringify(coords));
  }

  /**
   * Retrieves the number of elements in the GridSet.
   * @returns The size of the set.
   */
  size(): number {
    return this.set.size;
  }

  /**
   * Creates a clone of the current GridSet.
   * @returns A new instance of GridSet with the same data.
   */
  clone(): GridSet {
    const copyCoords = this.toArray();
    return new GridSet(copyCoords);
  }
}
