import Grid from './Grid';
import GridOverlay from './GridOverlay';

const GridPane = ({
  grid,
  mode,
  rows,
  cols,
  beginSolveFxn,
  solved,
  resetPath,
}) => {
  return (
    <div className='w-full flex-1 relative min-h-0'>
      <GridOverlay
        beginSolveFxn={beginSolveFxn}
        solved={solved}
        resetPath={resetPath}
      />
      <div className='w-full h-full flex overflow-auto p-4'>
        <Grid grid={grid} rows={rows} cols={cols} mode={mode} />
      </div>
    </div>
  );
};

export default GridPane;
