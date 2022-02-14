import React, { useImperativeHandle, useState } from 'react';
import BasicMenu from './BasicMenu';
import ModeSelect from './ModeSelect';

const TopNav = (
  {
    modeRef,
    solve,
    clearPath,
    solvedRef,
    generateKruskals,
    generateEllers,
    generateDFS,
    generateHuntAndKill,
    generatePrims,
    generateRecursiveDivision,
    resetWalls,
  },
  ref
) => {
  const [ignore, forceRenderCounter] = useState(0); // eslint-disable-line no-unused-vars
  const forceRender = () => forceRenderCounter((prev_counter) => prev_counter + 1);
  useImperativeHandle(ref, () => ({ forceRender }));

  let maze_options = [
    { title: `Kruskal's Algorithm`, onClick: generateKruskals },
    { title: `Recursive Backtracking`, onClick: generateDFS },
    { title: `Prim's Algorithm`, onClick: generatePrims },
    { title: `Hunt-and-Kill Algorithm`, onClick: generateHuntAndKill },
    { title: `Recursive Division`, onClick: generateRecursiveDivision },
    { title: `Eller's Algorithm`, onClick: generateEllers },
  ];
  let solve_options = [{ title: `Dijkstra's Algorithm/BFS`, onClick: solve }];

  return (
    <div ref={ref} className='bg-slate-200 flex flex-row overflow-auto px-2'>
      <span className='flex-1'></span>
      <ModeSelect modeRef={modeRef} renderParent={forceRender} />
      <BasicMenu title={'Solve It!'} options={solve_options} />
      <button
        className='my-1 mx-2 font-bold bg-blue-300 hover:bg-blue-400 p-1 rounded-lg'
        onClick={clearPath}
      >
        Clear Path
      </button>
      <BasicMenu title={'Generate Maze'} options={maze_options} />
      <button
        className='my-1 ml-2 font-bold bg-blue-300 hover:bg-blue-400 p-1 rounded-lg'
        onClick={() => resetWalls(true)}
      >
        Clear Walls
      </button>
      <span className='flex-1'></span>
    </div>
  );
};

export default React.forwardRef(TopNav);
