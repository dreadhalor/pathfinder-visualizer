import { shuffle } from 'lodash';
import { expandEdge } from './maze-structures';

export const walk = (params) => {
  let {
    node,
    adjacency_list,
    visited,
    edges,
    animations,
    forward_animation,
    skip_first = false,
  } = params;
  if (node && !skip_first) traverse(node, animations, forward_animation);
  while (node) {
    visited.add(node);
    //check for next node in the walk
    let next = getRandomUnvisitedNeighbor(node, adjacency_list, visited);
    if (next) {
      //next node exists, let's walk to it
      edges.set(next, node);
      traverseEdgeForward(node, next, animations, forward_animation);
    } else return node; //no next node, end walk
    node = next;
  }
  return null;
};

export const getRandomUnvisitedNeighbor = (node, adjacency_list, visited) =>
  shuffle(adjacency_list.get(node).filter((neighbor) => !visited.has(neighbor)))[0];

export function traverse(node, animations, animation) {
  animations.push(() => animation(node));
}
export function traverseEdgeForward(n1, n2, animations, animation) {
  let edge = expandEdge([n1, n2]);
  for (let i = 1; i < edge.length; i++) {
    traverse(edge[i], animations, animation);
  }
}
export function traverseEdgeBackwards(n1, n2, animations, animation) {
  let edge = expandEdge([n1, n2]);
  for (let i = 0; i < edge.length - 1; i++) {
    traverse(edge[i], animations, animation);
  }
}
export function traverseFullEdge(n1, n2, animations, animation) {
  let edge = expandEdge([n1, n2]);
  for (let i = 0; i < edge.length; i++) {
    traverse(edge[i], animations, animation);
  }
}

export const connectFullEdge = (n1, n2, animations, connectAnimation) => {
  let edge = expandEdge([n1, n2]);
  animations.push(() => {
    for (let node of edge) connectAnimation(node);
  });
};
export const connectEdgeBackwards = (n1, n2, animations, connectAnimation) => {
  let edge = expandEdge([n1, n2]);
  animations.push(() => {
    for (let i = 0; i < edge.length - 1; i++) {
      connectAnimation(edge[i]);
    }
  });
};
