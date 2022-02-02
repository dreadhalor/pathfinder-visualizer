import './App.scss';
import { v4 as uuidv4 } from 'uuid';
import TopNav from './components/TopNav';
import { useEffect, useState } from 'react';
import GridPane from './components/GridPane';

let animation_queue = [];

function App() {
  const localStorageName = 'grid';

  let rows = 25,
    cols = 40;
  const createNewGrid = () => {
    let new_grid = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push({ uuid: uuidv4(), val: 0 });
      }
      new_grid.push(row);
    }
    return new_grid;
  };

  const [solved, setSolved] = useState(false);
  const [grid, setGrid] = useState(createNewGrid());
  const [active_type, setActiveType] = useState(1);

  const animation_delay = 5;
  const flushAnimationQueue = () => (animation_queue = []);
  const animate = () => animateAll();
  function animateAll() {
    let animation = animation_queue.shift();
    if (animation) {
      animation();
      setTimeout(animateAll, animation_delay);
    }
  }

  useEffect(() => initializeGrid(), []);

  const saveGrid = () => {
    window.localStorage.setItem(localStorageName, JSON.stringify(grid));
    window.localStorage.removeItem('gofuckyourself');
  };

  const initializeGrid = () => {
    let stored_grid = checkLocalStorage();
    if (stored_grid) overwriteGrid(JSON.parse(stored_grid));
  };

  const checkLocalStorage = () => {
    let replace_this = window.localStorage.getItem('gofuckyourself');
    let test = window.localStorage.getItem(localStorageName);
    return replace_this ?? test;
  };

  const overwriteGrid = (new_grid) => {
    if (new_grid) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let square = grid[i][j];
          square.uuid = new_grid[i][j].uuid;
          square.val = new_grid[i][j].val;
          square.setVal(square.val);
        }
      }
      setValueFunctions();
    }
  };

  const setValueFunctions = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].setValue = setValue;
      }
    }
  };

  const resetPath = () => {
    flushAnimationQueue();
    setSolved(false);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j].getPathVal() !== 0) {
          grid[i][j].setPathVal(0);
        }
      }
    }
  };

  const setValue = (square_uuid, val) => {
    if (val === 1 || val === 2 || (val === 3 && animation_queue.length > 0)) {
      resetPath();
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let square = grid[i][j];
        let cell_match = square.uuid === square_uuid;
        let val_match = square.val === val;
        if (cell_match && val_match) {
          square.val = 0;
        } else if (cell_match) {
          if (square.val || square.getPathVal() === 1) resetPath();
          square.val = val;
        } else if (val_match) {
          if (val === 1 || val === 2) {
            square.val = 0;
            square.setVal(0); //change eventually so state is more centralized
          }
        }
      }
    }
    saveGrid();
  };

  const setMode = (mode) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].setMode(mode);
      }
    }
  };

  // let active_type = {
  //   active: 1,
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
      let [r, c] = queue.shift();
      if (maze_copy[r][c] === 2) {
        end = [r, c];
        queue = [];
        break;
      }
      if (unsolved && r > 0 && isValidNeighbor(maze_copy, pathMap, r - 1, c)) {
        queue.push([r - 1, c]);
        pathMap.set(JSON.stringify([r - 1, c]), [r, c]);
        animation_queue.push(() => grid[r - 1][c].setPathVal(2));
        if (maze_copy[r - 1][c] === 2) unsolved = false;
      }
      if (
        unsolved &&
        r < rows - 1 &&
        isValidNeighbor(maze_copy, pathMap, r + 1, c)
      ) {
        queue.push([r + 1, c]);
        pathMap.set(JSON.stringify([r + 1, c]), [r, c]);
        animation_queue.push(() => grid[r + 1][c].setPathVal(2));
        if (maze_copy[r + 1][c] === 2) unsolved = false;
      }
      if (unsolved && c > 0 && isValidNeighbor(maze_copy, pathMap, r, c - 1)) {
        queue.push([r, c - 1]);
        pathMap.set(JSON.stringify([r, c - 1]), [r, c]);
        animation_queue.push(() => grid[r][c - 1].setPathVal(2));
        if (maze_copy[r][c - 1] === 2) unsolved = false;
      }
      if (
        unsolved &&
        c < cols - 1 &&
        isValidNeighbor(maze_copy, pathMap, r, c + 1)
      ) {
        queue.push([r, c + 1]);
        pathMap.set(JSON.stringify([r, c + 1]), [r, c]);
        animation_queue.push(() => grid[r][c + 1].setPathVal(2));
        if (maze_copy[r][c + 1] === 2) unsolved = false;
      }
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
        animation_queue.push(() => grid[r][c].setPathVal(1));
      }
      animate();
    } else alert('No solution found!');
  };

  setValueFunctions();

  return (
    <div className='App site-bg-empty w-full h-full flex flex-col'>
      <TopNav
        active_type={active_type}
        setActiveType={setActiveType}
        setMode={setMode}
      />
      <GridPane
        grid={grid}
        rows={rows}
        cols={cols}
        active_type={active_type}
        beginSolveFxn={solve}
        solved={solved}
        resetPath={resetPath}
      />
    </div>
  );
}

export default App;
