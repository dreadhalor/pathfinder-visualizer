import {
  getRandomUnvisitedNeighbor,
  traverse,
  traverseEdgeForward,
  walk,
} from '../algorithm-methods';
import { GridAdjacencyList } from '../data-structures/grid-adjacency-list';
import { GridSet } from '../data-structures/grid-set';
import { getFullEdges, getMazeAdjacencyList } from '../maze-structures';

export const huntAndKill = (
  grid,
  scan_animation,
  clearScanAnimation,
  wall_animation,
  traverseAnimation
) => {
  let params = {
    adjacency_list: getMazeAdjacencyList(grid),
    visited: new GridSet(),
    edges: new GridAdjacencyList(),
    animations: [],
    forward_animation: traverseAnimation,
    hunt_refs: {
      start: null,
      scanned: new GridSet(),
    },
    wall_animation,
    scan_animation,
    skip_first: true,
  };
  params.node = params.adjacency_list.getRandom();
  traverse(params.node, params.animations, traverseAnimation);

  while (params.node) {
    if (params.hunt_refs.start) traverse(params.node, params.animations, scan_animation);
    walk(params);
    params.animations.push(() => {
      clearScanAnimation(path_set);
    });
    params.node = hunt(params);
    params.animations.push(() => {
      clearScanAnimation(path_set);
    });
    //there is no reason this should work because we're accessing it before initialization up there ^^
    let path_set = new GridSet(getFullEdges(params.edges.entries()).flat(1));
  }
  let result = getFullEdges(params.edges.entries()).flat(1);
  return [result, params.animations];
};

const hunt = ({ hunt_refs, adjacency_list, visited, animations, scan_animation }) => {
  let scanned = new GridSet();
  let crossed_empty_cell = false;
  let node = hunt_refs.start || adjacency_list.at(0);
  let prev_scan = null;
  traverse(node, animations, scan_animation);
  while (node) {
    scanned.add(node);
    if (visited.has(node)) {
      if (!crossed_empty_cell) {
        hunt_refs.start = node;
        hunt_refs.scanned.add(node);
      }
    } else crossed_empty_cell = true;
    if (prev_scan) traverseEdgeForward(prev_scan, node, animations, scan_animation);
    else if (hunt_refs.start)
      traverseEdgeForward(hunt_refs.start, node, animations, scan_animation);
    else traverse(node, animations, scan_animation);
    let is_visited = visited.has(node);
    let neighbors = adjacency_list.get(node);
    if (is_visited && getRandomUnvisitedNeighbor(node, adjacency_list, visited)) return node;
    let unscanned_neighbors = neighbors.filter(
      (neighbor) => !(scanned.has(neighbor) || hunt_refs.scanned.has(neighbor))
    );
    prev_scan = node;
    node = unscanned_neighbors[0];
  }
  return null;
};
