import './App.scss';
import { v4 as uuidv4 } from 'uuid';
import Grid from './components/Grid';
import TopNav from './components/TopNav';

function App() {
  let rows = 25,
    cols = 40;
  let grid = new Array(rows).fill(0);

  const setValue = (square_uuid, val) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let square = grid[i][j];
        let match = square.uuid === square_uuid;
        if (match) {
          if (square.val === val) square.val = 0;
          else square.val = val;
        } else if (val === 1 && square.val === 1) {
          let copy = JSON.parse(JSON.stringify(square));
          copy.val = 0;
          grid[i][j] = copy;
        }
      }
    }
  };

  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols).fill(0);
    for (let j = 0; j < cols; j++) {
      grid[i][j] = { uuid: uuidv4(), val: 0, setValue };
    }
  }

  let active_type = {
    active: 1,
  };

  return (
    <div className='App site-bg-empty w-full h-full flex flex-col'>
      <TopNav active_type={active_type} />
      <Grid grid={grid} rows={rows} cols={cols} active_type={active_type} />
    </div>
  );
}

export default App;
