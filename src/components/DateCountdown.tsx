import * as React from 'react';
import TooltipElement from './TooltipElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';

interface CountProps {
  className?: string;
  style?: React.CSSProperties;
  timeEnd: number;
  callback?: Function;
  hideSeconds?: boolean;
  model?: string;
  options?: {
    atTimeCallback?: {
      time: number;
      callback: Function;
    };
  };
}


interface CountState {
  timeEnd: number;
  timeUp: boolean;
  d ?: number | string;
  h ?: number | string;
  m ?: number | string;
  s ?: number | string;
}

export class CountdownTimer extends React.Component<CountProps, CountState> {
  public static defaultProps = {
    model: 'text',
  };
  public state: CountState = {
    timeEnd: this.props.timeEnd,
    timeUp: false,
  };
  public timeCount: any;
  public componentDidMount() {
    this.timeCount = setInterval(this.count.bind(this), 1000);
  }
  public count() {
    const {timeEnd} = this.state;
    const {options, callback} = this.props;
    if (options !== undefined) {
      const {atTimeCallback} = options;
      if (atTimeCallback !== undefined && timeEnd !== undefined
           && atTimeCallback.time !== undefined &&
           atTimeCallback.callback !== undefined) {
          if (atTimeCallback.time === timeEnd * 1000) {
            atTimeCallback.callback();
          }
      }
    }
    let d;
    let h;
    let m;
    let s;
    let rest;

    if (timeEnd >= 0) {
      rest = timeEnd;
      s = Math.floor(rest % 60);
      rest = rest / 60;
      m = Math.floor(rest % 60);
      rest = rest / 60;
      h = Math.floor(rest % 24);
      rest = rest / 24;
      d = Math.floor(rest);
      let newTimeEnd = timeEnd - 1;
      this.setState({
        d: d,
        h: h,
        m: m,
        s: s,
        timeEnd: newTimeEnd,
      });
    } else {
      clearInterval(this.timeCount);
      if (typeof callback === 'function') {
        callback();
      }
      this.setState({timeUp: true});
    }
  }
  public componentWillUnmount() {
    clearInterval(this.timeCount);
  }
  public render() {
    const {d, h, m, s, timeUp} = this.state;
    const {className, hideSeconds = false, style, model} = this.props;
    let qs = s ? s + 's' : '';
    let qm = m ? m + 'm ' : '';
    let qh = h ? h + 'h ' : '';
    let qd = d ? d + 'd ' : '';
    let result ;

    if (d !== undefined) {
      switch (model) {
        case 'standard':
          result = `${qh} : ${qm} : ${qs}`;
          break;
        case 'text':
          result = `${qd}${qh}${qm}${!hideSeconds ? qs : ''}`;
          break;
      }
    }
    return (
      <span className={className} style={style}>
        {timeUp ? 'time is up' : result}
      </span>
    );
  }
}

interface Props {
  containerClass?: string;
  deadline: number;
  hideSeconds?: boolean;
  icon?: any;
  tooltip?: string;
}

function DateCountdown(props: Props) {
  const {
    containerClass = 'd-inline-block text-ellipsis',
    deadline,
    hideSeconds = true,
    icon = faStopwatch,
    tooltip,
  } = props;
  const idCountdownDate = 'merchi-countdown-date'
  const now = new Date().getTime() / 1000;
  const faIcon = <FontAwesomeIcon icon={icon} />;
  const countdown = (
    <CountdownTimer
      hideSeconds={hideSeconds}
      timeEnd={deadline - now}
      model='text'
    />
  );
  return (
    <div className={containerClass}>
      {tooltip ? (
        <TooltipElement
          id={idCountdownDate}
          tooltip={tooltip}
        >
          {faIcon} {countdown}
        </TooltipElement>
      ) : (
        <>
          {faIcon} {countdown}
        </>
      )}
    </div>
  );
}

export default DateCountdown;
