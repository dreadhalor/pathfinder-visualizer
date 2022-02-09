import { shuffle } from 'lodash';
import { expandEdge, getFullEdges, getNodesAndEdges } from '../maze-structures';
import { GridUnionFind } from '../data-structures/grid-union-find';

export const kruskals = (grid, animation) => {
  let animations = [];
  let [nodes, edges] = getNodesAndEdges(grid);
  edges = shuffle(edges);
  let selected_edges = [];
  let uf = new GridUnionFind(nodes);
  while (edges.length > 0) {
    let [n1, n2] = edges.shift();
    if (!uf.connected(n1, n2)) {
      selected_edges.push([n1, n2]);
      if (animation) animations.push(animate(n1, n2, animation));
      uf.union(n1, n2);
    }
  }
  let result = getFullEdges(selected_edges);
  return [result.flat(1), animations];
};

const animate = (n1, n2, animation) => {
  let edge = expandEdge([n1, n2]);
  return () => {
    for (let node of edge) animation(node);
  };
};
