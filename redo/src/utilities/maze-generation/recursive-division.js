import { traverseFullEdge } from '../algorithm-methods';
import { recursiveDivisionAnimations } from '../animations';
import { getPathNodesByRow } from '../maze-structures';

export const recursiveDivision = (grid) => {
  let animations = [];
  let { animation } = recursiveDivisionAnimations(grid);
  let nodes = getPathNodesByRow(grid);
  let divider = dividePathNodes(grid, nodes, animations, animation);
  // console.log(divider);
  return animations;
};

function dividePathNodes(grid, nodes, animations, animation) {
  let node_rows = nodes.length,
    col_options = nodes[0].length - 1;
  let random_col = Math.floor(Math.random() * col_options);
  let wall_col = nodes[0][random_col][1] + 1;
  let top_coord = [0, wall_col];
  let bottom_coord = [grid.length - 1, wall_col];
  traverseFullEdge(top_coord, bottom_coord, animations, animation);
  return wall_col;
}
