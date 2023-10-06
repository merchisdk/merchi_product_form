'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip as TT } from 'react-tooltip';

export default function Tooltip({
  children,
  place = 'top',
  tooltip,
}: {
  children: any;
  place?: 'top' | 'bottom' | 'left' | 'right';
  tooltip?: string;
}) {
  const [ttid, setTtid] = useState<string | null>(null);

  useEffect(() => {
    setTtid('id-' + uuidv4());
  }, []);

  return tooltip && ttid ? (
    <>
      <TT
        anchorSelect={`#${ttid}`}
        place={place}
        style={{ zIndex: 2, display: 'block' }}
      >
        {tooltip}
      </TT>
      <span id={ttid}>{children}</span>
    </>
  ) : (
    <>{children}</>
  );
}
