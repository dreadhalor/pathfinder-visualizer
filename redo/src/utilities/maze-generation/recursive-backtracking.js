import { shuffle } from 'lodash';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import { getFullEdges, getMazeAdjacencyList } from '../maze-structures';

export const recursiveBacktracking = (grid) => {
  let adjacency_list = getMazeAdjacencyList(grid);
  let edges = new GridAdjacencyList();
  let visited = new GridSet();
  let starting_node = adjacency_list.getRandom();
  let stack = [starting_node];
  while (stack.length > 0) {
    let node = stack.pop();
    visited.add(node);
    let shuffled_unvisited_neighbors = shuffle(
      adjacency_list.get(node).filter((neighbor) => !visited.has(neighbor))
    );
    for (let neighbor of shuffled_unvisited_neighbors) {
      edges.set(neighbor, node);
      stack.push(neighbor);
    }
  }
  let result = getFullEdges(edges.entries()).flat(1);
  return result;
};
