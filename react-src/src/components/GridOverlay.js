import { useEffect, useState } from 'react';
import './GridOverlay.scss';

const GridOverlay = ({ beginSolveFxn, solved, resetPath }) => {
  const [mySolved, setMySolved] = useState(solved);

  useEffect(() => {
    setMySolved(solved);
  }, [solved]);

  return (
    <div className='absolute w-full flex flex-col pointer-events-none z-10'>
      <button
        className='solve-button mx-auto mt-2 font-bold bg-blue-300 hover:bg-blue-400 p-1 rounded-lg pointer-events-auto'
        onClick={mySolved ? resetPath : beginSolveFxn}
      >
        {mySolved ? 'Clear Path' : 'Solve It!'}
      </button>
    </div>
  );
};

export default GridOverlay;
