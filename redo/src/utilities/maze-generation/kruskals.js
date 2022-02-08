import { UnionFind } from '../data-structures/union-find';
import { shuffle } from 'lodash';
import { getFullEdges, getStringifiedNodesAndEdges } from '../maze-structures';

export const kruskals = (grid) => {
  let [nodes, edges] = getStringifiedNodesAndEdges(grid);
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
  let result = getFullEdges(selected_edges);
  return result.flat(1);
};
