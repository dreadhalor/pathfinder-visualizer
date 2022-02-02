import { useEffect, useState } from 'react';
import './GridSquare.scss';

const GridSquare = ({ square, active_type }) => {
  const clicked = () => {
    square.setValue(square.uuid, active_type);
  };

  const [myClass, setClass] = useState('');

  useEffect(() => {
    const getClass = () => {
      let result = 'grid-square ';
      switch (square.val) {
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
      switch (square.mode) {
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
      switch (square.pathVal) {
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
  }, [square.val, square.mode, square.pathVal]);

  const gridSquareStyle = {
    width: '25px',
    height: '25px',
  };

  return (
    <div className='grid-square-wrapper text-slate-600' onClick={clicked}>
      <div className={myClass} style={gridSquareStyle}>
        {square.direction && square.direction}
      </div>
    </div>
  );
};

export default GridSquare;
