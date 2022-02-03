import { useState } from 'react';
import MouseDetector from '../utils/MouseDetector';
import Grid from './Grid';

const GridMouseWrapper = (props) => {
  const [mouseDown, setMouseDown] = useState(false);

  return (
    <MouseDetector
      className='flex-1 flex'
      setMouseDown={setMouseDown}
      child={<Grid {...props} mouseDown={mouseDown} />}
    />
  );
};

export default GridMouseWrapper;
