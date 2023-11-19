"use client";
import { FC, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Tooltip from 'react-tooltip';

interface Props {
  children: ReactNode;
  place?: 'top' | 'bottom' | 'left' | 'right';
  tooltip?: string;
}

const TooltipElement: FC<Props> = ({ children, place = 'top', tooltip }) => {
  // Generate a unique ID immediately for the tooltip anchor.
  const ttid = `id-${uuidv4()}`;
  console.log(Tooltip, 'debug here 1');
  console.log(children);
  console.log(uuidv4)
  console.log('this thing');

  // Only render the Tooltip if a tooltip text is provided.
  const renderTooltip = tooltip ? (
    <Tooltip.Tooltip
      anchorSelect={`#${ttid}`}
      place={place}
      style={{ zIndex: 2, display: 'block' }}
    >
      {tooltip}
    </Tooltip.Tooltip>
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
