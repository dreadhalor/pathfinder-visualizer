import { shuffle } from 'lodash';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import { getFullEdges, getMazeAdjacencyList } from '../maze-structures';

export const huntAndKill = (grid) => {
  const adjacency_list = getMazeAdjacencyList(grid);
  let edges = new GridAdjacencyList();
  let visited = new GridSet();
  let next = adjacency_list.getRandom();
  let connector = null;
  while (next) {
    if (connector) edges.set(next, connector);
    walk(next, adjacency_list, visited, edges);
    [next, connector] = hunt(adjacency_list, visited);
  }
  let result = getFullEdges(edges.entries()).flat(1);
  return result;
};

const walk = (node, adjacency_list, visited, edges) => {
  while (node) {
    visited.add(node);
    let shuffled_unvisited_neighbors = shuffle(
      adjacency_list.get(node).filter((neighbor) => !visited.has(neighbor))
    );
    let next = shuffled_unvisited_neighbors[0];
    if (next) edges.set(next, node);
    else return node;
    node = next;
  }
  return null;
};
const hunt = (adjacency_list, visited) => {
  let scanned = new GridSet();
  let node = adjacency_list.at(0);
  while (node) {
    let neighbors = adjacency_list.get(node);
    let shuffled_visited_neighbors = shuffle(
      neighbors.filter((neighbor) => visited.has(neighbor))
    );
    let unscanned_neighbors = neighbors.filter(
      (neighbor) => !scanned.has(neighbor)
    );
    scanned.add(node);
    let connector = shuffled_visited_neighbors[0];
    if (!visited.has(node) && connector) return [node, connector];
    node = unscanned_neighbors[0];
  }
  return [null, null];
};
