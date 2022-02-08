import { useRef } from 'react';
import './App.scss';
import { v4 as uuidv4 } from 'uuid';
import GridSquare from './components/GridSquare';
import TopNav from './components/TopNav';
import { bfs } from './utilities/solvers/bfs';
import { kruskals } from './utilities/maze-generation/kruskals';
import { ellers } from './utilities/maze-generation/ellers';

function App() {
  const rows = 25,
    cols = 25;
  const createNewGrid = (num_rows, num_cols) => {
    let new_grid = [];
    for (let i = 0; i < num_rows; i++) {
      let row = [];
      for (let j = 0; j < num_cols; j++) {
        row.push({ uuid: uuidv4() });
      }
      new_grid.push(row);
    }
    return new_grid;
  };
  const gridRef = useRef(createNewGrid(rows, cols));
  const mode = useRef(1);
  const solved = useRef(false);
  const navRef = useRef();
  const animationQueueRef = useRef([]);

  const setValueCheck = (candidate_square, uuid, val) => {
    let tile_match = candidate_square.uuid === uuid;
    let val_match = candidate_square.val === val;
    let exact_match = tile_match && val_match;
    if (exact_match) candidate_square.setVal(0);
    else if (tile_match) candidate_square.setVal(val);
    else if (val_match) {
      if (val === 1 || val === 2) candidate_square.setVal(0);
    }
  };
  const setValue = (square_uuid, val = mode.current) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        setValueCheck(gridRef.current[i][j], square_uuid, val);
      }
    }
  };

  console.log('app rendered');

  const gridStyle = {
    margin: 'auto',
    display: 'grid',
    gap: '0px',
    gridTemplateColumns: `repeat(${cols}, auto)`,
  };

  const animation_delay = 5;
  const animation_threads = 4;
  const flushAnimationQueue = () => (animationQueueRef.current = []);
  const playThroughAnimationQueue = () => {
    for (let i = 0; i < animation_threads; i++) {
      setTimeout(animationLoop, animation_delay * i);
    }
  };
  function animationLoop() {
    let animation = animationQueueRef.current.shift();
    if (animation) {
      animation();
      setTimeout(animationLoop, animation_delay * animation_threads);
    }
  }

  const resetPath = () => {
    solved.current = false;
    flushAnimationQueue();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (gridRef.current[i][j].pathVal) gridRef.current[i][j].setPathVal(0);
      }
    }
    navRef.current.forceRender();
  };
  const solve = () => {
    let start = null;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (gridRef.current[i][j].val === 1) start = [i, j];
      }
    }
    let animation_queue = [];
    let end = bfs({
      maze: gridRef.current,
      start_coords: start,
      check_solved_func: (tile) => tile.val === 2,
      traversal_animation_func: (tile) => tile.setPathVal(1),
      path_animation_func: (tile) => tile.setPathVal(2),
      animation_queue,
    });
    animationQueueRef.current = animation_queue;
    playThroughAnimationQueue();
    if (end) {
      solved.current = true;
      navRef.current.forceRender();
    }
  };
  const generateKruskals = () => {
    resetPath();
    let result = kruskals(gridRef.current);
    gridRef.current.forEach((row) => row.forEach((tile) => tile.setVal(3)));
    result.forEach((tile) => {
      let [r, c] = tile;
      gridRef.current[r][c].setVal(0);
    });
  };
  const generateEllers = () => {
    resetPath();
    let result = ellers(gridRef.current);
    gridRef.current.forEach((row) => row.forEach((tile) => tile.setVal(3)));
    result.forEach((tile) => {
      let [r, c] = tile;
      gridRef.current[r][c].setVal(0);
    });
  };

  return (
    <div className='App site-bg-empty w-full h-full flex flex-col'>
      <TopNav
        ref={navRef}
        modeRef={mode}
        solve={solve}
        solvedRef={solved}
        clearPath={resetPath}
        generateKruskals={generateKruskals}
        generateEllers={generateEllers}
      />
      <div className='w-full flex-1 relative min-h-0'>
        {/* <div className='absolute w-full flex flex-col pointer-events-none z-10'>
          <button
            className='solve-button mx-auto mt-2 font-bold bg-blue-300 hover:bg-blue-400 p-1 rounded-lg pointer-events-auto'
            onClick={mySolved ? resetPath : beginSolveFxn}
          >
            {mySolved ? 'Clear Path' : 'Solve It!'}
          </button>
        </div> */}
        <div className='w-full h-full flex overflow-auto p-4'>
          <div className='border border-slate-600' style={gridStyle}>
            {gridRef.current.map((row) =>
              row.map((square) => (
                <GridSquare
                  key={square.uuid}
                  square={square}
                  modeRef={mode}
                  setValue={setValue}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
