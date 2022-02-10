import { shuffle } from 'lodash';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import {
  expandEdge,
  getFullEdges,
  getMazeAdjacencyList,
} from '../maze-structures';

export const recursiveBacktracking = (
  grid,
  forward_animation,
  backtrack_animation
) => {
  let animations = [];
  let adjacency_list = getMazeAdjacencyList(grid);
  let edges = new GridAdjacencyList();
  let visited = new GridSet();
  let starting_node = adjacency_list.getRandom();
  let stack = [starting_node];
  let node = starting_node;
  traverse(node, animations, forward_animation);
  let i = 100;
  while (node && i) {
    node = walk(
      node,
      adjacency_list,
      visited,
      edges,
      animations,
      forward_animation
    );
    node = backtrack(
      node,
      adjacency_list,
      visited,
      edges,
      animations,
      backtrack_animation
    );
    i--;
  }
  // while (stack.length > 0) {
  //   let node = stack.pop();
  //   if (!backtracking) {
  //     let parent = edges.get(node);
  //     if (parent) {
  //       let edge = expandEdge([parent, node]);
  //       for (let i = 1; i < edge.length; i++) {
  //         traverse(edge[i], animations, forward_animation);
  //       }
  //     } else traverse(node, animations, forward_animation);
  //   }
  //   visited.add(node);
  //   let shuffled_unvisited_neighbors = shuffle(
  //     adjacency_list.get(node).filter((neighbor) => !visited.has(neighbor))
  //   );
  //   let next = shuffled_unvisited_neighbors[0];
  //   if (next) {
  //     edges.set(next, node);
  //     stack.push(next);
  //   } else {
  //     let parent = edges.get(node);
  //     if (parent) {
  //       stack.push(parent);
  //       let edge = expandEdge([node, parent]);
  //       for (let i = 0; i < edge.length - 1; i++) {
  //         traverse(edge[i], animations, backtrack_animation);
  //       }
  //     } else traverse(node, animations, backtrack_animation);
  //   }
  // }
  let result = getFullEdges(edges.entries()).flat(1);
  return [result, animations];
};

function traverse(node, animations, animation) {
  animations.push(() => animation(node));
}
function traverseEdgeForward(n1, n2, animations, forward_animation) {
  let edge = expandEdge([n1, n2]);
  for (let i = 1; i < edge.length; i++) {
    traverse(edge[i], animations, forward_animation);
  }
}
function traverseEdgeBackwards(n1, n2, animations, backtrack_animation) {
  let edge = expandEdge([n1, n2]);
  for (let i = 0; i < edge.length - 1; i++) {
    traverse(edge[i], animations, backtrack_animation);
  }
}

const walk = (
  node,
  adjacency_list,
  visited,
  edges,
  animations,
  forward_animation
) => {
  if (node) traverse(node, animations, forward_animation);
  while (node) {
    visited.add(node);
    let shuffled_unvisited_neighbors = shuffle(
      adjacency_list.get(node).filter((neighbor) => !visited.has(neighbor))
    );
    let next = shuffled_unvisited_neighbors[0];
    if (next) {
      edges.set(next, node);
      traverseEdgeForward(node, next, animations, forward_animation);
    } else return node;
    node = next;
  }
  return null;
};

const backtrack = (
  node,
  adjacency_list,
  visited,
  edges,
  animations,
  backtrack_animation
) => {
  while (node) {
    let shuffled_unvisited_neighbors = shuffle(
      adjacency_list.get(node).filter((neighbor) => !visited.has(neighbor))
    );
    let next = shuffled_unvisited_neighbors[0];
    if (next) return node;
    let parent = edges.get(node);
    if (parent)
      traverseEdgeBackwards(node, parent, animations, backtrack_animation);
    else {
      traverse(node, animations, backtrack_animation);
      return null;
    }
    node = parent;
  }
  return null;
};
