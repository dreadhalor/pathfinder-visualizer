import { useEffect, useState } from 'react';
import './GridSquare.scss';

const GridSquare = ({ square, active_type }) => {
  const clicked = () => {
    //square.setVal = setVal;
    square.setValue(square.uuid, active_type);
    setVal(square.val);
  };

  const [pathVal, setPathVal] = useState(0);
  const getPathVal = () => pathVal;
  const [val, setVal] = useState(0);
  const [mode, setMode] = useState(0);
  square.setMode = setMode;
  square.setVal = setVal;
  square.setPathVal = setPathVal;
  square.getPathVal = getPathVal;
  const [myClass, setClass] = useState('');

  useEffect(() => {
    const getClass = () => {
      let result = 'grid-square ';
      switch (val) {
        case 1:
          result += 'val-start';
          break;
        case 2:
          result += 'val-end';
          break;
        case 3:
          result += 'val-wall';
          break;
        default:
          break;
      }
      result += ' ';
      switch (mode) {
        case 1:
          result += 'select-start';
          break;
        case 2:
          result += 'select-end';
          break;
        case 3:
          result += 'select-wall';
          break;
        default:
          break;
      }
      result += ' ';
      switch (pathVal) {
        case 1:
          result += 'on-path animate2';
          break;
        case 2:
          result += 'traversed animate';
          break;
        default:
          break;
      }
      return result;
    };

    setClass(getClass());
  }, [val, mode, pathVal]);

  const gridSquareStyle = {
    width: '25px',
    height: '25px',
  };

  return (
    <div className='grid-square-wrapper' onClick={clicked}>
      <div className={myClass} style={gridSquareStyle}></div>
    </div>
  );
};

export default GridSquare;
