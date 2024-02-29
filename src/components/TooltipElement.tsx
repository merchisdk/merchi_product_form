"use client";
import { FC, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from 'react-tooltip';

interface Props {
  children: ReactNode;
  id?: string;
  place?: 'top' | 'bottom' | 'left' | 'right';
  tooltip?: string;
}

const TooltipElement: FC<Props> = ({ children, id, place = 'top', tooltip }) => {
  // Generate a unique ID immediately for the tooltip anchor.
  const ttid = id || `id-${uuidv4()}`;

  // Only render the Tooltip if a tooltip text is provided.
  const renderTooltip = tooltip ? (
    <Tooltip
      anchorSelect={`#${ttid}`}
      place={place}
      style={{ zIndex: 2, display: 'block' }}
    >
      {tooltip}
    </Tooltip>
  ) : <></>;

  return (
    <>
      {children &&
        <span id={ttid} role="tooltip">
          {children}
        </span>
      }
      {renderTooltip}
    </>
  );
};

export default TooltipElement;
