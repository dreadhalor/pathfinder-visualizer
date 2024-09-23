import { getDirection } from '../algorithm-methods';
import { GridSet } from '../data-structures/grid-set';
import { getSolverAdjacencyList } from '../maze-structures';
import { Coordinates, Square } from '../../types';

// Interface for the parameters accepted by the bfs function
interface BfsParams {
  maze: Square[][];
  start_coords: Coordinates | null;
  solution_func: (tile: Square) => boolean;
  frontier_animation: (tile: Square) => void;
  traversal_animation: (tile: Square) => void;
  path_animation: (tile: Square) => void;
}

/**
 * Performs a Breadth-First Search (BFS) on the given maze.
 *
 * @param params - An object containing the maze, start coordinates, solution function, and animation callbacks.
 * @returns A tuple containing the end coordinates (if found) and an array of animation functions.
 */
export const bfs = ({
  maze,
  start_coords,
  solution_func,
  frontier_animation,
  traversal_animation,
  path_animation,
}: BfsParams): [Coordinates | null, Array<() => void>] => {
  const animations: Array<() => void> = [];
  const adjacency_list = getSolverAdjacencyList(maze);

  // Use a Map<string, Coordinates | null> for pathMap to map each node to its parent
  const pathMap: Map<string, Coordinates | null> = new Map();
  const visited = new GridSet();
  const queue: Coordinates[] = [];
  let end: Coordinates | null = null;

  if (start_coords) {
    queue.push(start_coords);
    pathMap.set(JSON.stringify(start_coords), null);
    const tile = maze[start_coords[0]]?.[start_coords[1]];
    if (tile) {
      animations.push(() => frontier_animation(tile));
    }
  }

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue; // Safety check

    const [r, c] = current;

    const currentTile = maze[r]?.[c];
    if (!currentTile) continue; // Ensure currentTile exists

    if (!visited.has(current)) {
      visited.add(current);
      animations.push(() => {
        traversal_animation(currentTile);
      });

      if (solution_func(currentTile)) {
        end = current;
        break;
      }

      const neighbors =
        adjacency_list.get(current)?.filter((n) => !visited.has(n)) || [];

      for (const neighbor of neighbors) {
        queue.push(neighbor);
        pathMap.set(JSON.stringify(neighbor), current);
        const neighborTile = maze[neighbor[0]]?.[neighbor[1]];
        if (neighborTile) {
          animations.push(() => frontier_animation(neighborTile));
        }
      }
    }
  }

  // Reconstruct the path from end to start
  let path_node: Coordinates | null = end;
  let child: Coordinates | null = null;

  while (path_node) {
    const [r, c] = path_node;
    const parent = pathMap.get(JSON.stringify(path_node)) || null;
    const direction = parent ? getDirection({ node: path_node, parent }) : null;

    const currentTile = maze[r]?.[c];
    if (currentTile) {
      animations.push(() => {
        path_animation(currentTile);
        if (direction) {
          currentTile.setDirection?.(direction);
        }
      });
    }

    child = path_node;
    path_node = parent;
  }

  return [end, animations];
};

// Interface for the parameters accepted by the bfs_raw function
interface BfsRawParams {
  maze: (Square | number)[][];
  start_coords: Coordinates | null;
  solution_func: (tile: Square | number) => boolean;
}

/**
 * Performs a raw Breadth-First Search (BFS) on the given maze without animations.
 *
 * @param params - An object containing the maze, start coordinates, and solution function.
 * @returns The end coordinates if a solution is found, otherwise null.
 */
export const bfs_raw = ({
  maze,
  start_coords,
  solution_func,
}: BfsRawParams): Coordinates | null => {
  const rows = maze?.length ?? 0;
  const cols = maze?.[0]?.length ?? 0;
  const visited = new GridSet();
  const queue: Coordinates[] = [];

  if (start_coords) {
    queue.push(start_coords);
    visited.add(start_coords);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue; // Safety check

    const [r, c] = current;
    const currentTile = maze[r]?.[c];
    if (!currentTile) continue; // Ensure currentTile exists
    if (solution_func(currentTile)) return current;

    // Explore neighbors in the order: up, down, left, right
    const directions: Coordinates[] = [
      [r - 1, c], // Up
      [r + 1, c], // Down
      [r, c - 1], // Left
      [r, c + 1], // Right
    ];

    for (const [nr, nc] of directions) {
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighborTile = maze[nr]?.[nc];
        if (neighborTile && !visited.has([nr, nc])) {
          queue.push([nr, nc]);
          visited.add([nr, nc]);
        }
      }
    }
  }

  return null;
};
