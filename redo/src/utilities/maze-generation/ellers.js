import { UnionFind } from '../data-structures/union-find';
import {
  getFullEdges,
  getStringifiedNodesAndEdgesByRow,
} from '../maze-structures';

export const ellers = (grid) => {
  let [node_rows, edge_rows] = getStringifiedNodesAndEdgesByRow(grid);
  let selected_edges = [];
  let uf = null,
    next_uf = null;
  for (let i = 0; i < node_rows.length; i++) {
    let row = node_rows[i];
    let next_row = null;
    if (!next_uf) uf = new UnionFind(row);
    else uf = next_uf;
    if (i < node_rows.length - 1) {
      next_uf = new UnionFind(node_rows[i + 1]);
      next_row = node_rows[i + 1];
    }
    //randomly connect adjacent tiles (or all unconnected if last row)
    for (let j = 0; j < row.length - 1; j++) {
      let last_row = !next_row;
      let roll = diceRoll(2) === 2;
      if (!uf.connected(row[j], row[j + 1]) && (last_row || roll)) {
        uf.union(row[j], row[j + 1]);
        selected_edges.push([row[j], row[j + 1]]);
      }
    }
    if (next_row)
      for (let set of uf.sets()) {
        let nodes = [...set];
        let downpath_count = diceRoll(nodes.length);
        let downpath_parents = pickN(nodes, downpath_count);
        let downpath_children = [];
        for (let parent of downpath_parents) {
          let [r, c] = JSON.parse(parent);
          selected_edges.push([parent, JSON.stringify([r + 2, c])]);
          downpath_children.push(JSON.stringify([r + 2, c]));
        }
        //union the nodes in next_uf
        for (let i = 1; i < downpath_children.length; i++)
          next_uf.union(downpath_children[0], downpath_children[i]);
      }
  }
  return getFullEdges(selected_edges).flat(1);
};

const diceRoll = (sides) => {
  return Math.floor(Math.random() * sides) + 1;
};
const pickN = (list, n) => {
  let m = list.length;
  let options = [];
  for (let i = 0; i < m; i++) options[i] = i;
  let choices = [];
  for (let i = 0; i < n; i++) {
    let next_choice = diceRoll(options.length) - 1;
    choices.push(options.splice(next_choice, 1)[0]);
  }
  return choices.map((index) => list[index]);
};
