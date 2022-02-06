import './App.scss';
import { v4 as uuidv4 } from 'uuid';
import TopNav from './components/TopNav';
import { useEffect, useState } from 'react';
import GridPane from './components/GridPane';

let animation_queue = [];

function App() {
  const localStorageName = 'grid';
  const useArrows = {
    on_path: false,
    on_traversed: false,
  };

  const [mode, setMode] = useState(3);

  const rows = 25,
    cols = 40;
  const createNewGrid = () => {
    let new_grid = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push({ uuid: uuidv4(), val: 0, mode });
      }
      new_grid.push(row);
    }
    return new_grid;
  };

  const [solved, setSolved] = useState(false);
  const [grid, setGrid] = useState(createNewGrid());

  const animation_delay = 5;
  const animation_threads = 4;
  const flushAnimationQueue = () => (animation_queue = []);
  const animate = () => {
    for (let i = 0; i < animation_threads; i++) {
      setTimeout(animateAll, animation_delay * i);
    }
  };
  function animateAll() {
    let animation = animation_queue.shift();
    if (animation) {
      animation();
      setTimeout(animateAll, animation_delay * animation_threads);
    }
  }
  const checkSetSquarePathVal = (square) => {
    let pathVal = square.getPathVal();
    if (pathVal) {
      square.setPathVal(3);
      if (square.direction) square.direction = null;
    }
    return square;
  };
  const resetPath = () => {
    flushAnimationQueue();
    setSolved(false);
    executeOnAllTiles((tile) => checkSetSquarePathVal(tile));
  };

  const executeOnAllTiles = (func) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        func(grid[i][j]);
      }
    }
  };

  useEffect(() => initializeGrid(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveGrid = () => {
    window.localStorage.setItem(
      localStorageName,
      JSON.stringify(getGridModel())
    );
    window.localStorage.removeItem('gofuckyourself');
  };

  const getGridModel = () => {
    return grid.map((row) =>
      row.map((square) => {
        return {
          uuid: square.uuid,
          val: square.val,
        };
      })
    );
  };

  const initializeGrid = () => {
    setValueFunctions();
    let stored_grid = checkLocalStorage();
    if (stored_grid) overwriteGrid(JSON.parse(stored_grid));
  };

  const checkLocalStorage = () => {
    let replace_this = window.localStorage.getItem('gofuckyourself');
    let test = window.localStorage.getItem(localStorageName);
    return replace_this ?? test;
  };

  const overwriteGrid = (new_grid) => {
    setGrid((prev_grid) =>
      prev_grid.map((row, row_index) =>
        row.map((square, col_index) => {
          square.uuid = new_grid[row_index][col_index].uuid;
          square.val = new_grid[row_index][col_index].val;
          return square;
        })
      )
    );
  };

  const setValueFunctions = () =>
    executeOnAllTiles((tile) => (tile.setValue = setValue));

  const checkSetSquareValue = (
    candidate_square,
    square_uuid,
    val,
    disallow_toggle
  ) => {
    let cell_match = candidate_square.uuid === square_uuid;
    let val_match = candidate_square.val === val;
    if (cell_match && val_match && !disallow_toggle) {
      console.log('toggling back to 0');
      candidate_square.val = 0;
    } else if (cell_match) {
      if ((val && candidate_square.val) || candidate_square.getPathVal() === 1)
        resetPath();
      // if (candidate_square.getPathVal() === 1) resetPath();
      console.log(candidate_square.val + ' trying to be set to ' + val);
      candidate_square.val = val;
      console.log(candidate_square.val + ' is the new val');
    } else if (val_match) {
      if (val === 1 || val === 2) candidate_square.val = 0;
    }
    return candidate_square;
  };
  const setValue = (square_uuid, val, disallow_toggle) => {
    if (val === 1 || val === 2 || (val === 3 && animation_queue.length > 0)) {
      resetPath();
    }
    setGrid((prev_grid) =>
      prev_grid.map((row) =>
        row.map((square) =>
          checkSetSquareValue(square, square_uuid, val, disallow_toggle)
        )
      )
    );
    saveGrid();
  };

  // const setMode = (mode) => {
  //   setGrid((prev_grid) =>
  //     prev_grid.map((row) =>
  //       row.map((square) => {
  //         square.mode = mode;
  //         return square;
  //       })
  //     )
  //   );
  // };

  const getStartNodes = () => {
    let result = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j].val === 1) result.push([i, j]);
      }
    }
    return result;
  };
  const getStartNode = () => {
    let result = getStartNodes();
    if (result.length > 0) return result[0];
    return null;
  };

  const convertGridToVals = () =>
    JSON.stringify(grid.map((row) => row.map((cell) => cell.val)));

  const isValidNeighbor = (map, pathMap, row, col) => {
    if (pathMap.has(JSON.stringify([row, col]))) return false;
    let val = map[row][col];
    return val !== 3; // && !cell.visited;
  };

  const solve = () => {
    resetPath();
    let maze_copy = JSON.parse(convertGridToVals());
    let start = getStartNode();
    let end = null;
    let pathMap = new Map();
    let queue = [];
    if (start) {
      queue.push(start);
      pathMap.set(JSON.stringify(start), null);
      animation_queue.push(() => grid[start[0]][start[1]].setPathVal(2));
    }
    let unsolved = true;
    while (queue.length > 0) {
      let round_animations = [];
      let [r, c] = queue.shift();
      if (maze_copy[r][c] === 2) {
        end = [r, c];
        queue = [];
        break;
      }
      let animation = null;
      if (unsolved && r > 0 && isValidNeighbor(maze_copy, pathMap, r - 1, c)) {
        queue.push([r - 1, c]);
        pathMap.set(JSON.stringify([r - 1, c]), [r, c]);
        animation = () => {
          //grid[r - 1][c].setPathVal(2);
          grid[r - 1][c].setPathVal(2);
          if (useArrows.on_traversed) grid[r - 1][c].direction = '↓';
        };
        round_animations.push(animation);
        if (maze_copy[r - 1][c] === 2) unsolved = false;
      }
      if (
        unsolved &&
        r < rows - 1 &&
        isValidNeighbor(maze_copy, pathMap, r + 1, c)
      ) {
        queue.push([r + 1, c]);
        pathMap.set(JSON.stringify([r + 1, c]), [r, c]);
        animation = () => {
          //grid[r + 1][c].setPathVal(2);
          grid[r + 1][c].setPathVal(2);
          if (useArrows.on_traversed) grid[r + 1][c].direction = '↑';
        };
        round_animations.push(animation);
        if (maze_copy[r + 1][c] === 2) unsolved = false;
      }
      if (unsolved && c > 0 && isValidNeighbor(maze_copy, pathMap, r, c - 1)) {
        queue.push([r, c - 1]);
        pathMap.set(JSON.stringify([r, c - 1]), [r, c]);
        animation = () => {
          //grid[r][c - 1].setPathVal(2);
          grid[r][c - 1].setPathVal(2);
          if (useArrows.on_traversed) grid[r][c - 1].direction = '→';
        };
        round_animations.push(animation);
        if (maze_copy[r][c - 1] === 2) unsolved = false;
      }
      if (
        unsolved &&
        c < cols - 1 &&
        isValidNeighbor(maze_copy, pathMap, r, c + 1)
      ) {
        queue.push([r, c + 1]);
        pathMap.set(JSON.stringify([r, c + 1]), [r, c]);
        animation = () => {
          //grid[r][c + 1].setPathVal(2);
          grid[r][c + 1].setPathVal(2);
          if (useArrows.on_traversed) grid[r][c + 1].direction = '←';
        };
        round_animations.push(animation);
        if (maze_copy[r][c + 1] === 2) unsolved = false;
      }
      if (round_animations.length > 0)
        animation_queue.push(() => {
          for (let animation of round_animations) animation();
        });
    }
    if (end) {
      //solution found
      setSolved(true);
      let reverse_path = [end];
      let next = pathMap.get(JSON.stringify(end));
      while (next) {
        reverse_path.push(next);
        next = pathMap.get(JSON.stringify(next));
      }
      for (let i = 0; i < reverse_path.length; i++) {
        let [r, c] = reverse_path[i];
        //animation_queue.push(() => grid[r][c].setPathVal(1));
        animation_queue.push(() => {
          grid[r][c].setPathVal(1);
          if (useArrows.on_path) {
            let child = reverse_path[i - 1];
            if (child) {
              let [c_r, c_c] = child;
              let diff = [r - c_r, c - c_c];
              if (diff[0] === 1) grid[r][c].direction = '↑';
              else if (diff[0] === -1) grid[r][c].direction = '↓';
              else if (diff[1] === 1) grid[r][c].direction = '←';
              else if (diff[1] === -1) grid[r][c].direction = '→';
            }
          }
        });
      }
      animate();
    } else alert('No solution found!');
  };

  return (
    <div
      className='App site-bg-empty w-full h-full flex flex-col'
      onContextMenu={(e) => e.preventDefault()}
    >
      <TopNav mode={mode} setMode={setMode} />
      <GridPane
        grid={grid}
        rows={rows}
        mode={mode}
        cols={cols}
        beginSolveFxn={solve}
        solved={solved}
        resetPath={resetPath}
      />
    </div>
  );
}

export default App;
