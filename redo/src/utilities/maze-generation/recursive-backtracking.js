import {
  getRandomUnvisitedNeighbor,
  traverse,
  traverseEdgeBackwards,
  walk,
} from '../algorithm-methods';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import { getFullEdges, getMazeAdjacencyList } from '../maze-structures';

export const recursiveBacktracking = (grid, forward_animation, backtrack_animation) => {
  let params = {
    animations: [],
    adjacency_list: getMazeAdjacencyList(grid),
    edges: new GridAdjacencyList(),
    visited: new GridSet(),
    forward_animation,
    backtrack_animation,
  };
  params.node = params.adjacency_list.getRandom();

  while (params.node) {
    params.node = walk(params);
    params.node = backtrack(params);
  }
  let result = getFullEdges(params.edges.entries()).flat(1);
  return [result, params.animations];
};

const backtrack = (params) => {
  let { node, adjacency_list, visited, edges, animations, backtrack_animation } = params;
  while (node) {
    //check if we can start a new walk
    let next = getRandomUnvisitedNeighbor(node, adjacency_list, visited);
    if (next) return node; //can start a new walk
    let parent = edges.get(node); //attempt to continue backtracking
    if (parent) {
      //has parent, traverse backwards to their node
      traverseEdgeBackwards(node, parent, animations, backtrack_animation);
      node = parent;
    } else {
      // has no parent, i.e. we're back at the starting node
      traverse(node, animations, backtrack_animation);
      return null;
    }
  }
  return null;
};
