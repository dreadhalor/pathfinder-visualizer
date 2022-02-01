import GridSquare from './GridSquare';

const Grid = ({ grid, rows, cols, active_type }) => {
  const gridStyle = {
    display: 'grid',
    gap: '0px',
    gridTemplateColumns: `repeat(${cols}, auto)`,
  };

  return (
    <div className='m-auto grid border border-slate-600' style={gridStyle}>
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
