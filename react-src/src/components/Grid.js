import GridSquare from './GridSquare';

const Grid = ({ grid, rows, cols, active_type }) => {
  const gridStyle = {
    margin: 'auto',
    display: 'grid',
    gap: '0px',
    gridTemplateColumns: `repeat(${cols}, auto)`,
  };

  const mouseDown = (event) => {
    event.preventDefault();
    console.log('mousedown');
  };
  const mouseUp = (event) => {
    event.preventDefault();
    console.log('mousedown');
  };

  console.log('no ur gay');

  return (
    <div
      className='border border-slate-600'
      style={gridStyle}
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
    >
      {grid.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <GridSquare
            key={JSON.stringify([rowIndex, colIndex])}
            square={square}
            active_type={active_type}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
