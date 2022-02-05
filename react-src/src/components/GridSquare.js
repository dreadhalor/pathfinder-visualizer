import { useEffect, useState } from 'react';
import './GridSquare.scss';

const GridSquare = ({
  square,
  pointerDown,
  pointerOver,
  clickFunctions,
  drag,
  pointerEvent,
}) => {
  const clicked = (disallow_toggle = false) => {
    if (disallow_toggle && square?.val === square?.mode) return;
    square.setValue(square.uuid, square.mode, disallow_toggle);
  };
  const ensureVal = (val) => {
    let valid = val === 3 || val === 0;
    if (valid && square.val !== val) square.setValue(square.uuid, val, true);
  };
  const checkDrawing = (override = false, shift) => {
    if (drag || override) {
      if (pointerEvent.buttons === 2 || (shift ?? pointerEvent.shiftKey))
        erase();
      else ensureVal(square.mode);
    }
  };
  const erase = () => ensureVal(0);

  const [myClass, setClass] = useState('');
  const [pathVal, setPathVal] = useState(0);
  const getPathVal = () => pathVal;
  square.getPathVal = getPathVal;
  square.setPathVal = setPathVal;
  const [val, setVal] = useState(0);
  const getVal = () => val;
  square.componentGetVal = getVal;
  square.componentSetVal = setVal;

  useEffect(() => {
    clickFunctions.leftClick = clicked;
    clickFunctions.rightClick = erase;
    clickFunctions.shiftLeftClick = erase;
    clickFunctions.shiftDragLeftClick = erase;
    clickFunctions.dragLeftClick = () => {
      if (square.mode === 1 || square.mode === 2) clicked();
    };
    clickFunctions.dragRightClick = erase;
    clickFunctions.preDragExit = () => checkDrawing(true, false);
    clickFunctions.shiftPreDragExit = () => checkDrawing(true, true);
  }, []);

  useEffect(() => checkDrawing(), [drag]);

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
      if (pointerDown) result += 'active ';
      if (pointerOver) result += 'hover ';
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
  }, [square.val, square.mode, pathVal, pointerDown, pointerOver]);

  const reset = () => setPathVal(0); //lol this will scale horribly
  const gridSquareSize = {
    width: '25px',
    height: '25px',
  };

  return (
    <div
      style={gridSquareSize}
      className='text-slate-600'
      onTransitionEnd={reset}
    >
      <div className={myClass}>{square.direction && square.direction}</div>
    </div>
  );
};

export default GridSquare;
