import { shuffle } from 'lodash';
import { expandEdge, getFullEdges, getNodesAndEdges } from '../maze-structures';
import { GridUnionFind } from '../data-structures/grid-union-find';

export const kruskals = (grid, connectAnimation) => {
  let animations = [];
  let [nodes, possible_edges] = getNodesAndEdges(grid);
  possible_edges = shuffle(possible_edges);
  let selected_edges = [];
  let uf = new GridUnionFind(nodes);
  while (possible_edges.length > 0) {
    let [n1, n2] = possible_edges.shift();
    if (!uf.connected(n1, n2))
      connect(n1, n2, selected_edges, uf, animations, connectAnimation);
  }
  let result = getFullEdges(selected_edges);
  return [result.flat(1), animations];
};

const connect = (n1, n2, edges, uf, animations, connectAnimation) => {
  edges.push([n1, n2]);
  uf.union(n1, n2);
  let edge = expandEdge([n1, n2]);
  if (connectAnimation)
    animations.push(() => {
      for (let node of edge) connectAnimation(node);
    });
};
