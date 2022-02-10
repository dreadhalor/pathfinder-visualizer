import { shuffle } from 'lodash';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import {
  expandEdge,
  getFullEdges,
  getMazeAdjacencyList,
} from '../maze-structures';

export const huntAndKill = (
  grid,
  forward_animation,
  scan_animation,
  clearScanAnimation,
  wall_animation,
  traverseAnimation,
  scanAnchorAnimation
) => {
  let animations = [];
  const adjacency_list = getMazeAdjacencyList(grid);
  let grid_copy = JSON.parse(JSON.stringify(grid));
  let edges = new GridAdjacencyList();
  let visited = new GridSet();
  let next = adjacency_list.getRandom();
  traverse(next, animations, traverseAnimation);
  let connector = null;
  let hunt_start_ref = {
    start: null,
    scanned: new GridSet(),
  };

  while (next) {
    if (connector) {
      traverseEdgeForward(connector, next, animations, forward_animation);
      edges.set(next, connector);
    }
    if (hunt_start_ref.start) {
      traverse(next, animations, scanAnchorAnimation);
    }
    walk(
      next,
      adjacency_list,
      visited,
      edges,
      hunt_start_ref,
      animations,
      traverseAnimation,
      scanAnchorAnimation
    );
    grid_copy = JSON.parse(JSON.stringify(grid));
    animations.push(() => {
      clearScanAnimation(visited_copy, path_set);
    });
    [next, connector] = hunt(
      hunt_start_ref,
      adjacency_list,
      visited,
      animations,
      scan_animation,
      forward_animation,
      grid_copy,
      wall_animation
    );
    animations.push(() => {
      clearScanAnimation(visited_copy, path_set);
    });
    let visited_copy = visited.clone();
    let path_set = new GridSet(getFullEdges(edges.entries()).flat(1));
  }
  let result = getFullEdges(edges.entries()).flat(1);
  return [result, animations];
};

function traverse(node, animations, animation) {
  animations.push(() => animation(node));
}
function traverseEdgeForward(n1, n2, animations, animation) {
  let edge = expandEdge([n1, n2]);
  for (let i = 1; i < edge.length; i++) {
    traverse(edge[i], animations, animation);
  }
}

const walk = (
  node,
  adjacency_list,
  visited,
  edges,
  hunt_start_ref,
  animations,
  animation,
  scanAnchorAnimation
) => {
  // if (hunt_start_ref.start)
  //   traverse(hunt_start_ref.start, animations, scanAnchorAnimation);
  while (node) {
    visited.add(node);
    let shuffled_unvisited_neighbors = shuffle(
      adjacency_list.get(node).filter((neighbor) => !visited.has(neighbor))
    );
    let next = shuffled_unvisited_neighbors[0];
    if (next) {
      edges.set(next, node);
      traverseEdgeForward(node, next, animations, animation);
    } else return node;
    node = next;
  }
  return null;
};
const hunt = (
  hunt_start_ref,
  adjacency_list,
  visited,
  animations,
  scan_animation,
  forward_animation,
  grid_copy,
  wall_animation
) => {
  let scanned = new GridSet();
  let crossed_empty_cell = false;
  let node = hunt_start_ref.start || adjacency_list.at(0);
  let prev_scan = null;
  traverse(node, animations, scan_animation);
  while (node) {
    scanned.add(node);
    if (visited.has(node)) {
      if (!crossed_empty_cell) {
        hunt_start_ref.start = node;
        hunt_start_ref.scanned.add(node);
      }
    } else crossed_empty_cell = true;
    if (prev_scan)
      traverseEdgeForward(prev_scan, node, animations, scan_animation);
    else if (hunt_start_ref.start) {
      traverseEdgeForward(
        hunt_start_ref.start,
        node,
        animations,
        scan_animation
      );
    } else traverse(node, animations, scan_animation);
    //if (!visited.has(node))
    let is_visited = visited.has(node);
    let neighbors = adjacency_list.get(node);
    let shuffled_visited_neighbors = shuffle(
      neighbors.filter((neighbor) => visited.has(neighbor))
    );
    let shuffled_unvisited_neighbors = shuffle(
      neighbors.filter((neighbor) => !visited.has(neighbor))
    );
    let next_start = shuffled_unvisited_neighbors[0];
    if (is_visited && next_start) return [node, null];
    let unscanned_neighbors = neighbors.filter(
      (neighbor) =>
        !(scanned.has(neighbor) || hunt_start_ref.scanned.has(neighbor))
    );
    //scanned.add(node);
    let connector = shuffled_visited_neighbors[0];
    // if (!visited.has(node) && connector) return [node, connector];
    prev_scan = node;
    node = unscanned_neighbors[0];
  }
  return [null, null];
};
