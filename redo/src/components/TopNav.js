import React, { useImperativeHandle, useState } from 'react';

const TopNav = (
  { modeRef, solve, clearPath, solvedRef, generateKruskals },
  ref
) => {
  const changeMode = (event) => {
    let value = parseInt(event.target.value);
    modeRef.current = value;
    forceRender();
  };

  const [ignore, forceRenderCounter] = useState(0); // eslint-disable-line no-unused-vars
  const forceRender = () =>
    forceRenderCounter((prev_counter) => prev_counter + 1);
  useImperativeHandle(ref, () => ({ forceRender }));

  return (
    <div
      ref={ref}
      className='border-b border-slate-500 bg-slate-200 flex flex-row justify-around'
    >
      <span className='flex-1'></span>
      <p className='font-bold my-auto'>Tile type:</p>
      <div className='my-auto'>
        <span className='px-1'>
          <input
            checked={modeRef.current === 1}
            onChange={changeMode}
            type='radio'
            className='mr-1'
            id='start'
            name='tile_mode'
            value='1'
          />
          <label htmlFor='start'>Start</label>
        </span>
        <span className='px-1'>
          <input
            checked={modeRef.current === 2}
            onChange={changeMode}
            type='radio'
            className='mr-1'
            id='end'
            name='tile_mode'
            value='2'
          />
          <label htmlFor='end'>End</label>
        </span>
        <span className='px-1'>
          <input
            checked={modeRef.current === 3}
            onChange={changeMode}
            type='radio'
            className='mr-1'
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
      <button
        className='my-1 mx-1 font-bold bg-blue-300 hover:bg-blue-400 p-1 rounded-lg'
        onClick={generateKruskals}
      >
        Generate Kruskal's
      </button>
      <span className='flex-1'></span>
    </div>
  );
};

export default React.forwardRef(TopNav);
