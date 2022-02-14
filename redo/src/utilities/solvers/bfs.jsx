import { GridSet } from '../data-structures/grid-set';

export const bfs = ({
  maze,
  start_coords,
  check_solved_func,
  traversal_animation_func,
  path_animation_func,
  animation_queue,
}) => {
  let maze_copy = JSON.parse(JSON.stringify(maze));
  let rows = maze_copy?.length ?? 0,
    cols = maze_copy?.[0]?.length ?? 0;
  let end = null;
  let pathMap = new Map();
  let queue = [];
  let animate = animation_queue ?? false;
  if (start_coords) {
    queue.push(start_coords);
    pathMap.set(JSON.stringify(start_coords), null);
    if (animate)
      animation_queue.push(() => traversal_animation_func(maze[start_coords[0]][start_coords[1]]));
  }
  let unsolved = true;
  while (queue.length > 0) {
    let round_animations = [];
    let [r, c] = queue.shift();
    if (check_solved_func(maze_copy[r][c])) {
      end = [r, c];
      queue = [];
      break;
    }
    let animation = null;
    if (unsolved && r > 0 && isValidNeighbor(maze_copy, pathMap, r - 1, c)) {
      queue.push([r - 1, c]);
      pathMap.set(JSON.stringify([r - 1, c]), [r, c]);
      if (animate) {
        animation = () => traversal_animation_func(maze[r - 1][c]);
        round_animations.push(animation);
      }
      if (check_solved_func(maze_copy[r - 1][c])) unsolved = false;
    }
    if (unsolved && r < rows - 1 && isValidNeighbor(maze_copy, pathMap, r + 1, c)) {
      queue.push([r + 1, c]);
      pathMap.set(JSON.stringify([r + 1, c]), [r, c]);
      if (animate) {
        animation = () => traversal_animation_func(maze[r + 1][c]);
        round_animations.push(animation);
      }
      if (check_solved_func(maze_copy[r + 1][c])) unsolved = false;
    }
    if (unsolved && c > 0 && isValidNeighbor(maze_copy, pathMap, r, c - 1)) {
      queue.push([r, c - 1]);
      pathMap.set(JSON.stringify([r, c - 1]), [r, c]);
      if (animate) {
        animation = () => traversal_animation_func(maze[r][c - 1]);
        round_animations.push(animation);
      }
      if (check_solved_func(maze_copy[r][c - 1])) unsolved = false;
    }
    if (unsolved && c < cols - 1 && isValidNeighbor(maze_copy, pathMap, r, c + 1)) {
      queue.push([r, c + 1]);
      pathMap.set(JSON.stringify([r, c + 1]), [r, c]);
      if (animate) {
        animation = () => traversal_animation_func(maze[r][c + 1]);
        round_animations.push(animation);
      }
      if (check_solved_func(maze_copy[r][c + 1])) unsolved = false;
    }
    if (round_animations.length > 0 && animate)
      animation_queue.push(() => {
        for (let animation of round_animations) animation();
      });
  }
  if (end) {
    //solution found
    let reverse_path = [end];
    let next = pathMap.get(JSON.stringify(end));
    while (next) {
      reverse_path.push(next);
      next = pathMap.get(JSON.stringify(next));
    }
    for (let i = 0; i < reverse_path.length; i++) {
      let [r, c] = reverse_path[i];
      if (animate) animation_queue.push(() => path_animation_func(maze[r][c]));
    }
  }
  return end;
};

const isValidNeighbor = (map, pathMap, row, col) => {
  if (pathMap.has(JSON.stringify([row, col]))) return false;
  let val = map[row][col].val;
  return val !== 3;
};

export const bfs_raw = ({ maze, start_coords, solution_func }) => {
  let rows = maze?.length ?? 0,
    cols = maze?.[0]?.length ?? 0;
  let visited = new GridSet();
  let queue = [];
  if (start_coords) {
    queue.push(start_coords);
    visited.add(start_coords);
  }
  while (queue.length > 0) {
    let [r, c] = queue.shift();
    if (solution_func(maze[r][c])) return [r, c];
    if (r > 0 && !visited.has([r - 1, c])) {
      queue.push([r - 1, c]);
      visited.add([r - 1, c]);
    }
    if (r < rows - 1 && !visited.has([r + 1, c])) {
      queue.push([r + 1, c]);
      visited.add([r + 1, c]);
    }
    if (c > 0 && !visited.has([r, c - 1])) {
      queue.push([r, c - 1]);
      visited.add([r, c - 1]);
    }
    if (c < cols - 1 && !visited.has([r, c + 1])) {
      queue.push([r, c + 1]);
      visited.add([r, c + 1]);
    }
  }
  return null;
};
