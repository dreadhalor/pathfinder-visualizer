import { useState, useEffect } from 'react';
import './GridSquare.scss';

const GridSquare = ({ square, active_type }) => {
  const clicked = () => {
    square.setValue(square.uuid, active_type.active);
    setVal(square.val);
  };

  const [val, setVal] = useState(0);

  useEffect(() => {
    console.log('update');
    setVal(square.val);
  }, [square.val, active_type.active]);

  const gridSquareStyle = {
    width: '25px',
    height: '25px',
  };

  const getClass = () => {
    let result = '';
    switch (val) {
      case 0:
        result += 'grid-square-default';
        break;
      case 1:
        result += 'grid-square-start';
        break;
      case 2:
        result += 'grid-square-end';
        break;
      case 3:
        result += 'wall';
        break;
      default:
        result += 'grid-square-default';
        break;
    }
    result += ' ';
    switch (active_type.active) {
      case 1:
        result += 'grid-square-select-start';
        break;
      case 2:
        result += 'grid-square-select-end';
        break;
      case 3:
        result += 'grid-square-select-wall';
        break;
      default:
        break;
    }
    return result;
  };

  return (
    <div className='grid-square-wrapper' onClick={clicked}>
      <div
        className={'grid-square ' + getClass()}
        style={gridSquareStyle}
      ></div>
    </div>
  );
};

export default GridSquare;
