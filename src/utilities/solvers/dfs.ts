import { getDirection } from '../algorithm-methods';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import { getSolverAdjacencyList } from '../maze-structures';
import { Coordinates, Square } from '../../types';

/**
 * Interface defining the parameters for the DFS function.
 */
interface DfsParams {
  maze: Square[][];
  start_coords: Coordinates | null;
  solution_func: (tile: Square) => boolean;
  frontier_animation: (tile: Square) => void;
  traversal_animation: (tile: Square) => void;
  path_animation: (tile: Square) => void;
}

/**
 * Performs a Depth-First Search (DFS) on the given maze.
 *
 * @param params - An object containing the maze, start coordinates, solution function, and animation callbacks.
 * @returns An object containing the end coordinates (if found) and an array of animation functions.
 */
export const dfs = ({
  maze,
  start_coords,
  solution_func,
  frontier_animation,
  traversal_animation,
  path_animation,
}: DfsParams) => {
  const animations: Array<() => void> = [];
  const adjacency_list: GridAdjacencyList = getSolverAdjacencyList(maze);
  const pathMap: Map<string, Coordinates | null> = new Map();
  const visited: GridSet = new GridSet();
  const stack: Coordinates[] = [];
  let end: Coordinates | null = null;

  // Initialize the stack with the start coordinates
  if (start_coords) {
    stack.push(start_coords);
    pathMap.set(JSON.stringify(start_coords), null);
    const tile = maze[start_coords[0]]?.[start_coords[1]];
    if (!tile) return { end: null, animations: [] }; // Safety check
    animations.push(() => frontier_animation(tile));
  }

  // Perform DFS
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue; // Safety check

    const [r, c] = current;
    const currentTile = maze[r]?.[c];
    if (!currentTile) continue; // Ensure currentTile exists

    if (!visited.has(current)) {
      visited.add(current);
      animations.push(() => traversal_animation(currentTile));

      // Check if the current tile satisfies the solution condition
      if (solution_func(currentTile)) {
        end = current;
        break;
      }

      // Retrieve and reverse neighbors for correct DFS order
      const neighbors =
        adjacency_list.get(current)?.filter((n) => !visited.has(n)) || [];
      const reversedNeighbors = [...neighbors].reverse();

      for (const neighbor of reversedNeighbors) {
        stack.push(neighbor);
        pathMap.set(JSON.stringify(neighbor), current);
        const neighborTile = maze[neighbor[0]]?.[neighbor[1]];
        if (!neighborTile) continue; // Safety check
        animations.push(() => frontier_animation(neighborTile));
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

  return { end, animations };
};
