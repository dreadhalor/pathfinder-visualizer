import { shuffle } from 'lodash';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import { getFullEdges2, getMazeAdjacencyList } from '../maze-structures';

export const recursive_backtracking = (grid) => {
  let rows = grid.length,
    cols = grid[0].length;
  let adjacency_list = getMazeAdjacencyList(rows, cols);
  let starting_node = adjacency_list.getRandom();
  let edges = new GridAdjacencyList();
  let visited = new GridSet();
  let stack = [starting_node];
  while (stack.length > 0) {
    let node = stack.pop();
    visited.add(node);
    let shuffled_neighbors = shuffle(adjacency_list.get(node));
    for (let neighbor of shuffled_neighbors) {
      if (!visited.has(neighbor)) {
        edges.set(neighbor, node);
        stack.push(neighbor);
      }
    }
  }
  let result = getFullEdges2(edges.entries()).flat(1);
  return result;
};
