import './GridOverlay.scss';

const GridOverlay = ({ beginSolveFxn }) => {
  return (
    <div className='absolute w-full flex flex-col pointer-events-none z-10'>
      <button
        className='solve-button mx-auto mt-2 font-bold bg-blue-300 hover:bg-blue-400 p-1 rounded-lg pointer-events-auto'
        onClick={beginSolveFxn}
      >
        Solve it!
      </button>
    </div>
  );
};

export default GridOverlay;
