import { GridUnionFind } from '../data-structures/grid-union-find';
import { getFullEdges, getPathNodesByRow } from '../maze-structures';
import { coinFlips, pickN } from '../randomizers';

export const ellers = (grid) => {
  let rows = getPathNodesByRow(grid);
  let selected_edges = [];
  let sets = new GridUnionFind();
  for (let i = 0; i < rows.length; i++) {
    let last_row = i === rows.length - 1;
    let row = rows[i];
    sets.addMultiple(row);
    let h = horizontals(row, sets, selected_edges, last_row);
    let v = verticals(sets, selected_edges, last_row);
    //clear current row in preparation for the next
    sets.removeMultiple(row);
  }
  return getFullEdges(selected_edges).flat(1);
};

//randomly connect adjacent tiles (or all unconnected if last row)
const horizontals = (row, sets, edges, last_row) => {
  let count = 0;
  for (let j = 0; j < row.length - 1; j++) {
    let flip = coinFlips(1);
    let n1 = row[j],
      n2 = row[j + 1];
    let connected = sets.connected(n1, n2);
    if (!connected && (last_row || flip)) {
      sets.union(n1, n2);
      edges.push([n1, n2]);
      count++;
    }
  }
  return count;
};
//connect downpaths
const verticals = (sets, edges, last_row) => {
  let count = 0;
  if (last_row) return count;
  for (let set of sets.sets()) {
    let flip = coinFlips(set.length);
    let downpath_parents = pickN(set, flip || 1);
    for (let parent of downpath_parents) {
      let [r, c] = parent;
      let child = [r + 2, c];
      sets.add(child);
      sets.union(parent, child);
      edges.push([parent, child]);
      count++;
    }
  }
  return count;
};
