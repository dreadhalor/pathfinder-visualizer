import { useEffect, useState } from 'react';
import './GridSquare.scss';

const GridSquare = ({ square, active_type }) => {
  const clicked = (e) => {
    square.setValue(square.uuid, active_type);
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

  const dragStart = (event) => {
    event.stopPropagation();
    const canvas = document.createElement('canvas');
    event.dataTransfer.setData('text', square.val);
    event.dataTransfer.setDragImage(canvas, 0, 0);
    event.dataTransfer.effectAllowed = 'none';
    //console.log(event.dataTransfer.getData('text'));
    console.log('dragstart');
  };
  const dragEnd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('dragend');
  };
  const drop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    var data = event.dataTransfer.getData('text');
    event.dataTransfer.clearData();
    console.log(data);
    console.log('drop');
  };
  const dragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('dragover');
  };
  const dragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('dragenter');
  };
  const dragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('dragleave');
  };

  const whatever = false;

  return (
    <div
      className='grid-square-wrapper text-slate-600'
      onClick={clicked}
      onTransitionEnd={reset}
      //draggable
      // onDragStart={(e) => dragStart(e)}
      // onDragEnd={(e) => dragEnd(e)}
      // onDrop={(e) => drop(e)}
      // onDragOver={(e) => dragOver(e)}
      // onDragEnter={(e) => dragEnter(e)}
      // onDragLeave={(e) => dragLeave(e)}
    >
      <div className={myClass} style={gridSquareStyle}>
        {square.direction && square.direction}
      </div>
    </div>
  );
};

export default GridSquare;
