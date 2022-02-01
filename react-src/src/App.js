import './App.scss';
import { v4 as uuidv4 } from 'uuid';
import Grid from './components/Grid';
import TopNav from './components/TopNav';
import { useEffect } from 'react';

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
    let new_grid = checkLocalStorage();
    if (new_grid) new_grid = JSON.parse(new_grid);
    if (new_grid) overwriteGrid(new_grid);
  };

  const checkLocalStorage = () => {
    let test = window.localStorage.getItem('gofuckyourself');
    return test;
  };

  const overwriteGrid = (new_grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let square = grid[i][j];
        square.uuid = new_grid[i][j].uuid;
        square.val = new_grid[i][j].val;
        square.setVal(square.val);
      }
    }
    setValueFunctions();
  };

  const setValueFunctions = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].setValue = setValue;
      }
    }
  };

  const setValue = (square_uuid, val) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let square = grid[i][j];
        let cell_match = square.uuid === square_uuid;
        let val_match = square.val === val;
        if (cell_match) {
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

  setValueFunctions();

  return (
    <div className='App site-bg-empty w-full h-full flex flex-col'>
      <TopNav active_type={active_type} setMode={setMode} />
      <Grid grid={grid} rows={rows} cols={cols} active_type={active_type} />
    </div>
  );
}

export default App;
