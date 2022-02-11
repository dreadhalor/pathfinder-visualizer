import { getDimensions } from './maze-structures';

export const finishAnimation = (grid) => {
  let animation_queue = [];
  let [rows, cols] = getDimensions(grid);
  for (let i = 0; i < rows; i++) {
    let finish_animation = [];
    for (let j = 0; j < cols; j++) {
      let tile = grid[i][j];
      finish_animation.push(() => tile.animate(2));
    }
    animation_queue.push(() => {
      for (let animation of finish_animation) animation();
    });
  }
  return animation_queue;
};

export const connectAnimationGenerator = (grid) => (tile) => connectAnimation(grid, tile);
const connectAnimation = (grid, [r, c]) => {
  let tile = grid[r][c];
  tile.setVal(0);
  tile.animate(1);
};
export const popAnimationGenerator = (grid) => (tile) => popAnimation(grid, tile);
const popAnimation = (grid, [r, c]) => {
  let tile = grid[r][c];
  tile.animate(2);
};

export const frontierAnimationGenerator = (grid) => (tile) => frontierAnimation(grid, tile);
const frontierAnimation = (grid, [r, c]) => {
  let tile = grid[r][c];
  tile.setVal(4);
  tile.animate(1);
};
export const wallAnimationGenerator = (grid) => (tile) => wallAnimation(grid, tile);
const wallAnimation = (grid, [r, c]) => {
  let tile = grid[r][c];
  tile.setVal(3);
};
export const scanAnimationGenerator = (grid) => (tile) => scanAnimation(grid, tile);
const scanAnimation = (grid, [r, c]) => {
  let tile = grid[r][c];
  tile.setVal(5);
  // tile.animate(1);
};
export const traverseAnimationGenerator = (grid) => (tile) => traverseAnimation(grid, tile);
const traverseAnimation = (grid, [r, c]) => {
  let tile = grid[r][c];
  tile.setVal(6);
  tile.animate(1);
};
export const scanAnchorAnimationGenerator = (grid) => (tile) => scanAnchorAnimation(grid, tile);
const scanAnchorAnimation = (grid, [r, c]) => {
  let tile = grid[r][c];
  tile.setVal(7);
};

export const displayValAnimationGenerator = (grid) => (tile, displayVal) =>
  displayValAnimation(grid, tile, displayVal);
const displayValAnimation = (grid, [r, c], displayVal) => {
  let tile = grid[r][c];
  tile.setDisplayVal(displayVal);
};
