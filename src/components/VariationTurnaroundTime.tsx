'use client';
import * as React from 'react';
import TooltipElement from './TooltipElement';
import { sortByPosition, variationFieldOptionCostDetail } from './utils';
import IconCheckedOrNoStock from './icons/IconCheckedOrNoStock';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';


/**
 * Formats a date for display
 */
function formatDate(date: Date): { dayName: string; dayNumber: string; month: string } {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    dayName: dayNames[date.getDay()],
    dayNumber: String(date.getDate()),
    month: monthNames[date.getMonth()],
  };
}

interface TurnaroundOptionProps {
  disabled?: boolean;
  name: string;
  onChange?: () => void;
  option: any;
  variation: any;
  considerBusinessHours: boolean;
  shippingTimeIncluded: boolean;
}

function TurnaroundOption({
  disabled,
  name,
  onChange,
  option,
  variation,
  considerBusinessHours,
  shippingTimeIncluded,
}: TurnaroundOptionProps) {
  const { hookForm, getQuote } = useMerchiFormContext();
  const { register, watch } = hookForm;
  const { selectedOptions = [] } = variation;
  const { available = true, isVisible = true, userDeadline, value, optionId } = option;

  const selectedValues = selectedOptions.map((o: any) => o.optionId);
  const optionCost = variationFieldOptionCostDetail(option);
  const isSelected = selectedValues ? selectedValues.includes(optionId) : false;
  
  // Watch form value for real-time updates
  const watchedValue = watch(`${name}.value`);
  const isActive = watchedValue ? String(watchedValue) === String(optionId) : isSelected;
  
  // Calculate the turnaround date based on days value
  const days = parseInt(value, 10) || 0;
  
  const formattedDate = userDeadline ? formatDate(new Date(userDeadline * 1000)) : null;
  const isDisabled = disabled || !available || !isVisible;
  const outOfStock = !isVisible ? ' - disabled' : !available ? ' - insufficient stock' : '';
  
  const deliveryLabel = shippingTimeIncluded ? 'Delivery by' : 'Produced by';
  const tooltipText = formattedDate
    ? `${days} day${days !== 1 ? 's' : ''} - ${deliveryLabel} ${formattedDate.dayName}, ${formattedDate.month} ${formattedDate.dayNumber}${outOfStock}`
    : `${days} day${days !== 1 ? 's' : ''} - ${deliveryLabel}${outOfStock}`;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register(`${name}.value`).onChange(e);
    if (onChange) onChange();
    getQuote();
  };

  return (
    <div
      className={`turnaround-option ${isActive ? 'turnaround-option-selected' : ''} ${isDisabled ? 'turnaround-option-disabled' : ''}`}
    >
      <label className="turnaround-option-label">
        <input
          type="radio"
          className="turnaround-option-input"
          defaultChecked={isSelected}
          disabled={isDisabled}
          value={optionId}
          {...register(`${name}.value`, { onChange: handleOnChange })}
        />
        <TooltipElement tooltip={tooltipText}>
          <div className="turnaround-option-box">
            <IconCheckedOrNoStock
              isChecked={isActive}
              noStock={!available}
            />
            {formattedDate && (
              <div className="turnaround-option-date">
                <span className="turnaround-option-month">{formattedDate.month}</span>
                <span className="turnaround-option-day">{formattedDate.dayNumber}</span>
                <span className="turnaround-option-dayname">{formattedDate.dayName}</span>
              </div>
            )}
            <div className="turnaround-option-days">
              {days} day{days !== 1 ? 's' : ''}
            </div>
          </div>
        </TooltipElement>
        {optionCost && (
          <small className="turnaround-option-cost">
            {optionCost}
          </small>
        )}
      </label>
    </div>
  );
}

interface Props {
  disabled?: boolean;
  name: string;
  onChange?: () => void;
  variation: any;
}

function VariationTurnaroundTime({
  disabled,
  name,
  onChange,
  variation,
}: Props) {
  const { selectableOptions = [], variationField = {} } = variation;
  const { considerBusinessHours = false, shippingTimeIncluded = false } = variationField;

  return (
    <div className="merchi-turnaround-time-container">
      <VariationLabel
        variationClassName="merchi-turnaround-time"
        forceHideCost={true}
        variation={variation}
      />
      <div className="turnaround-options-grid">
        {sortByPosition(selectableOptions).map((option: any) => (
          <TurnaroundOption
            key={`${option.optionId}-${name}-turnaround`}
            disabled={disabled}
            name={name}
            onChange={onChange}
            option={option}
            variation={variation}
            considerBusinessHours={considerBusinessHours}
            shippingTimeIncluded={shippingTimeIncluded}
          />
        ))}
      </div>
      <VariationError name={name} />
      
      <style>{`
        .merchi-turnaround-time-container {
          margin-bottom: 1rem;
        }
        
        .turnaround-options-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.5rem;
        }
        
        .turnaround-option {
          position: relative;
        }
        
        .turnaround-option-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          margin: 0;
        }
        
        .turnaround-option-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .turnaround-option-box {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 90px;
          height: 100px;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          background: #fff;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .turnaround-option-box:hover {
          border-color: #adb5bd;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .turnaround-option-selected .turnaround-option-box {
          border-color: #303dbf;
          background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
          box-shadow: 0 4px 12px rgba(48, 61, 191, 0.2);
        }
        
        .turnaround-option-disabled .turnaround-option-box {
          background: #f8f9fa;
          border-color: #dee2e6;
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .turnaround-option-disabled .turnaround-option-label {
          cursor: not-allowed;
        }
        
        .turnaround-option-box i,
        .turnaround-option-box svg {
          position: absolute;
          top: -8px;
          right: -8px;
          border-radius: 50%;
          background: #fff;
          padding: 2px;
          color: #303dbf;
          font-size: 18px !important;
          animation: fadeInOpacity 0.2s ease;
        }
        
        .turnaround-option-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.2;
        }
        
        .turnaround-option-month {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #dc3545;
          letter-spacing: 0.5px;
        }
        
        .turnaround-option-day {
          font-size: 1.75rem;
          font-weight: 700;
          color: #212529;
          line-height: 1;
        }
        
        .turnaround-option-dayname {
          font-size: 0.7rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .turnaround-option-days {
          font-size: 0.65rem;
          color: #6c757d;
          margin-top: 4px;
          padding: 2px 6px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        
        .turnaround-option-selected .turnaround-option-days {
          background: rgba(48, 61, 191, 0.1);
          color: #303dbf;
        }
        
        .turnaround-option-cost {
          display: block;
          margin-top: 4px;
          font-size: 0.75rem;
          color: #6c757d;
          text-align: center;
        }
        
        @keyframes fadeInOpacity {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default VariationTurnaroundTime;

