import { shuffle } from 'lodash';
import { expandEdge } from './maze-structures';
import { GridAdjacencyList } from './data-structures/grid-adjacency-list';
import { GridSet } from './data-structures/grid-set';
import { Coordinates } from '../types';

/**
 * Parameters for the walk function.
 */
interface WalkParams {
  node: Coordinates | null;
  adjacency_list: GridAdjacencyList;
  visited: GridSet;
  edges: GridAdjacencyList;
  skip_first?: boolean;
}

/**
 * Animation parameters for the walk function.
 */
interface AnimationParams {
  animation_queue: Array<() => void>;
  traverseAnimation: (node: any) => void; // Replace `any` with the actual type of node if available
}

/**
 * Performs a walk through the graph using BFS or DFS logic.
 *
 * @param params - Parameters for the walk.
 * @param animationMethods - Methods to handle animations.
 * @returns The last node visited or null if the walk ends.
 */
export const walk = (
  params: WalkParams,
  animationMethods: AnimationParams,
): Coordinates | null => {
  const { node, adjacency_list, visited, edges, skip_first = false } = params;
  const { animation_queue, traverseAnimation } = animationMethods;

  if (node && !skip_first) {
    traverse(node, animation_queue, traverseAnimation);
  }

  let currentNode = node;

  while (currentNode) {
    visited.add(currentNode);
    // Check for next node in the walk
    const next = getRandomUnvisitedNeighbor(
      currentNode,
      adjacency_list,
      visited,
    );
    if (next) {
      // Next node exists, let's walk to it
      edges.set(next, [currentNode]);
      traverseEdgeForward(
        currentNode,
        next,
        animation_queue,
        traverseAnimation,
      );
    } else {
      return currentNode; // No next node, end walk
    }
    currentNode = next;
  }

  return null;
};

/**
 * Retrieves a random unvisited neighbor of a given node.
 *
 * @param node - The current node.
 * @param adjacency_list - The adjacency list of the graph.
 * @param visited - The set of visited nodes.
 * @returns A random unvisited neighbor or undefined if none exist.
 */
export const getRandomUnvisitedNeighbor = (
  node: Coordinates,
  adjacency_list: GridAdjacencyList,
  visited: GridSet,
): Coordinates | undefined =>
  shuffle(
    adjacency_list.get(node)?.filter((neighbor) => !visited.has(neighbor)) ||
      [],
  )[0];

/**
 * Retrieves a random visited neighbor of a given node.
 *
 * @param node - The current node.
 * @param adjacency_list - The adjacency list of the graph.
 * @param visited - The set of visited nodes.
 * @returns A random visited neighbor or undefined if none exist.
 */
export const getRandomVisitedNeighbor = (
  node: Coordinates,
  adjacency_list: GridAdjacencyList,
  visited: GridSet,
): Coordinates | undefined =>
  shuffle(
    adjacency_list.get(node)?.filter((neighbor) => visited.has(neighbor)) || [],
  )[0];

/**
 * Adds a traversal action to the animation queue.
 *
 * @param node - The node to traverse.
 * @param animations - The animation queue.
 * @param animation - The traversal animation function.
 */
export function traverse(
  node: Coordinates,
  animations: Array<() => void>,
  animation: (node: any) => void, // Replace `any` with the actual type of node if available
): void {
  animations.push(() => animation(node));
}

/**
 * Adds a forward edge traversal to the animation queue.
 *
 * @param n1 - The starting node.
 * @param n2 - The ending node.
 * @param animations - The animation queue.
 * @param animation - The traversal animation function.
 */
export function traverseEdgeForward(
  n1: Coordinates,
  n2: Coordinates,
  animations: Array<() => void>,
  animation: (node: any) => void, // Replace `any` with the actual type of node if available
): void {
  const edge = expandEdge([n1, n2]);
  for (let i = 1; i < edge.length; i++) {
    const toTraverse = edge[i];
    if (!toTraverse) continue;
    traverse(toTraverse, animations, animation);
  }
}

/**
 * Adds a backward edge traversal to the animation queue.
 *
 * @param n1 - The starting node.
 * @param n2 - The ending node.
 * @param animations - The animation queue.
 * @param animation - The traversal animation function.
 */
export function traverseEdgeBackwards(
  n1: Coordinates,
  n2: Coordinates,
  animations: Array<() => void>,
  animation: (node: any) => void, // Replace `any` with the actual type of node if available
): void {
  const edge = expandEdge([n1, n2]);
  for (let i = 0; i < edge.length - 1; i++) {
    const toTraverse = edge[i];
    if (!toTraverse) continue;
    traverse(toTraverse, animations, animation);
  }
}

/**
 * Adds a full edge traversal to the animation queue.
 *
 * @param n1 - The starting node.
 * @param n2 - The ending node.
 * @param animations - The animation queue.
 * @param animation - The traversal animation function.
 */
export function traverseFullEdge(
  n1: Coordinates,
  n2: Coordinates,
  animations: Array<() => void>,
  animation: (node: any) => void, // Replace `any` with the actual type of node if available
): void {
  const edge = expandEdge([n1, n2]);
  for (let i = 0; i < edge.length; i++) {
    const toTraverse = edge[i];
    if (!toTraverse) continue;
    traverse(toTraverse, animations, animation);
  }
}

/**
 * Connects two nodes fully and adds the animation to the queue.
 *
 * @param n1 - The first node.
 * @param n2 - The second node.
 * @param animations - The animation queue.
 * @param connectAnimation - The connect animation function.
 */
export const connectFullEdge = (
  n1: Coordinates,
  n2: Coordinates,
  animations: Array<() => void>,
  connectAnimation: (node: any) => void, // Replace `any` with the actual type of node if available
): void => {
  const edge = expandEdge([n1, n2]);
  animations.push(() => {
    for (let node of edge) connectAnimation(node);
  });
};

/**
 * Connects two nodes backwards and adds the animation to the queue.
 *
 * @param n1 - The first node.
 * @param n2 - The second node.
 * @param animations - The animation queue.
 * @param connectAnimation - The connect animation function.
 */
export const connectEdgeBackwards = (
  n1: Coordinates,
  n2: Coordinates,
  animations: Array<() => void>,
  connectAnimation: (node: any) => void, // Replace `any` with the actual type of node if available
): void => {
  const edge = expandEdge([n1, n2]);
  animations.push(() => {
    for (let i = 0; i < edge.length - 1; i++) {
      connectAnimation(edge[i]);
    }
  });
};

/**
 * Determines the direction from a node to its parent or child.
 *
 * @param params - An object containing node, child, and parent information.
 * @returns A string representing the direction arrow.
 */
export const getDirection = ({
  node,
  parent,
}: {
  node: Coordinates;
  parent: Coordinates | null;
}) => {
  const [r, c] = node;
  let node_to_parent: string | null = null;

  if (parent) {
    const [p_r, p_c] = parent;
    const diff: [number, number] = [r - p_r, c - p_c];
    if (diff[0] === 1) node_to_parent = '↑';
    else if (diff[0] === -1) node_to_parent = '↓';
    else if (diff[1] === 1) node_to_parent = '←';
    else if (diff[1] === -1) node_to_parent = '→';
  }

  return node_to_parent;
};
