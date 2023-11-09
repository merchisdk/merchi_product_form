'use client';
import React from 'react';

function Collapse({ isOpen, children }: any) {
  const [height, setHeight] = React.useState(isOpen ? 'auto' : '0');
  const ref = React.useRef(null);

  React.useEffect(() => {
    setHeight(isOpen ? `${(ref as any).current.scrollHeight}px` : '0');
  }, [isOpen]);

  return (
    <div
      className={`merchi-collapse ${isOpen ? 'show' : ''}`}
      ref={ref}
      style={{ transition: 'height 0.35s ease', overflow: 'hidden', height }}
    >
      {children}
    </div>
  );
}

export default Collapse;
