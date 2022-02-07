import React, { useCallback, useEffect, useRef, useState } from 'react';
import './GridSquare.scss';

const GridSquare = React.memo(
  ({
    square,
    valForCheck,
    mode,
    pointerDown,
    pointerOver,
    clickFunctions,
    drag,
    pointerEvent,
    setValue,
  }) => {
    const myMode = useRef(mode);
    useEffect(() => {
      myMode.current = mode;
    }, [mode]);
    const clicked = (disallow_toggle = false) => {
      if (disallow_toggle && square?.val === myMode.current) return;
      setValue(square.uuid, myMode.current, disallow_toggle);
    };
    const ensureVal = (val) => {
      let valid = val === 3 || val === 0;
      if (valid && valForCheck !== val) setValue(square.uuid, val, true);
    };
    const checkDrawing = (override = false, shift) => {
      if (drag || override) {
        if (pointerEvent.buttons === 2 || (shift ?? pointerEvent.shiftKey))
          erase();
        else ensureVal(myMode.current);
      }
    };
    const erase = () => ensureVal(0);

    const [myClass, setClass] = useState('');
    const [pathVal, setPathVal] = useState(0);
    const pathValRef = useRef(pathVal);
    const getPathVal = () => pathVal;
    square.getPathVal = getPathVal;
    square.setPathVal = setPathVal;

    useEffect(() => {
      clickFunctions.current.leftClick = clicked;
      clickFunctions.current.rightClick = erase;
      clickFunctions.current.shiftLeftClick = erase;
      clickFunctions.current.shiftDragLeftClick = erase;
      clickFunctions.current.dragLeftClick = () => {
        if (myMode.current === 1 || myMode.current === 2) clicked();
      };
      clickFunctions.current.dragRightClick = erase;
      clickFunctions.current.rightPreDragExit = () => checkDrawing(true, true);
      clickFunctions.current.preDragExit = () => checkDrawing(true, false);
      clickFunctions.current.shiftPreDragExit = () => checkDrawing(true, true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(checkDrawing, [drag]);
    useEffect(() => {
      pathValRef.current = pathVal;
      if (pathVal === 3)
        setTimeout(() => {
          if (pathValRef.current === 3) setPathVal(0);
        }, 400);
    }, [pathVal]);

    useEffect(() => {
      const getClass = () => {
        let result = 'grid-square ';
        switch (valForCheck) {
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
        switch (myMode.current) {
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
    }, [valForCheck, pathVal, pointerDown, pointerOver]);

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
        <div className={myClass}>
          {square.direction && square.direction}
          {pathVal}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    const checks = [
      'valForCheck',
      'pointerDown',
      'pointerOver',
      'pointerEvent',
      'drag',
    ];
    for (let field of checks) {
      if (prevProps[field] !== nextProps[field]) return false;
    }
    return true;
  }
);

export default GridSquare;
