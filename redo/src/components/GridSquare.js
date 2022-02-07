import { useEffect, useState } from 'react';
import './GridSquare.scss';

const GridSquare = ({ square, setValue, modeRef }) => {
  const gridSquareSize = {
    width: '25px',
    height: '25px',
  };
  const wall_style = {
    opacity: 0,
  };
  const start_style = {
    backgroundColor: '#05ff05',
  };
  const end_style = {
    backgroundColor: '#ff6b6b',
  };
  const on_path_style = {
    backgroundColor: 'yellow',
  };
  const traversed_style = {
    backgroundColor: 'lightblue',
  };

  const getStyle = () => {
    if (val === 2) return { ...gridSquareSize, ...end_style };
    if (val === 1) return { ...gridSquareSize, ...start_style };
    if (pathVal === 2) return { ...gridSquareSize, ...on_path_style };
    if (pathVal === 1) return { ...gridSquareSize, ...traversed_style };
    if (val === 3) return { ...gridSquareSize, ...wall_style };
    return gridSquareSize;
  };
  const getClassName = () => {
    let className = 'border border-slate-500 bg-white';
    if (pathVal === 1) className += ' animate';
    else if (pathVal === 2) className += ' animate2';
    return className;
  };

  const [val, setVal] = useState(0);
  const [pathVal, setPathVal] = useState(0);

  useEffect(() => {
    square.setVal = setVal;
    square.setPathVal = setPathVal;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    square.val = val;
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    square.pathVal = pathVal;
  }, [pathVal]); // eslint-disable-line react-hooks/exhaustive-deps

  const clicked = () => {
    setValue(square.uuid);
  };

  //console.log('square rendered');

  return (
    <div onClick={clicked} style={getStyle()} className={getClassName()}>
      {val > 0 ? val : ''}
    </div>
  );
};

export default GridSquare;
