import GridSquare from './GridSquare';

const Grid = ({ grid, rows, cols, active_type }) => {
  const gridStyle = {
    backgroundColor: 'grey',
    display: 'grid',
    gap: '0px',
    border: '1px solid black',
    gridTemplateColumns: `repeat(${cols}, auto)`,
  };

  return (
    <div className='m-auto grid' style={gridStyle}>
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
