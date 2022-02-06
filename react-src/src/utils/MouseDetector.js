import React, { useState, useRef } from 'react';

const MouseDetector = ({ className, children }) => {
  const [pointerDown, setPointerDown] = useState(false);
  const [pointerOver, setPointerOver] = useState(false);
  const [pointerEvent, setPointerEvent] = useState(
    new PointerEvent(`I'm just here so I don't get nulled`)
  );
  const [drag, setDrag] = useState(false);
  const [pressX, setPressX] = useState(null);
  const [pressY, setPressY] = useState(null);
  const [buttons, setButtons] = useState(0);

  const clickFunctions = useRef({
    leftClick: null,
    shiftLeftClick: null,
    rightClick: null,
    dragLeftClick: null,
    shiftDragLeftClick: null,
    dragRightClick: null,
    rightPreDragExit: null,
    shiftPreDragExit: null, //pre-drag click doesn't detect shift like 1/100 times & I physically can't explain it & I hate React
    preDragExit: null,
  });

  const togglePointerOver = (event, val) => {
    setPointerEvent(event);
    if (val !== pointerOver) setPointerOver(val);
    if (val !== pointerDown) {
      if (!val) {
        if (pointerDown && !drag) {
          //in case the user drag-exits from the border of the component & doesn't fully trigger the drag event
          if (event.shiftKey) {
            let shiftPreDragExit = clickFunctions.current.shiftPreDragExit;
            if (shiftPreDragExit) shiftPreDragExit();
          } else if (event.buttons === 2) {
            let rightPreDragExit = clickFunctions.current.rightPreDragExit;
            if (rightPreDragExit) rightPreDragExit();
          } else {
            let preDragExit = clickFunctions.current.preDragExit;
            if (preDragExit) preDragExit();
          }
        }
        setPointerDown(false);
        setDrag(false);
        setPressX(null);
        setPressY(null);
        setButtons(0);
      } else if (event.buttons) {
        setButtons(event.buttons);
        setPointerDown(true);
        setDrag(true);
      }
    }
  };
  const togglePointerDown = (event, val) => {
    setPointerEvent(event);
    if (val !== pointerDown) {
      setPointerDown(val);
      if (val) {
        setButtons(event.buttons);
        if (!pressX && !pressY) {
          setPressX(event.screenX);
          setPressY(event.screenY);
        }
      }
      if (!val && pointerOver) handleClick(event);
    }
  };
  const handleClick = (event) => {
    if (buttons === 1) {
      if (drag) {
        if (event.shiftKey) {
          let shiftDragLeftClick = clickFunctions.current.shiftDragLeftClick;
          if (shiftDragLeftClick) shiftDragLeftClick();
        } else {
          let dragLeftClick = clickFunctions.current.dragLeftClick;
          if (dragLeftClick) dragLeftClick();
        }
      } else {
        if (event.shiftKey) {
          let shiftLeftClick = clickFunctions.current.shiftLeftClick;
          if (shiftLeftClick) shiftLeftClick();
        } else {
          let leftClick = clickFunctions.current.leftClick;
          if (leftClick) leftClick();
        }
      }
    } else if (buttons === 2) {
      if (drag) {
        let dragRightClick = clickFunctions.current.dragRightClick;
        if (dragRightClick) dragRightClick();
      } else {
        let rightClick = clickFunctions.current.rightClick;
        if (rightClick) rightClick();
      }
    }
  };

  const dragLimit = 3;
  const pointerMoved = (event) => {
    setPointerEvent(event);
    if (
      drag !== pointerDown &&
      (Math.abs(pressX - event.screenX) > dragLimit ||
        Math.abs(pressY - event.screenY) > dragLimit)
    )
      setDrag(pointerDown);
  };

  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, {
      pointerDown,
      pointerOver,
      drag,
      pointerEvent,
      clickFunctions,
    })
  );

  //pointerOver is analogous to mouseOver & not super useful, better off using pointerMove

  return (
    <div
      className={className}
      onMouseDown={(e) => togglePointerDown(e, true)}
      onMouseUp={(e) => togglePointerDown(e, false)}
      onMouseEnter={(e) => togglePointerOver(e, true)}
      onMouseLeave={(e) => togglePointerOver(e, false)}
      onMouseMove={(e) => pointerMoved(e)}
    >
      {childrenWithProps}
    </div>
  );
};

export default MouseDetector;
