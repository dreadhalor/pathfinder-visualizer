import Grid from './Grid';
import GridOverlay from './GridOverlay';

const GridPane = ({ grid, rows, cols, active_type, beginSolveFxn }) => {
  return (
    <div className='w-full flex-1 relative'>
      <GridOverlay beginSolveFxn={beginSolveFxn} />
      <div className='w-full h-full flex'>
        <Grid grid={grid} rows={rows} cols={cols} active_type={active_type} />
      </div>
    </div>
  );
};

export default GridPane;
