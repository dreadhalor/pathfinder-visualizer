import { traverse } from '../algorithm-methods';
import { recursiveDivisionAnimations } from '../animations';
import { GridSet } from '../data-structures/grid-set';
import { expandEdge, getPathNodesByRow } from '../maze-structures';

export const recursiveDivision = (grid, iterator, direction = 0) => {
  // console.log(grid);
  if (grid.length < 1 || grid[0].length < 1) {
    // console.log('terminating');
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
  // console.log('direction: ' + direction);
  if (!direction) {
    let divider = dividePathNodes(grid, nodes, animations, animation);
    if (divider < 1) return animations;
    // animations.concat()
    // console.log('middle vertical: ' + divider);
    grid_left = grid.map((row) => row.slice(0, divider));
    // console.log('grid_left');
    // console.log(grid_left);
    nodes_left = getPathNodesByRow(grid_left);
    grid_right = grid.map((row) => row.slice(divider + 1));
    // console.log('grid_right');
    // console.log(grid_right);
    nodes_right = getPathNodesByRow(grid_right);
    left = recursiveDivision(grid_left, iterator, !direction);
    right = recursiveDivision(grid_right, iterator, !direction);
  } else {
    // console.log('grid length: ' + grid.length);
    let divider = dividePathNodesHorizontally(grid, nodes, animations, animation);
    if (divider < 1) return animations;
    // animations.concat()
    // console.log('middle horizontal: ' + divider);
    grid_left = grid.slice(0, divider);
    // console.log('grid_left');
    // console.log(grid_left);
    nodes_left = getPathNodesByRow(grid_left);
    grid_right = grid.slice(divider + 1);
    // console.log('grid_right');
    // console.log(grid_right);
    nodes_right = getPathNodesByRow(grid_right);
    left = recursiveDivision(grid_left, iterator, !direction);
    right = recursiveDivision(grid_right, iterator, !direction);
  }

  // let left = dividePathNodes(
  //   grid_left,
  //   nodes_left,
  //   animations,
  //   recursiveDivisionAnimations(grid_left).animation
  // );

  // let right = dividePathNodes(
  //   grid_right,
  //   nodes_right,
  //   animations,
  //   recursiveDivisionAnimations(grid_right).animation
  // );

  // console.log(divider);
  if (left.length > 0) animations = animations.concat(left);
  // else console.log('left is empty');
  if (right.length > 0) animations = animations.concat(right);
  // else console.log('right is empty');
  //if (right.length > 0) animations = animations.concat(right);
  // console.log('animations length: ' + animations.length);
  // console.log('animations: ' + animations);
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
  // edge.popRandom();
  let tiles = edge.toArray();
  for (let tile of tiles) {
    traverse(tile, animations, animation);
  }
  // traverseFullEdge(edge.at(0), edge.at(edge.size() - 1), animations, animation);
  return wall_col;
}
function dividePathNodesHorizontally(grid, nodes, animations, animation) {
  let row_options = nodes.length - 1;
  // console.log(row_options);
  // console.log(nodes);
  if (row_options < 1) return -1;
  let random_row = Math.floor(Math.random() * row_options);
  random_row = random_row - (random_row % 2);
  // console.log(random_row);
  let wall_row = random_row + 1;
  let start_coord = [wall_row, 0];
  let end_coord = [wall_row, grid[0].length - 1];
  let edge = new GridSet(expandEdge([start_coord, end_coord]));
  let prenormalized_hole_x = Math.floor(Math.random() * grid[0].length);
  let whatever = prenormalized_hole_x - (prenormalized_hole_x % 2);
  let hole = edge.at(whatever);
  edge.delete(hole);
  // edge.popRandom();
  let tiles = edge.toArray();
  for (let tile of tiles) {
    traverse(tile, animations, animation);
  }
  // traverseFullEdge(edge.at(0), edge.at(edge.size() - 1), animations, animation);
  return wall_row;
}
