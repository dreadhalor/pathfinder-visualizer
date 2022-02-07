import { UnionFind } from '../data-structures/union-find';
import { shuffle } from 'lodash';

export const kruskals = (grid) => {
  let rows = grid?.length ?? 0,
    cols = grid?.[0]?.length ?? 0;
  let nodes = [];
  let edges = [];
  for (let i = 0; i < rows; i += 2) {
    for (let j = 0; j < cols; j += 2) {
      //use strings so no funny business happens with tuple equality
      nodes.push(JSON.stringify([i, j]));
      //bidirectional, so only add edges topleft-to-bottomright to avoid cycles
      if (i < rows - 2) {
        edges.push([JSON.stringify([i, j]), JSON.stringify([i + 2, j])]);
      }
      if (j < cols - 2) {
        edges.push([JSON.stringify([i, j]), JSON.stringify([i, j + 2])]);
      }
    }
  }
  edges = shuffle(edges);
  let selected_edges = [];
  let uf = new UnionFind(nodes);
  while (edges.length > 0) {
    let [n1, n2] = edges.shift();
    if (!uf.connected(n1, n2)) {
      selected_edges.push([n1, n2]);
      uf.union(n1, n2);
    }
  }
  let midpoints = selected_edges.map((tuple) => {
    let [s1, s2] = tuple;
    let [s1_r, s1_c] = JSON.parse(s1);
    let [s2_r, s2_c] = JSON.parse(s2);
    //take the average of the coordinates to find the middle
    return [(s1_r + s2_r) / 2, (s1_c + s2_c) / 2];
  });
  let result = [
    ...nodes.map((stringified_node) => JSON.parse(stringified_node)),
    ...midpoints,
  ];
  return result;
};
