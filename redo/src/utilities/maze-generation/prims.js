import { shuffle } from 'lodash';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import {
  expandEdge,
  getFullEdges,
  getMazeAdjacencyList,
} from '../maze-structures';

export const prims = (grid, frontierAnimation, connectAnimation) => {
  let animations = [];
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
    connector = shuffle(neighbors.filter((node) => visited.has(node)))[0];
    if (connector)
      connect(next, connector, edges, animations, connectAnimation);
    addToFrontier(unvisited, frontier, animations, frontierAnimation);
  }

  return [getFullEdges(edges.entries()).flat(1), animations];
};

function addToFrontier(nodes, frontier, animations, frontierAnimation) {
  let added = frontier.addMultiple(nodes);
  if (frontierAnimation)
    animations.push(() => {
      for (let node of added) frontierAnimation(node);
    });
}
function connect(n1, n2, edges, animations, connectAnimation) {
  edges.set(n1, n2);
  let edge = expandEdge([n1, n2]);
  if (connectAnimation) {
    // for (let node of edge.reverse())
    //   animations.push(() => connectAnimation(node));
    animations.push(() => {
      for (let node of edge) connectAnimation(node);
    });
  }
}
