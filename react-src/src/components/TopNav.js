import { useState, useEffect } from 'react';

const TopNav = ({ active_type, setActiveType, setMode }) => {
  const changeMode = (event) => {
    let value = parseInt(event.target.value);
    setActiveType(value);
    setMyMode(value);
  };

  const [myMode, setMyMode] = useState(active_type);

  useEffect(() => {
    //christ this is all very hacky, I'm definitely just barely learning React
    setMode(myMode);
  }, [myMode]);

  return (
    <div className='border-b border-slate-500 bg-slate-200 flex flex-row justify-around'>
      <span className='flex-1'></span>
      <p className='font-bold my-auto'>Tile type:</p>
      <div className='my-auto'>
        <span className='px-1'>
          <input
            checked={myMode === 1}
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
            checked={myMode === 2}
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
            checked={myMode === 3}
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
        type='button'
        className='rounded-md px-1 m-2 bg-blue-300 hover:bg-blue-400 active:bg-blue-500'
      >
        Generate Maze
      </button>
      <span className='flex-1'></span>
    </div>
  );
};

export default TopNav;
