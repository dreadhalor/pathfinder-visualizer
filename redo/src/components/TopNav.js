import React, { useImperativeHandle, useState } from 'react';
import BasicMenu from './BasicMenu';

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
  const changeMode = (event) => {
    let value = parseInt(event.target.value);
    modeRef.current = value;
    forceRender();
  };

  const [ignore, forceRenderCounter] = useState(0); // eslint-disable-line no-unused-vars
  const forceRender = () => forceRenderCounter((prev_counter) => prev_counter + 1);
  useImperativeHandle(ref, () => ({ forceRender }));

  let options = [
    { title: `Kruskal's Algorithm`, onClick: generateKruskals },
    { title: `Recursive Backtracking`, onClick: generateDFS },
    { title: `Prim's Algorithm`, onClick: generatePrims },
    { title: `Hunt-and-Kill Algorithm`, onClick: generateHuntAndKill },
    { title: `Recursive Division`, onClick: generateRecursiveDivision },
    { title: `Eller's Algorithm`, onClick: generateEllers },
  ];

  return (
    <div ref={ref} className='bg-slate-200 flex flex-row overflow-auto'>
      <span className='flex-1'></span>
      <p className='font-bold my-auto ml-2'>Tile type:</p>
      <div className='my-auto flex flex-row'>
        <span className='px-1 flex flex-row'>
          <input
            checked={modeRef.current === 1}
            onChange={changeMode}
            type='radio'
            className='mr-1 my-auto'
            id='start'
            name='tile_mode'
            value='1'
          />
          <label htmlFor='start'>Start</label>
        </span>
        <span className='px-1 flex flex-row'>
          <input
            checked={modeRef.current === 2}
            onChange={changeMode}
            type='radio'
            className='mr-1 my-auto'
            id='end'
            name='tile_mode'
            value='2'
          />
          <label htmlFor='end'>End</label>
        </span>
        <span className='px-1 flex flex-row'>
          <input
            checked={modeRef.current === 3}
            onChange={changeMode}
            type='radio'
            className='mr-1 my-auto'
            id='wall'
            name='tile_mode'
            value='3'
          />
          <label htmlFor='wall'>Wall</label>
        </span>
      </div>
      <button
        className='my-1 mx-2 font-bold bg-blue-300 hover:bg-blue-400 p-1 rounded-lg'
        onClick={solvedRef.current ? clearPath : solve}
      >
        {solvedRef.current ? 'Clear Path' : 'Solve It!'}
      </button>
      <BasicMenu options={options} />
      <button
        className='my-1 mx-2 font-bold bg-blue-300 hover:bg-blue-400 p-1 rounded-lg'
        onClick={resetWalls}
      >
        Clear Walls
      </button>
      <span className='flex-1'></span>
    </div>
  );
};

export default React.forwardRef(TopNav);
