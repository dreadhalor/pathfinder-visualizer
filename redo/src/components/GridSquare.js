import { useEffect, useRef, useState } from 'react';
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
  const frontier_style = {
    backgroundColor: '#ffa3a3',
  };

  const getStyle = () => {
    if (val === 2) return { ...gridSquareSize, ...end_style };
    if (val === 1) return { ...gridSquareSize, ...start_style };
    if (pathVal === 2) return { ...gridSquareSize, ...on_path_style };
    if (pathVal === 1) return { ...gridSquareSize, ...traversed_style };
    if (val === 3) return { ...gridSquareSize, ...wall_style };
    if (val === 4) return { ...gridSquareSize, ...frontier_style };
    return gridSquareSize;
  };
  const getClassName = () => {
    let className = 'tile border border-slate-500 bg-white';
    if (val === 3) className += ' fade';
    if (pathVal === 1) className += ' animate';
    else if (pathVal === 2) className += ' animate2';
    return className;
  };

  const [val, setVal] = useState(0);
  const [pathVal, setPathVal] = useState(0);

  const tileRef = useRef();

  const animate = (num) => {
    if (num === 1) {
      tileRef.current.classList.remove('pop');
      void tileRef.current.offsetWidth;
      tileRef.current.classList.add('pop');
    } else if (num === 2) {
      tileRef.current.classList.remove('pop');
      tileRef.current.classList.remove('finish');
      void tileRef.current.offsetWidth;
      tileRef.current.classList.add('finish');
    } else if (num === 3) {
      tileRef.current.classList.remove('pop');
      tileRef.current.classList.remove('finish');
      tileRef.current.classList.remove('fade');
      void tileRef.current.offsetWidth;
      tileRef.current.classList.add('fade');
    }
  };

  useEffect(() => {
    square.setVal = setVal;
    square.setPathVal = setPathVal;
    square.animate = animate;
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

  const animationEnd = (event) => {
    let animation_name = event.animationName;
    if (animation_name === 'just_pop') {
      tileRef.current.classList.remove('pop');
      void tileRef.current.offsetWidth;
    } else if (animation_name === 'finished') {
      tileRef.current.classList.remove('finish');
      void tileRef.current.offsetWidth;
    } else if (animation_name === 'fade') {
      tileRef.current.classList.remove('fade');
      void tileRef.current.offsetWidth;
      setVal(3);
    }
  };

  //console.log('square rendered');

  return (
    <div
      ref={tileRef}
      onClick={clicked}
      style={getStyle()}
      className={getClassName()}
      onAnimationEnd={animationEnd}
    >
      {val === 1 || val === 2 ? val : ''}
    </div>
  );
};

export default GridSquare;
