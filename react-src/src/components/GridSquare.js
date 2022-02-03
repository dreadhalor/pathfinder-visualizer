import { useEffect, useState } from 'react';
import './GridSquare.scss';

const GridSquare = ({ square, active_type, gridMouseDown }) => {
  const clicked = (disallow_toggle = false) => {
    if (disallow_toggle && square?.val === active_type) return;
    square.setValue(square.uuid, active_type, disallow_toggle);
  };
  const ensureVal = (val) => {
    let valid = val === 3 || val === 0;
    if (valid && square.val !== val) square.setValue(square.uuid, val, true);
  };
  const checkDrawing = (e) => {
    if (gridMouseDown) {
      if (e.buttons === 2 || e.shiftKey) ensureVal(0);
      else ensureVal(active_type);
    }
  };

  const [myClass, setClass] = useState('');
  const [pathVal, setPathVal] = useState(0);
  const getPathVal = () => pathVal;
  square.getPathVal = getPathVal;
  square.setPathVal = setPathVal;

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
      switch (pathVal) {
        case 3:
          result += 'reset';
          break;
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
  }, [square.val, square.mode, pathVal]);

  const reset = () => setPathVal(0); //lol this will scale horribly

  const gridSquareStyle = {
    width: '25px',
    height: '25px',
  };

  return (
    <div
      className='grid-square-wrapper text-slate-600'
      onClick={(e) => clicked()}
      onTransitionEnd={reset}
      onPointerEnter={(e) => checkDrawing(e)}
      onPointerMove={(e) => checkDrawing(e)}
    >
      <div className={myClass} style={gridSquareStyle}>
        {square.direction && square.direction}
      </div>
    </div>
  );
};

export default GridSquare;
