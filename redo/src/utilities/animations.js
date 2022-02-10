import { getDimensions } from './maze-structures';

export const finishAnimation = (gridRef) => {
  let animation_queue = [];
  let [rows, cols] = getDimensions(gridRef.current);
  for (let i = 0; i < rows; i++) {
    let finish_animation = [];
    for (let j = 0; j < cols; j++) {
      let tile = gridRef.current[i][j];
      finish_animation.push(() => tile.animate(2));
    }
    animation_queue.push(() => {
      for (let animation of finish_animation) animation();
    });
  }
  return animation_queue;
};

export const connectAnimationGenerator = (gridRef) => (tile) =>
  connectAnimation(gridRef, tile);
const connectAnimation = (gridRef, [r, c]) => {
  let tile = gridRef.current[r][c];
  tile.setVal(0);
  tile.animate(1);
};

export const frontierAnimationGenerator = (gridRef) => (tile) =>
  frontierAnimation(gridRef, tile);
const frontierAnimation = (gridRef, [r, c]) => {
  let tile = gridRef.current[r][c];
  tile.setVal(4);
  tile.animate(1);
};
export const wallAnimationGenerator = (gridRef) => (tile) =>
  wallAnimation(gridRef, tile);
const wallAnimation = (gridRef, [r, c]) => {
  let tile = gridRef.current[r][c];
  tile.setVal(3);
};
export const scanAnimationGenerator = (gridRef) => (tile) =>
  scanAnimation(gridRef, tile);
const scanAnimation = (gridRef, [r, c]) => {
  let tile = gridRef.current[r][c];
  tile.setVal(5);
  // tile.animate(1);
};
export const traverseAnimationGenerator = (gridRef) => (tile) =>
  traverseAnimation(gridRef, tile);
const traverseAnimation = (gridRef, [r, c]) => {
  let tile = gridRef.current[r][c];
  tile.setVal(6);
  tile.animate(1);
};
export const scanAnchorAnimationGenerator = (gridRef) => (tile) =>
  scanAnchorAnimation(gridRef, tile);
const scanAnchorAnimation = (gridRef, [r, c]) => {
  let tile = gridRef.current[r][c];
  tile.setVal(7);
};
