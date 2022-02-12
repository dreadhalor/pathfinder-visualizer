import { traverse } from '../algorithm-methods';
import { recursiveDivisionAnimations } from '../animations';
import { GridSet } from '../data-structures/grid-set';
import { expandEdge, getPathNodesByRow } from '../maze-structures';
import { coinFlips } from '../randomizers';

export const recursiveDivision = (grid, iterator) => {
  let width = grid.length ?? 0,
    height = grid[0]?.length ?? 0;
  if (width < 1 || height < 1) {
    return [];
  }
  // if (iterator-- < 0) return [];
  let animations = [];
  let { animation } = recursiveDivisionAnimations(grid);
  let nodes = getPathNodesByRow(grid);
  let grid_left = null,
    nodes_left = [];
  let grid_right = null,
    nodes_right = [];
  let left = [],
    right = [];
  if (width < height) {
    // if (coinFlips(1)) {
    let divider = dividePathNodes(grid, nodes, animations, animation);
    if (divider < 1) return animations;
    grid_left = grid.map((row) => row.slice(0, divider));
    nodes_left = getPathNodesByRow(grid_left);
    grid_right = grid.map((row) => row.slice(divider + 1));
    nodes_right = getPathNodesByRow(grid_right);
    left = recursiveDivision(grid_left, iterator);
    right = recursiveDivision(grid_right, iterator);
  } else {
    let divider = dividePathNodesHorizontally(grid, nodes, animations, animation);
    if (divider < 1) return animations;
    grid_left = grid.slice(0, divider);
    nodes_left = getPathNodesByRow(grid_left);
    grid_right = grid.slice(divider + 1);
    nodes_right = getPathNodesByRow(grid_right);
    left = recursiveDivision(grid_left, iterator);
    right = recursiveDivision(grid_right, iterator);
  }
  if (left.length > 0) animations = animations.concat(left);
  if (right.length > 0) animations = animations.concat(right);
  return animations;
};

function dividePathNodes(grid, nodes, animations, animation) {
  let col_options = nodes?.[0].length - 1 ?? -1;
  if (col_options < 1) return -1;
  let random_col = Math.floor(Math.random() * col_options);
  let wall_col = nodes[0][random_col][1] + 1;
  let start_coords = [0, wall_col];
  let end_coords = [grid.length - 1, wall_col];
  let edge = new GridSet(expandEdge([start_coords, end_coords]));
  let prenormalized_hole_y = Math.floor(Math.random() * grid.length);
  let whatever = prenormalized_hole_y - (prenormalized_hole_y % 2);
  let hole = edge.at(whatever);
  edge.delete(hole);
  let tiles = edge.toArray();
  for (let tile of tiles) traverse(tile, animations, animation);
  return wall_col;
}
function dividePathNodesHorizontally(grid, nodes, animations, animation) {
  let row_options = nodes.length - 1;
  if (row_options < 1) return -1;
  let random_row = Math.floor(Math.random() * row_options);
  random_row = random_row - (random_row % 2);
  let wall_row = random_row + 1;
  let start_coord = [wall_row, 0];
  let end_coord = [wall_row, grid[0].length - 1];
  let edge = new GridSet(expandEdge([start_coord, end_coord]));
  let prenormalized_hole_x = Math.floor(Math.random() * grid[0].length);
  let whatever = prenormalized_hole_x - (prenormalized_hole_x % 2);
  let hole = edge.at(whatever);
  edge.delete(hole);
  let tiles = edge.toArray();
  for (let tile of tiles) traverse(tile, animations, animation);
  return wall_row;
}
