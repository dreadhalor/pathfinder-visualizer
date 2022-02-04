import React, { useState, useEffect } from 'react';

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

  const [clickFunctions, setClickFunctions] = useState({
    leftClick: null,
    shiftLeftClick: null,
    rightClick: null,
    dragLeftClick: null,
    dragRightClick: null,
  });

  const togglePointerOver = (event, val) => {
    setPointerEvent(event);
    if (val !== pointerOver) setPointerOver(val);
    if (val !== pointerDown) {
      if (!val) {
        setPointerDown(false);
        setDrag(false);
        setPressX(null);
        setPressY(null);
        setButtons(0);
      } else if (event.buttons) {
        //console.log(event.buttons);
        setPointerDown(true);
        setDrag(true);
      }
    }
  };
  const togglePointerDown = (event, val) => {
    setPointerEvent(event);
    if (val !== pointerDown) {
      setPointerDown(val);
      if (val && !pressX && !pressY) {
        setPressX(event.screenX);
        setPressY(event.screenY);
        setButtons(event.buttons);
      }
      if (!val && pointerOver) handleClick(event);
    }
  };
  const handleClick = (event) => {
    if (buttons === 1) {
      if (drag) {
        let dragLeftClick = clickFunctions.dragLeftClick;
        if (dragLeftClick) dragLeftClick();
      } else {
        if (event.shiftKey) {
          let shiftLeftClick = clickFunctions.shiftLeftClick;
          if (shiftLeftClick) shiftLeftClick();
        } else {
          let leftClick = clickFunctions.leftClick;
          if (leftClick) leftClick();
        }
      }
    } else if (buttons === 2) {
      if (drag) {
        let dragRightClick = clickFunctions.dragRightClick;
        if (dragRightClick) dragRightClick();
      } else {
        let rightClick = clickFunctions.rightClick;
        if (rightClick) rightClick();
      }
    }
  };

  const dragLimit = 1;
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
      onPointerDown={(e) => togglePointerDown(e, true)}
      onPointerUp={(e) => togglePointerDown(e, false)}
      onPointerEnter={(e) => togglePointerOver(e, true)}
      onPointerLeave={(e) => togglePointerOver(e, false)}
      onPointerMove={(e) => pointerMoved(e)}
    >
      {childrenWithProps}
    </div>
  );
};

export default MouseDetector;
