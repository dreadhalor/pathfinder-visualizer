import { useEffect, useRef } from 'react';

const DrawWrapper = ({ children, refToUse, style, className }) => {
  const data = useRef();
  // console.log('wrapper rendered');
  useEffect(() => {
    data.current = new Map();
    for (let child of refToUse.current.children) data.current.set(child.id, { mouseOver: false });
  });
  const getChild = (uuid) => data.current.get(uuid) ?? null;

  const moved = (event) => {
    let [x, y] = [event.clientX, event.clientY];
    for (let child of refToUse.current.children) {
      let rect = child.getBoundingClientRect();
      let child_data = getChild(child.id);
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        if (!child_data.mouseOver) {
          child_data.mouseOver = true;
          child.dispatchEvent(
            new CustomEvent('customPointerEnter', {
              detail: {
                buttons: event.buttons,
              },
            })
          );
        }
      } else if (child_data.mouseOver) {
        child_data.mouseOver = false;
        child.dispatchEvent(
          new CustomEvent('customPointerLeave', {
            detail: {
              buttons: event.buttons,
            },
          })
        );
      }
    }
  };
  const pointerDown = (event) => {
    let [x, y] = [event.clientX, event.clientY];
    for (let child of refToUse.current.children) {
      let rect = child.getBoundingClientRect();
      let child_data = getChild(child.id);
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        child_data.mouseOver = true;
        child.dispatchEvent(
          new CustomEvent('customPointerDown', {
            detail: {
              buttons: event.buttons,
            },
          })
        );
      } else if (child_data.mouseOver) {
        child_data.mouseOver = false;
        child.dispatchEvent(
          new CustomEvent('customPointerLeave', {
            detail: {
              buttons: event.buttons,
            },
          })
        );
      }
    }
  };
  const pointerUp = (event) => {
    let [x, y] = [event.clientX, event.clientY];
    for (let child of refToUse.current.children) {
      let rect = child.getBoundingClientRect();
      let child_data = getChild(child.id);
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        child.dispatchEvent(
          new CustomEvent('customPointerUp', {
            detail: {
              buttons: event.buttons,
            },
          })
        );
      } else if (child_data.mouseOver) {
        child_data.mouseOver = false;
        child.dispatchEvent(
          new CustomEvent('customPointerLeave', {
            detail: {
              buttons: event.buttons,
            },
          })
        );
      }
    }
  };

  return (
    <div
      className={className}
      style={style}
      onPointerMove={moved}
      onPointerDown={pointerDown}
      onPointerUp={pointerUp}
    >
      {children}
    </div>
  );
};

export default DrawWrapper;
