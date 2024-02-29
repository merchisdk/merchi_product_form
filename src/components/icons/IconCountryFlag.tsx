'use client';
import * as React from 'react';
import TooltipElement from '../TooltipElement';

interface Props {
  className?: string;
  countryCode: string;
  tooltip?: string;
}

function IconCountryFlag(
  {
    className, countryCode, tooltip
  }: Props) {
  const c = `fi fi-${countryCode} ${className ? className : ''}`;
  const style = {borderRadius: '2px'}
  return (
    tooltip ?
      <TooltipElement
        id={`merchi-country-flag_tooltip-${countryCode}`}
        tooltip={tooltip}
      >
  	    <span className={c} style={style}></span>
      </TooltipElement>
    : <span className={c} style={style}></span>
  );
}

export default IconCountryFlag;
