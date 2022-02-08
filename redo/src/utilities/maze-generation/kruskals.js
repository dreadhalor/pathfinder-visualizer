import { shuffle } from 'lodash';
import { getFullEdges2, getNodesAndEdges } from '../maze-structures';
import { GridUnionFind } from '../data-structures/grid-union-find';

export const kruskals = (grid) => {
  let [nodes, edges] = getNodesAndEdges(grid);
  edges = shuffle(edges);
  let selected_edges = [];
  let uf = new GridUnionFind(nodes);
  while (edges.length > 0) {
    let [n1, n2] = edges.shift();
    if (!uf.connected(n1, n2)) {
      selected_edges.push([n1, n2]);
      uf.union(n1, n2);
    }
  }
  let result = getFullEdges2(selected_edges);
  return result.flat(1);
};
