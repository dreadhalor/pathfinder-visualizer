import './App.scss';
import { v4 as uuidv4 } from 'uuid';
import TopNav from './components/TopNav';
import { useEffect } from 'react';
import GridPane from './components/GridPane';

function App() {
  let rows = 25,
    cols = 40;
  let grid = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push({ uuid: uuidv4(), val: 0 });
    }
    grid.push(row);
  }

  useEffect(() => initializeGrid(), []);

  const saveGrid = () => {
    window.localStorage.setItem('gofuckyourself', JSON.stringify(grid));
  };

  const initializeGrid = () => {
    let stored_grid = checkLocalStorage();
    if (stored_grid) overwriteGrid(JSON.parse(stored_grid));
  };

  const checkLocalStorage = () => {
    let test = window.localStorage.getItem('gofuckyourself');
    return test;
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
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j].getPathVal() === 1) grid[i][j].setPathVal(0);
      }
    }
  };

  const setValue = (square_uuid, val) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let square = grid[i][j];
        let cell_match = square.uuid === square_uuid;
        let val_match = square.val === val;
        if (val === 1 || val === 2) resetPath();
        if (cell_match) {
          if (val === 3 && square.getPathVal() === 1) resetPath();
          if (val_match) square.val = 0;
          else square.val = val;
        } else if (val_match && (val === 1 || val === 2)) {
          square.val = 0;
          //hacky as hell but whatever
          square.setVal(0);
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

  let active_type = {
    active: 1,
  };

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
    JSON.stringify(
      grid.map((row) =>
        row.map((cell) => {
          return { val: cell.val, visited: false };
        })
      )
    );

  const isValidNeighbor = (map, pathMap, row, col) => {
    if (pathMap.has([row, col])) return false;
    let cell = map[row][col];
    return cell.val !== 3 && !cell.visited;
  };

  const solve = () => {
    resetPath();
    let maze_copy = JSON.parse(convertGridToVals());
    let start = getStartNode();
    let end = null;
    let pathMap = new Map();
    let queue = [];
    if (start) queue.push(start);
    while (queue.length > 0) {
      let [r, c] = queue.shift();
      if (maze_copy[r][c].val === 2) {
        end = [r, c];
        queue = [];
        break;
      }
      maze_copy[r][c].visited = true;
      if (r > 0 && isValidNeighbor(maze_copy, pathMap, r - 1, c)) {
        maze_copy[r - 1][c].visited = true;
        queue.push([r - 1, c]);
        pathMap.set(JSON.stringify([r - 1, c]), [r, c]);
      }
      if (r < rows - 1 && isValidNeighbor(maze_copy, pathMap, r + 1, c)) {
        maze_copy[r + 1][c].visited = true;
        queue.push([r + 1, c]);
        pathMap.set(JSON.stringify([r + 1, c]), [r, c]);
      }
      if (c > 0 && isValidNeighbor(maze_copy, pathMap, r, c - 1)) {
        maze_copy[r][c - 1].visited = true;
        queue.push([r, c - 1]);
        pathMap.set(JSON.stringify([r, c - 1]), [r, c]);
      }
      if (c < cols - 1 && isValidNeighbor(maze_copy, pathMap, r, c + 1)) {
        maze_copy[r][c + 1].visited = true;
        queue.push([r, c + 1]);
        pathMap.set(JSON.stringify([r, c + 1]), [r, c]);
      }
    }
    if (end) {
      //solution found
      let reverse_path = [end];
      let next = pathMap.get(JSON.stringify(end));
      while (next) {
        reverse_path.push(next);
        next = pathMap.get(JSON.stringify(next));
      }
      let shortest_path = reverse_path.reverse();
      for (let [r, c] of shortest_path) {
        grid[r][c].setPathVal(1);
      }
    } else alert('No solution found!');
  };

  setValueFunctions();

  return (
    <div className='App site-bg-empty w-full h-full flex flex-col'>
      <TopNav active_type={active_type} setMode={setMode} />
      <GridPane
        grid={grid}
        rows={rows}
        cols={cols}
        active_type={active_type}
        beginSolveFxn={solve}
      />
    </div>
  );
}

export default App;
