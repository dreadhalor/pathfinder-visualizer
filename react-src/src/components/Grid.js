import MouseDetector from '../utils/MouseDetector';
import GridSquare from './GridSquare';

const Grid = ({ grid, mode, rows, cols, setValue }) => {
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
          <MouseDetector key={square.uuid}>
            <GridSquare
              square={square}
              valForCheck={square.val}
              mode={mode}
              setValue={setValue}
            />
          </MouseDetector>
        ))
      )}
    </div>
  );
};

export default Grid;
