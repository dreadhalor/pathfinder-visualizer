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
  const dragValRef = useRef(null);
  const finished = () => animatorRef.current.playAnimations([...finishAnimation(grid)]);
  animatorRef.current.setFinishFunction(finished);

  const checkForPathReset = () => {
    return animatorRef.current.animationsLeft() > 0;
  };
  const setValueCheck = (candidate_square, uuid, val) => {
    let tile_match = candidate_square.uuid === uuid;
    let val_match = candidate_square.val === val;
    let exact_match = tile_match && val_match;
    if (exact_match) {
      candidate_square.setVal(0);
      return 0;
    } else if (tile_match) {
      if (val === 3 && candidate_square.pathVal === 2) resetPath();
      if (val === 1 || val === 2) {
        if (candidate_square.val === 3) return null;
        resetPath();
        removeVal(val);
      }
      candidate_square.setVal(val);
      return val;
    }
    return null;
  };
  const setValue = (square_uuid, val = mode.current) => {
    let value_set = null;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let possible = setValueCheck(grid[i][j], square_uuid, val);
        if ((possible ?? null) !== null) value_set = possible;
      }
    }
    if ((value_set ?? null) !== null && checkForPathReset()) resetPath();
    return value_set;
  };
  const removeVal = (val) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let tile = grid[i][j];
        if (tile.val === val) tile.setVal(0);
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
        let tile = grid[i][j];
        if (tile.pathVal) tile.setPathVal(0);
        tile.setDisplayVal(null);
        switch (tile.val) {
          case 4:
            tile.setVal(0);
            break;
          case 5:
            tile.setVal(3);
            break;
          case 6:
            tile.setVal(0);
            break;
          case 7:
            tile.setVal(3);
            break;
          default:
            break;
        }
      }
    }
    navRef.current.forceRender();
  };
  const resetWalls = () => {
    resetPath();
    grid.forEach((row) =>
      row.forEach((tile) => {
        tile.setDisplayVal(null);
        if (tile.val !== 1 && tile.val !== 2) tile.setVal(0);
      })
    );
  };
  const wallifyItAll = () => {
    resetPath();
    grid.forEach((row) =>
      row.forEach((tile) => {
        tile.setVal(3);
        tile.setDisplayVal(null);
      })
    );
  };
  const solve = () => {
    let start = null;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j].val === 1) {
          start = [i, j];
          break;
        }
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
    wallifyItAll();
    kruskals(grid, animatorRef);
  };
  const generateEllers = () => {
    wallifyItAll();
    let [result, animations] = ellers(grid); //eslint-disable-line no-unused-vars
    animatorRef.current.playAnimations(animations, 0.08, true);
  };
  const generateDFS = () => {
    wallifyItAll();
    //eslint-disable-next-line no-unused-vars
    let [result, animations] = recursiveBacktracking(grid);
    let animation_queue = [...animations]; //, ...finishAnimation(grid)];
    animatorRef.current.playAnimations(animation_queue, 2, true);
  };
  const generateHuntAndKill = () => {
    wallifyItAll();
    let [result, animations] = huntAndKill(grid); //eslint-disable-line no-unused-vars
    let animation_queue = [...animations]; //, ...finishAnimation(grid)];
    animatorRef.current.playAnimations(animation_queue, 2, true);
  };
  const generatePrims = () => {
    wallifyItAll();
    //eslint-disable-next-line no-unused-vars
    let [result, animations] = prims(grid);
    let animation_queue = [...animations, ...finishAnimation(grid)];
    animatorRef.current.playAnimations(animation_queue);
  };
  const generateRecursiveDivision = () => {
    resetWalls();
    animatorRef.current.playAnimations(recursiveDivision(grid, 10), 0, true);
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
        resetWalls={resetWalls}
      />
      <div className='w-full flex-1 relative min-h-0'>
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
                      setValue={setValue}
                      dragValRef={dragValRef}
                      modeRef={mode}
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
