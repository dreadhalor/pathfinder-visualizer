import { EllersSet } from '../data-structures/ellers-set';
import {
  getFullEdges,
  getStringifiedNodesAndEdgesByRow,
} from '../maze-structures';

export const ellers = (grid) => {
  let [node_rows, edge_rows] = getStringifiedNodesAndEdgesByRow(grid);
  let selected_edges = [];
  let ellers_set = null,
    next_ellers_set = null,
    next_row = null;
  for (let i = 0; i < node_rows.length; i++) {
    let last_row = i === node_rows.length - 1;
    let row = node_rows[i];
    ellers_set = next_ellers_set ?? new EllersSet(row);
    next_ellers_set = !last_row && new EllersSet(node_rows[i + 1]);
    next_row = !last_row && node_rows[i + 1];

    //randomly connect adjacent tiles (or all unconnected if last row)
    for (let j = 0; j < row.length - 1; j++) {
      let roll = diceRoll(2) === 2;
      let n1 = row[j],
        n2 = row[j + 1];
      if (!ellers_set.connected(n1, n2) && (last_row || roll)) {
        ellers_set.union(n1, n2);
        selected_edges.push([n1, n2]);
      }
    }
    if (next_row)
      for (let set of ellers_set.sets()) {
        let nodes = [...set];
        let downpath_count = diceRoll(nodes.length);
        let downpath_parents = pickN(nodes, downpath_count);
        let downpath_children = [];
        for (let parent of downpath_parents) {
          let [r, c] = JSON.parse(parent);
          selected_edges.push([parent, JSON.stringify([r + 2, c])]);
          downpath_children.push(JSON.stringify([r + 2, c]));
        }
        //union the nodes in next_ellers_set
        console.log(downpath_children);
        for (let i = 1; i < downpath_children.length; i++)
          next_ellers_set.union(downpath_children[0], downpath_children[i]);
      }
  }
  console.log(ellers_set);
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
