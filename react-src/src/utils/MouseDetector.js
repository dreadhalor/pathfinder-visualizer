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

  const [clickFunctions, setClickFunctions] = useState({
    click: null,
    dragClick: null,
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
      } else if (event.buttons) {
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
      }
      if (!val && pointerOver) {
        if (drag) {
          let dragClick = clickFunctions.dragClick;
          if (dragClick) dragClick();
        } else {
          let click = clickFunctions.click;
          if (click) click();
        }
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
