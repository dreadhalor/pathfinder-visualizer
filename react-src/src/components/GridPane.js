//import Grid from './Grid';
import GridMouseWrapper from './GridMouseWrapper';
import GridOverlay from './GridOverlay';

const GridPane = ({
  grid,
  rows,
  cols,
  active_type,
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
        <GridMouseWrapper
          grid={grid}
          rows={rows}
          cols={cols}
          active_type={active_type}
        />
      </div>
    </div>
  );
};

export default GridPane;
