import { useState } from 'react';

const MouseDetector = ({ className, child, setMouseDown }) => {
  //const [mouseDown, setMouseDown] = useState(false);
  const toggleMouseDown = (val) => {
    setMouseDown(val);
  };
  const toggleMouseOver = (event, val) => {
    if (!val) setMouseDown(false);
    else if (event.buttons) setMouseDown(true);
  };

  return (
    <div
      className={className}
      onPointerDown={(e) => toggleMouseDown(true)}
      onPointerUp={(e) => toggleMouseDown(false)}
      onPointerEnter={(e) => toggleMouseOver(e, true)}
      onPointerLeave={(e) => toggleMouseOver(e, false)}
      onPointerOver={(e) => toggleMouseOver(e, true)}
    >
      {child}
    </div>
  );
};

export default MouseDetector;
