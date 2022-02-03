import GridSquare from './GridSquare';

const Grid = ({ grid, rows, cols, active_type, mouseDown }) => {
  const gridStyle = {
    margin: 'auto',
    display: 'grid',
    gap: '0px',
    gridTemplateColumns: `repeat(${cols}, auto)`,
  };

  return (
    <div className='border border-slate-600' style={gridStyle}>
      {grid.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <GridSquare
            key={JSON.stringify([rowIndex, colIndex])}
            square={square}
            active_type={active_type}
            gridMouseDown={mouseDown}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
