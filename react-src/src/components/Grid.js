import MouseDetector from '../utils/MouseDetector';
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
      {grid.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <MouseDetector key={JSON.stringify([rowIndex, colIndex])}>
            <GridSquare square={square} active_type={active_type} />
          </MouseDetector>
        ))
      )}
    </div>
  );
};

export default Grid;
