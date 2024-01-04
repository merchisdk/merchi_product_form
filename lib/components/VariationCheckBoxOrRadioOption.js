'use client';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import { useController } from 'react-hook-form';
import VariationFieldOptionDefaultInputs from './VariationFieldOptionDefaultInputs';
import { variationFieldOptionCostDetail } from './utils';
import { useMerchiFormContext } from './MerchiProductFormProvider';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function VariationCheckBoxOrRadioOption(_ref) {
  var disabled = _ref.disabled,
    index = _ref.index,
    inputType = _ref.inputType,
    _ref$isAvailable = _ref.isAvailable,
    isAvailable = _ref$isAvailable === void 0 ? true : _ref$isAvailable,
    name = _ref.name,
    option = _ref.option,
    variation = _ref.variation;
  var _useMerchiFormContext = useMerchiFormContext(),
    classNameOptionContainer = _useMerchiFormContext.classNameOptionContainer,
    classNameOptionInput = _useMerchiFormContext.classNameOptionInput,
    classNameOptionLabel = _useMerchiFormContext.classNameOptionLabel,
    classNameOptionSuper = _useMerchiFormContext.classNameOptionSuper,
    getQuote = _useMerchiFormContext.getQuote,
    control = _useMerchiFormContext.control;
  var _useController = useController({
      name: "".concat(name, ".value"),
      control: control
    }),
    field = _useController.field;
  var variationField = variation.variationField;
  var sellerProductEditable = variationField.sellerProductEditable;
  var id = option.id,
    value = option.value;
  var optionCost = variationFieldOptionCostDetail(option);
  var outOfStock = !isAvailable ? ' - insufficient stock' : '';
  var outOfStockOrCost = outOfStock || optionCost;
  var activeIds = (field.value || '').split(',');
  var isActive = activeIds.includes(String(id));
  var handleChange = function handleChange(e) {
    var updatedIds = _toConsumableArray(activeIds);
    if (sellerProductEditable || inputType === 'checkbox') {
      // Checkbox Logic
      if (e.target.checked && !updatedIds.includes(String(id))) {
        updatedIds.push(String(id));
      } else if (!e.target.checked) {
        updatedIds = updatedIds.filter(function (existingId) {
          return existingId !== String(id);
        });
      }
    } else if (inputType === 'radio') {
      // Radio Logic
      updatedIds = [String(id)];
    }
    field.onChange(updatedIds.join(','));
    getQuote();
  };
  return /*#__PURE__*/_jsxs("div", {
    className: classNameOptionContainer,
    children: [/*#__PURE__*/_jsx(VariationFieldOptionDefaultInputs, {
      option: option,
      optionName: "".concat(name, ".variationField.options[").concat(index, "]")
    }), /*#__PURE__*/_jsx("input", {
      className: classNameOptionInput,
      checked: isActive,
      type: sellerProductEditable ? 'checkbox' : inputType,
      disabled: disabled || !isAvailable,
      value: id,
      name: "".concat(name, ".value"),
      onChange: handleChange
    }), /*#__PURE__*/_jsx("label", {
      className: classNameOptionLabel,
      children: value
    }), outOfStockOrCost && /*#__PURE__*/_jsxs("span", {
      className: classNameOptionSuper,
      children: [outOfStock, " ", optionCost]
    })]
  });
}
export default VariationCheckBoxOrRadioOption;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfdG9Db25zdW1hYmxlQXJyYXkiLCJhcnIiLCJfYXJyYXlXaXRob3V0SG9sZXMiLCJfaXRlcmFibGVUb0FycmF5IiwiX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IiwiX25vbkl0ZXJhYmxlU3ByZWFkIiwiVHlwZUVycm9yIiwibyIsIm1pbkxlbiIsIl9hcnJheUxpa2VUb0FycmF5IiwibiIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsInNsaWNlIiwiY29uc3RydWN0b3IiLCJuYW1lIiwiQXJyYXkiLCJmcm9tIiwidGVzdCIsIml0ZXIiLCJTeW1ib2wiLCJpdGVyYXRvciIsImlzQXJyYXkiLCJsZW4iLCJsZW5ndGgiLCJpIiwiYXJyMiIsInVzZUNvbnRyb2xsZXIiLCJWYXJpYXRpb25GaWVsZE9wdGlvbkRlZmF1bHRJbnB1dHMiLCJ2YXJpYXRpb25GaWVsZE9wdGlvbkNvc3REZXRhaWwiLCJ1c2VNZXJjaGlGb3JtQ29udGV4dCIsImpzeCIsIl9qc3giLCJqc3hzIiwiX2pzeHMiLCJWYXJpYXRpb25DaGVja0JveE9yUmFkaW9PcHRpb24iLCJfcmVmIiwiZGlzYWJsZWQiLCJpbmRleCIsImlucHV0VHlwZSIsIl9yZWYkaXNBdmFpbGFibGUiLCJpc0F2YWlsYWJsZSIsIm9wdGlvbiIsInZhcmlhdGlvbiIsIl91c2VNZXJjaGlGb3JtQ29udGV4dCIsImNsYXNzTmFtZU9wdGlvbkNvbnRhaW5lciIsImNsYXNzTmFtZU9wdGlvbklucHV0IiwiY2xhc3NOYW1lT3B0aW9uTGFiZWwiLCJjbGFzc05hbWVPcHRpb25TdXBlciIsImdldFF1b3RlIiwiY29udHJvbCIsIl91c2VDb250cm9sbGVyIiwiY29uY2F0IiwiZmllbGQiLCJ2YXJpYXRpb25GaWVsZCIsInNlbGxlclByb2R1Y3RFZGl0YWJsZSIsImlkIiwidmFsdWUiLCJvcHRpb25Db3N0Iiwib3V0T2ZTdG9jayIsIm91dE9mU3RvY2tPckNvc3QiLCJhY3RpdmVJZHMiLCJzcGxpdCIsImlzQWN0aXZlIiwiaW5jbHVkZXMiLCJTdHJpbmciLCJoYW5kbGVDaGFuZ2UiLCJlIiwidXBkYXRlZElkcyIsInRhcmdldCIsImNoZWNrZWQiLCJwdXNoIiwiZmlsdGVyIiwiZXhpc3RpbmdJZCIsIm9uQ2hhbmdlIiwiam9pbiIsImNsYXNzTmFtZSIsImNoaWxkcmVuIiwib3B0aW9uTmFtZSIsInR5cGUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9WYXJpYXRpb25DaGVja0JveE9yUmFkaW9PcHRpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcbmltcG9ydCB7IHVzZUNvbnRyb2xsZXIgfSBmcm9tICdyZWFjdC1ob29rLWZvcm0nO1xuaW1wb3J0IFZhcmlhdGlvbkZpZWxkT3B0aW9uRGVmYXVsdElucHV0cyBmcm9tICcuL1ZhcmlhdGlvbkZpZWxkT3B0aW9uRGVmYXVsdElucHV0cyc7XG5pbXBvcnQgeyB2YXJpYXRpb25GaWVsZE9wdGlvbkNvc3REZXRhaWwgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHVzZU1lcmNoaUZvcm1Db250ZXh0IH0gZnJvbSAnLi9NZXJjaGlQcm9kdWN0Rm9ybVByb3ZpZGVyJztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICBpbmRleDogbnVtYmVyO1xuICBpbnB1dFR5cGU/OiBzdHJpbmc7XG4gIGlzQXZhaWxhYmxlOiBib29sZWFuO1xuICBuYW1lOiBzdHJpbmc7XG4gIG9wdGlvbjogYW55O1xuICB2YXJpYXRpb246IGFueTtcbn1cblxuZnVuY3Rpb24gVmFyaWF0aW9uQ2hlY2tCb3hPclJhZGlvT3B0aW9uKHtcbiAgZGlzYWJsZWQsXG4gIGluZGV4LFxuICBpbnB1dFR5cGUsXG4gIGlzQXZhaWxhYmxlID0gdHJ1ZSxcbiAgbmFtZSxcbiAgb3B0aW9uLFxuICB2YXJpYXRpb24sXG59OiBQcm9wcykge1xuICBjb25zdCB7XG4gICAgY2xhc3NOYW1lT3B0aW9uQ29udGFpbmVyLFxuICAgIGNsYXNzTmFtZU9wdGlvbklucHV0LFxuICAgIGNsYXNzTmFtZU9wdGlvbkxhYmVsLFxuICAgIGNsYXNzTmFtZU9wdGlvblN1cGVyLFxuICAgIGdldFF1b3RlLFxuICAgIGNvbnRyb2wsIC8vIE5ld2x5IGFkZGVkIGZyb20gdGhlIGNvbnRleHRcbiAgfSA9IHVzZU1lcmNoaUZvcm1Db250ZXh0KCk7XG4gIGNvbnN0IHsgZmllbGQgfSA9IHVzZUNvbnRyb2xsZXIoe1xuICAgIG5hbWU6IGAke25hbWV9LnZhbHVlYCxcbiAgICBjb250cm9sLFxuICB9KTtcbiAgY29uc3QgeyB2YXJpYXRpb25GaWVsZCB9ID0gdmFyaWF0aW9uO1xuICBjb25zdCB7IHNlbGxlclByb2R1Y3RFZGl0YWJsZSB9ID0gdmFyaWF0aW9uRmllbGQ7XG4gIGNvbnN0IHsgaWQsIHZhbHVlIH0gPSBvcHRpb247XG4gIGNvbnN0IG9wdGlvbkNvc3QgPSB2YXJpYXRpb25GaWVsZE9wdGlvbkNvc3REZXRhaWwob3B0aW9uKTtcbiAgY29uc3Qgb3V0T2ZTdG9jayA9ICFpc0F2YWlsYWJsZSA/ICcgLSBpbnN1ZmZpY2llbnQgc3RvY2snIDogJyc7XG4gIGNvbnN0IG91dE9mU3RvY2tPckNvc3QgPSBvdXRPZlN0b2NrIHx8IG9wdGlvbkNvc3Q7XG4gIGNvbnN0IGFjdGl2ZUlkcyA9IChmaWVsZC52YWx1ZSB8fCAnJykuc3BsaXQoJywnKTtcbiAgY29uc3QgaXNBY3RpdmUgPSBhY3RpdmVJZHMuaW5jbHVkZXMoU3RyaW5nKGlkKSk7XG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgbGV0IHVwZGF0ZWRJZHMgPSBbLi4uYWN0aXZlSWRzXTtcblxuICAgIGlmIChzZWxsZXJQcm9kdWN0RWRpdGFibGUgfHwgaW5wdXRUeXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAvLyBDaGVja2JveCBMb2dpY1xuICAgICAgaWYgKGUudGFyZ2V0LmNoZWNrZWQgJiYgIXVwZGF0ZWRJZHMuaW5jbHVkZXMoU3RyaW5nKGlkKSkpIHtcbiAgICAgICAgdXBkYXRlZElkcy5wdXNoKFN0cmluZyhpZCkpO1xuICAgICAgfSBlbHNlIGlmICghZS50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICB1cGRhdGVkSWRzID0gdXBkYXRlZElkcy5maWx0ZXIoXG4gICAgICAgICAgKGV4aXN0aW5nSWQpID0+IGV4aXN0aW5nSWQgIT09IFN0cmluZyhpZClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlucHV0VHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgLy8gUmFkaW8gTG9naWNcbiAgICAgIHVwZGF0ZWRJZHMgPSBbU3RyaW5nKGlkKV07XG4gICAgfVxuXG4gICAgZmllbGQub25DaGFuZ2UodXBkYXRlZElkcy5qb2luKCcsJykpO1xuXG4gICAgZ2V0UXVvdGUoKTtcbiAgfTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lT3B0aW9uQ29udGFpbmVyfT5cbiAgICAgIDxWYXJpYXRpb25GaWVsZE9wdGlvbkRlZmF1bHRJbnB1dHNcbiAgICAgICAgb3B0aW9uPXtvcHRpb259XG4gICAgICAgIG9wdGlvbk5hbWU9e2Ake25hbWV9LnZhcmlhdGlvbkZpZWxkLm9wdGlvbnNbJHtpbmRleH1dYH1cbiAgICAgIC8+XG4gICAgICA8aW5wdXRcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVPcHRpb25JbnB1dH1cbiAgICAgICAgY2hlY2tlZD17aXNBY3RpdmV9XG4gICAgICAgIHR5cGU9e3NlbGxlclByb2R1Y3RFZGl0YWJsZSA/ICdjaGVja2JveCcgOiBpbnB1dFR5cGV9XG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZCB8fCAhaXNBdmFpbGFibGV9XG4gICAgICAgIHZhbHVlPXtpZH1cbiAgICAgICAgbmFtZT17YCR7bmFtZX0udmFsdWVgfVxuICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgLz5cbiAgICAgIDxsYWJlbCBjbGFzc05hbWU9e2NsYXNzTmFtZU9wdGlvbkxhYmVsfT57dmFsdWV9PC9sYWJlbD5cbiAgICAgIHtvdXRPZlN0b2NrT3JDb3N0ICYmIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWVPcHRpb25TdXBlcn0+XG4gICAgICAgICAge291dE9mU3RvY2t9IHtvcHRpb25Db3N0fVxuICAgICAgICA8L3NwYW4+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBWYXJpYXRpb25DaGVja0JveE9yUmFkaW9PcHRpb247XG4iXSwibWFwcGluZ3MiOiJBQUFBLFlBQVk7O0FBQUMsU0FBQUEsbUJBQUFDLEdBQUEsV0FBQUMsa0JBQUEsQ0FBQUQsR0FBQSxLQUFBRSxnQkFBQSxDQUFBRixHQUFBLEtBQUFHLDJCQUFBLENBQUFILEdBQUEsS0FBQUksa0JBQUE7QUFBQSxTQUFBQSxtQkFBQSxjQUFBQyxTQUFBO0FBQUEsU0FBQUYsNEJBQUFHLENBQUEsRUFBQUMsTUFBQSxTQUFBRCxDQUFBLHFCQUFBQSxDQUFBLHNCQUFBRSxpQkFBQSxDQUFBRixDQUFBLEVBQUFDLE1BQUEsT0FBQUUsQ0FBQSxHQUFBQyxNQUFBLENBQUFDLFNBQUEsQ0FBQUMsUUFBQSxDQUFBQyxJQUFBLENBQUFQLENBQUEsRUFBQVEsS0FBQSxhQUFBTCxDQUFBLGlCQUFBSCxDQUFBLENBQUFTLFdBQUEsRUFBQU4sQ0FBQSxHQUFBSCxDQUFBLENBQUFTLFdBQUEsQ0FBQUMsSUFBQSxNQUFBUCxDQUFBLGNBQUFBLENBQUEsbUJBQUFRLEtBQUEsQ0FBQUMsSUFBQSxDQUFBWixDQUFBLE9BQUFHLENBQUEsK0RBQUFVLElBQUEsQ0FBQVYsQ0FBQSxVQUFBRCxpQkFBQSxDQUFBRixDQUFBLEVBQUFDLE1BQUE7QUFBQSxTQUFBTCxpQkFBQWtCLElBQUEsZUFBQUMsTUFBQSxvQkFBQUQsSUFBQSxDQUFBQyxNQUFBLENBQUFDLFFBQUEsYUFBQUYsSUFBQSwrQkFBQUgsS0FBQSxDQUFBQyxJQUFB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