'use client';
import Tooltip from '../Tooltip';

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
      <Tooltip tooltip={tooltip}>
  	    <span className={c} style={style} />
      </Tooltip>
    : <span className={c} style={style} />
    );
}

export default IconCountryFlag;
