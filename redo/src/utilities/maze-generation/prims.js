import { shuffle } from 'lodash';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import { getFullEdges, getMazeAdjacencyList } from '../maze-structures';

export const prims = (grid) => {
  const adjacency_list = getMazeAdjacencyList(grid);
  let edges = new GridAdjacencyList();
  let visited = new GridSet();
  let frontier = new GridSet().add(adjacency_list.getRandom());
  let next = null;
  let connector = null;
  while (frontier.size() > 0) {
    next = frontier.popRandom();
    visited.add(next);
    let neighbors = adjacency_list.get(next);
    let unvisited = neighbors.filter((node) => !visited.has(node));
    frontier.addMultiple(unvisited);
    connector = shuffle(neighbors.filter((node) => visited.has(node)))[0];
    if (connector) edges.set(next, connector);
  }

  return [getFullEdges(edges.entries()).flat(1), frontier.toArray()];
};
