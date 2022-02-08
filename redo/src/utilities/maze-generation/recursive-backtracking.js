import { shuffle } from 'lodash';
import {
  getAdjacencyList,
  getFullEdges,
  expandEdge,
  getNodeAdjacencyList,
} from '../maze-structures';

export const crappy_version = ({ grid, carve_animation, animation_queue }) => {
  let adjacency_list = getAdjacencyList(grid);
  let starting_index = Math.floor(Math.random() * adjacency_list.size);
  let [starting_node, neighbors] = [...adjacency_list.entries()][
    starting_index
  ];
  let pathMap = new Map();
  let leaves = [];
  let visited = new Set();
  let stack = [JSON.parse(starting_node)];
  while (stack.length > 0) {
    let node = stack.pop();
    visited.add(JSON.stringify(node));
    let shuffled_neighbors = shuffle(adjacency_list.get(JSON.stringify(node)));
    if (shuffled_neighbors.length === 0) leaves.push(JSON.stringify(node));
    for (let neighbor of shuffled_neighbors) {
      if (isValidNeighbor(neighbor, visited)) {
        pathMap.set(JSON.stringify(neighbor), node);
        stack.push(neighbor);
      }
    }
  }
  let edges = [];
  for (let [child, parent] of pathMap.entries()) {
    parent = JSON.stringify(parent);
    edges.push([parent, child]);
  }
  let v = [...visited];
  let v2 = v.map((str) => JSON.parse(str));
  //console.log(v2);
  let paths2 = [];
  let branch2 = [];
  for (let i = 0; i < v.length - 1; i++) {
    let [node_r, node_c] = v2[i];
    branch2.push(v[i]);
    let [next_r, next_c] = v2[i + 1];
    if (Math.abs(node_r - next_r + node_c - next_c) !== 2) {
      paths2.push(branch2.slice(0));
      branch2 = [];
    }
  }
  //console.log(paths2); //all branches, non-expanded
  let paths_final_maybe = [];
  for (let branch of paths2) {
    let branch_path = [];
    for (let i = 0; i < branch.length - 1; i++) {
      let node = branch[i];
      let next = branch[i + 1];
      let edge = expandEdge([node, next]);
      branch_path = branch_path.concat(edge);
    }
    branch_path = branch_path.map((coords) => JSON.stringify(coords));
    //console.log(branch_path);
    branch_path = [...new Set(branch_path)];
    // console.log(branch_path);
    paths_final_maybe.push(branch_path);
  }
  paths_final_maybe = paths_final_maybe.filter((branch) => branch.length > 0);
  paths_final_maybe = paths_final_maybe.map((branch) =>
    branch.map((node) => JSON.parse(node))
  );
  // for (let branch of paths_final_maybe) {
  //   for (let [r, c] of branch) {
  //     animation_queue.push(() => carve_animation(grid[r][c]));
  //   }
  // }
  //console.log(paths_final_maybe);
  let path = [];
  for (let i = 0; i < v.length - 1; i++) {
    let node = v[i];
    let next = v[i + 1];
    let edge = [node];
    if (next) edge = expandEdge([node, next]);
    path = path.concat(edge);
  }
  path = path.map((coords) => JSON.stringify(coords));
  path = [...new Set(path)];
  path = path.map((str) => JSON.parse(str));
  let paths = [];
  let branch = [];
  for (let i = 0; i < path.length - 1; i++) {
    let [node_r, node_c] = path[i];
    branch.push(path[i]);
    let [next_r, next_c] = path[i + 1];
    if (Math.abs(node_r - next_r + node_c - next_c) !== 1) {
      paths.push(branch.slice(0));
      branch = [];
    }
  }

  for (let [r, c] of v2) {
    animation_queue.push(() => carve_animation(grid[r][c]));
  }
  let result = getFullEdges(edges).flat(1);
  let end_queue = [];
  for (let [r, c] of result) {
    end_queue.push(() => carve_animation(grid[r][c]));
  }
  animation_queue.push(() => {
    for (let animation of end_queue) animation();
  });

  return result;
};

const isValidNeighbor = (node, visited) => {
  //console.log(!visited.has(JSON.stringify(node)));
  return !visited.has(JSON.stringify(node));
};

export const recursive_backtracking = (grid) => {
  let rows = grid.length,
    cols = grid[0].length;
  let node_rows = Math.ceil(rows / 2),
    node_cols = Math.ceil(cols / 2);
  let adjacency_list = getNodeAdjacencyList(node_rows, node_cols);
  let starting_index = Math.floor(Math.random() * adjacency_list.size);
  let starting_node_id = [...adjacency_list.keys()][starting_index];
  let pathMap = new Map();
  let visited = new Set();
  let stack = [starting_node_id];
  while (stack.length > 0) {
    let node_id = stack.pop();
    visited.add(node_id);
    let shuffled_neighbors = shuffle(adjacency_list.get(node_id));
    for (let neighbor of shuffled_neighbors) {
      if (valid(neighbor, visited)) {
        pathMap.set(neighbor.id, node_id);
        stack.push(neighbor.id);
      }
    }
  }
  let edges = [];
  for (let [child, parent] of pathMap.entries()) {
    parent = JSON.parse(parent).map((coord) => coord * 2);
    child = JSON.parse(child).map((coord) => coord * 2);
    edges.push([JSON.stringify(parent), JSON.stringify(child)]);
  }
  let result = getFullEdges(edges).flat(1);
  return result;
};
const valid = (node, visited) => {
  return !visited.has(node.id);
};
