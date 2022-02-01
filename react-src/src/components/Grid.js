import GridSquare from './GridSquare';

const Grid = ({ grid, rows, cols, active_type }) => {
  const gridStyle = {
    margin: 'auto',
    display: 'grid',
    gap: '0px',
    gridTemplateColumns: `repeat(${cols}, auto)`,
  };

  return (
    <div className='border border-slate-600' style={gridStyle}>
      {grid.map((row) =>
        row.map((square) => (
          <GridSquare
            key={square.uuid}
            square={square}
            active_type={active_type}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
