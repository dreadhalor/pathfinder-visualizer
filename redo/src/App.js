import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.scss';
import { v4 as uuidv4 } from 'uuid';
import GridSquare from './components/GridSquare';
import TopNav from './components/TopNav';
import { bfs } from './utilities/solvers/bfs';
import {
  kruskals,
  ellers,
  recursiveBacktracking,
  huntAndKill,
  prims,
} from './utilities/maze-generation';
import { Animator } from './utilities/animator';
import { finishAnimation } from './utilities/animations';
import { recursiveDivision } from './utilities/maze-generation/recursive-division';

function App() {
  const [rows, setRows] = useState(25);
  const [cols, setCols] = useState(39);
  // const [grid, setGrid] = useState();
  let squareSize = useRef(25);

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
  const [grid, setGrid] = useState(createNewGrid(5, 5));
  //const grid = useRef();

  const gridContainerRef = useRef();
  const mode = useRef(1);
  const solved = useRef(false);
  const navRef = useRef();
  const animatorRef = useRef(new Animator());
  const finished = () => animatorRef.current.playAnimations([...finishAnimation(grid)]);
  animatorRef.current.setFinishFunction(finished);

  const setValueCheck = (candidate_square, uuid, val) => {
    let tile_match = candidate_square.uuid === uuid;
    let val_match = candidate_square.val === val;
    let exact_match = tile_match && val_match;
    if (exact_match) candidate_square.setVal(0);
    else if (tile_match) {
      if (val === 3 && candidate_square.pathVal === 2) resetPath();
      candidate_square.setVal(val);
    } else if (val_match) {
      if (val === 1 || val === 2) candidate_square.setVal(0);
    }
  };
  const setValue = (square_uuid, val = mode.current) => {
    if (((val === 1 || val === 2) && solved.current) || animatorRef.current.animationsLeft() > 0)
      resetPath();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        setValueCheck(grid[i][j], square_uuid, val);
      }
    }
  };
  //eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    resetGridSize();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  function resetGridSize() {
    let w = gridContainerRef.current.clientWidth,
      h = gridContainerRef.current.clientHeight;
    squareSize.current = w < 600 ? 20 : 25;
    let new_rows = Math.floor(h / squareSize.current);
    if (new_rows % 2 === 0 && new_rows > 0) new_rows--;
    let new_cols = Math.floor(w / squareSize.current);
    if (new_cols % 2 === 0 && new_cols > 0) new_cols--;
    animatorRef.current.flushAnimationQueue();
    setRows(new_rows); //eslint-disable-line react-hooks/exhaustive-deps
    setCols(new_cols); //eslint disable-line exhaustive-deps
    setGrid(createNewGrid(new_rows, new_cols)); //eslint disable-line exhaustive-deps
  }
  useEffect(() => {
    window.addEventListener('resize', resetGridSize);
    return () => window.removeEventListener('resize', resetGridSize);
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  //console.log('app rendered');

  const gridStyle = {
    margin: 'auto',
    display: 'grid',
    gap: '0px',
    gridTemplateColumns: `repeat(${cols}, auto)`,
  };

  const resetPath = () => {
    solved.current = false;
    animatorRef.current.flushAnimationQueue();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j].pathVal) grid[i][j].setPathVal(0);
      }
    }
    navRef.current.forceRender();
  };
  const solve = () => {
    let start = null;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j].val === 1) start = [i, j];
      }
    }
    let animation_queue = [];
    let end = bfs({
      maze: grid,
      start_coords: start,
      check_solved_func: (tile) => tile.val === 2,
      traversal_animation_func: (tile) => tile.setPathVal(1),
      path_animation_func: (tile) => tile.setPathVal(2),
      animation_queue,
    });
    animatorRef.current.playAnimations(animation_queue, 3);
    if (end) {
      solved.current = true;
      navRef.current.forceRender();
    }
  };

  const generateKruskals = () => {
    resetPath();
    grid.forEach((row) => row.forEach((tile) => tile.setVal(3)));
    let [result, animations] = kruskals(grid); //eslint-disable-line no-unused-vars
    let animation_queue = [...animations, ...finishAnimation(grid)];
    animatorRef.current.playAnimations(animation_queue);
  };
  const generateEllers = () => {
    resetPath();
    let [result, animations] = ellers(grid); //eslint-disable-line no-unused-vars
    grid.forEach((row) => row.forEach((tile) => tile.setVal(3)));
    animatorRef.current.playAnimations(animations, 0.08, true);
  };
  const generateDFS = () => {
    resetPath();
    grid.forEach((row) => row.forEach((tile) => tile.setVal(3)));
    //eslint-disable-next-line no-unused-vars
    let [result, animations] = recursiveBacktracking(grid);
    let animation_queue = [...animations]; //, ...finishAnimation(grid)];
    animatorRef.current.playAnimations(animation_queue, 2, true);
  };
  const generateHuntAndKill = () => {
    resetPath();
    grid.forEach((row) => row.forEach((tile) => tile.setVal(3)));
    let [result, animations] = huntAndKill(grid); //eslint-disable-line no-unused-vars
    let animation_queue = [...animations]; //, ...finishAnimation(grid)];
    animatorRef.current.playAnimations(animation_queue, 2, true);
  };
  const generatePrims = () => {
    resetPath();
    grid.forEach((row) => row.forEach((tile) => tile.setVal(3)));
    //eslint-disable-next-line no-unused-vars
    let [result, animations] = prims(grid);
    let animation_queue = [...animations, ...finishAnimation(grid)];
    animatorRef.current.playAnimations(animation_queue);
  };
  const generateRecursiveDivision = () => {
    resetPath();
    grid.forEach((row) => row.forEach((tile) => tile.setVal(0)));
    animatorRef.current.playAnimations(recursiveDivision(grid), true);
  };

  return (
    <div className='App site-bg-empty h-full w-full flex flex-col'>
      <TopNav
        ref={navRef}
        modeRef={mode}
        solve={solve}
        solvedRef={solved}
        clearPath={resetPath}
        generateKruskals={generateKruskals}
        generateEllers={generateEllers}
        generateDFS={generateDFS}
        generateHuntAndKill={generateHuntAndKill}
        generatePrims={generatePrims}
        generateRecursiveDivision={generateRecursiveDivision}
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
        <div className='w-full h-full flex overflow-auto p-1'>
          <div ref={gridContainerRef} className='flex-1 h-auto flex min-w-0 min-h-0'>
            <div className='border-0 border-slate-600' style={gridStyle}>
              {grid &&
                grid.map((row) =>
                  row.map((square) => (
                    <GridSquare
                      key={square.uuid}
                      size={squareSize.current}
                      rows={rows}
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
    </div>
  );
}

export default App;
