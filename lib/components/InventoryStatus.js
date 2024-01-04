'use client';

import { useMerchiFormContext } from './MerchiProductFormProvider';
import { CgSpinner } from 'react-icons/cg';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function StatusDot(_ref) {
  var color = _ref.color;
  return /*#__PURE__*/_jsx("span", {
    className: "badge",
    style: {
      backgroundColor: '#fff',
      display: 'flex',
      padding: '3px',
      borderRadius: '100%',
      margin: '0 1px'
    },
    children: /*#__PURE__*/_jsx("div", {
      className: "inventory-icon-indicator",
      style: {
        backgroundColor: color,
        borderRadius: '100%',
        height: 8,
        width: 8
      }
    })
  });
}
function InventoryStatus(_ref2) {
  var _ref2$inventoryCount = _ref2.inventoryCount,
    inventoryCount = _ref2$inventoryCount === void 0 ? 0 : _ref2$inventoryCount,
    inventorySufficient = _ref2.inventorySufficient;
  var _useMerchiFormContext = useMerchiFormContext(),
    classNameInventoryStatus = _useMerchiFormContext.classNameInventoryStatus,
    loading = _useMerchiFormContext.loading;
  var color = '#65cf85';
  var msg = 'In stock';
  if (!inventorySufficient) {
    color = '#ff4449';
    msg = 'no stock';
    if (inventoryCount) {
      color = '#ffc928';
      msg = "insufficient stock (".concat(inventoryCount, " in stock)");
    }
  }
  return /*#__PURE__*/_jsx("div", {
    className: "".concat(classNameInventoryStatus, " merchi-embed-form_product-group-inventory-status"),
    style: {
      background: color
    },
    children: loading ? /*#__PURE__*/_jsx(CgSpinner, {
      fontSize: "1.1rem",
      className: "animate_spin"
    }) : /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(StatusDot, {
        color: color
      }), " ", /*#__PURE__*/_jsx("span", {
        className: "mr-1",
        children: msg
      })]
    })
  });
}
export default InventoryStatus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ1c2VNZXJjaGlGb3JtQ29udGV4dCIsIkNnU3Bpbm5lciIsImpzeCIsIl9qc3giLCJGcmFnbWVudCIsIl9GcmFnbWVudCIsImpzeHMiLCJfanN4cyIsIlN0YXR1c0RvdCIsIl9yZWYiLCJjb2xvciIsImNsYXNzTmFtZSIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiZGlzcGxheSIsInBhZGRpbmciLCJib3JkZXJSYWRpdXMiLCJtYXJnaW4iLCJjaGlsZHJlbiIsImhlaWdodCIsIndpZHRoIiwiSW52ZW50b3J5U3RhdHVzIiwiX3JlZjIiLCJfcmVmMiRpbnZlbnRvcnlDb3VudCIsImludmVudG9yeUNvdW50IiwiaW52ZW50b3J5U3VmZmljaWVudCIsIl91c2VNZXJjaGlGb3JtQ29udGV4dCIsImNsYXNzTmFtZUludmVudG9yeVN0YXR1cyIsImxvYWRpbmciLCJtc2ciLCJjb25jYXQiLCJiYWNrZ3JvdW5kIiwiZm9udFNpemUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9JbnZlbnRvcnlTdGF0dXMudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcbmltcG9ydCB7IHVzZU1lcmNoaUZvcm1Db250ZXh0IH0gZnJvbSAnLi9NZXJjaGlQcm9kdWN0Rm9ybVByb3ZpZGVyJztcbmltcG9ydCB7IENnU3Bpbm5lciB9IGZyb20gJ3JlYWN0LWljb25zL2NnJztcblxuZnVuY3Rpb24gU3RhdHVzRG90KHsgY29sb3IgfTogYW55KSB7XG4gIHJldHVybiAoXG4gICAgPHNwYW5cbiAgICAgIGNsYXNzTmFtZT0nYmFkZ2UnXG4gICAgICBzdHlsZT17e1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBwYWRkaW5nOiAnM3B4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgIG1hcmdpbjogJzAgMXB4JyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J2ludmVudG9yeS1pY29uLWluZGljYXRvcidcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yLFxuICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgIGhlaWdodDogOCxcbiAgICAgICAgICB3aWR0aDogOCxcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgPC9zcGFuPlxuICApO1xufVxuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBpbnZlbnRvcnlDb3VudDogbnVtYmVyO1xuICBpbnZlbnRvcnlTdWZmaWNpZW50OiBib29sZWFuO1xufVxuXG5mdW5jdGlvbiBJbnZlbnRvcnlTdGF0dXMoeyBpbnZlbnRvcnlDb3VudCA9IDAsIGludmVudG9yeVN1ZmZpY2llbnQgfTogUHJvcHMpIHtcbiAgY29uc3QgeyBjbGFzc05hbWVJbnZlbnRvcnlTdGF0dXMsIGxvYWRpbmcgfSA9IHVzZU1lcmNoaUZvcm1Db250ZXh0KCk7XG4gIGxldCBjb2xvciA9ICcjNjVjZjg1JztcbiAgbGV0IG1zZyA9ICdJbiBzdG9jayc7XG4gIGlmICghaW52ZW50b3J5U3VmZmljaWVudCkge1xuICAgIGNvbG9yID0gJyNmZjQ0NDknO1xuICAgIG1zZyA9ICdubyBzdG9jayc7XG4gICAgaWYgKGludmVudG9yeUNvdW50KSB7XG4gICAgICBjb2xvciA9ICcjZmZjOTI4JztcbiAgICAgIG1zZyA9IGBpbnN1ZmZpY2llbnQgc3RvY2sgKCR7aW52ZW50b3J5Q291bnR9IGluIHN0b2NrKWA7XG4gICAgfVxuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtgJHtjbGFzc05hbWVJbnZlbnRvcnlTdGF0dXN9IG1lcmNoaS1lbWJlZC1mb3JtX3Byb2R1Y3QtZ3JvdXAtaW52ZW50b3J5LXN0YXR1c2B9XG4gICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiBjb2xvciB9fVxuICAgID5cbiAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICA8Q2dTcGlubmVyIGZvbnRTaXplPScxLjFyZW0nIGNsYXNzTmFtZT0nYW5pbWF0ZV9zcGluJyAvPlxuICAgICAgKSA6IChcbiAgICAgICAgPD5cbiAgICAgICAgICA8U3RhdHVzRG90IGNvbG9yPXtjb2xvcn0gLz4gPHNwYW4gY2xhc3NOYW1lPSdtci0xJz57bXNnfTwvc3Bhbj5cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBJbnZlbnRvcnlTdGF0dXM7XG4iXSwibWFwcGluZ3MiOiJBQUFBLFlBQVk7O0FBQ1osU0FBU0Esb0JBQW9CLFFBQVEsNkJBQTZCO0FBQ2xFLFNBQVNDLFNBQVMsUUFBUSxnQkFBZ0I7QUFBQyxTQUFBQyxHQUFBLElBQUFDLElBQUE7QUFBQSxTQUFBQyxRQUFBLElBQUFDLFNBQUE7QUFBQSxTQUFBQyxJQUFBLElBQUFDLEtBQUE7QUFFM0MsU0FBU0MsU0FBU0EsQ0FBQUMsSUFBQSxFQUFpQjtFQUFBLElBQWRDLEtBQUssR0FBQUQsSUFBQSxDQUFMQyxLQUFLO0VBQ3hCLG9CQUNFUCxJQUFBO0lBQ0VRLFNBQVMsRUFBQyxPQUFPO0lBQ2pCQyxLQUFLLEVBQUU7TUFDTEMsZUFBZSxFQUFFLE1BQU07TUFDdkJDLE9BQU8sRUFBRSxNQUFNO01BQ2ZDLE9BQU8sRUFBRSxLQUFLO01BQ2RDLFlBQVksRUFBRSxNQUFNO01BQ3BCQyxNQUFNLEVBQUU7SUFDVixDQUFFO0lBQUFDLFFBQUEsZUFFRmYsSUFBQTtNQUNFUSxTQUFTLEVBQUMsMEJBQTBCO01BQ3BDQyxLQUFLLEVBQUU7UUFDTEMsZUFBZSxFQUFFSCxLQUFLO1FBQ3RCTSxZQUFZLEVBQUUsTUFBTTtRQUNwQkcsTUFBTSxFQUFFLENBQUM7UUFDVEMsS0FBSyxFQUFFO01BQ1Q7SUFBRSxDQUNIO0VBQUMsQ0FDRSxDQUFDO0FBRVg7QUFPQSxTQUFTQyxlQUFlQSxDQUFBQyxLQUFBLEVBQXFEO0VBQUEsSUFBQUMsb0JBQUEsR0FBQUQsS0FBQSxDQUFsREUsY0FBYztJQUFkQSxjQUFjLEdBQUFELG9CQUFBLGNBQUcsQ0FBQyxHQUFBQSxvQkFBQTtJQUFFRSxtQkFBbUIsR0FBQUgsS0FBQSxDQUFuQkcsbUJBQW1CO0VBQ2hFLElBQUFDLHFCQUFBLEdBQThDMUIsb0JBQW9CLENBQUMsQ0FBQztJQUE1RDJCLHdCQUF3QixHQUFBRCxxQkFBQSxDQUF4QkMsd0JBQXdCO0lBQUVDLE9BQU8sR0FBQUYscUJBQUEsQ0FBUEUsT0FBTztFQUN6QyxJQUFJbEIsS0FBSyxHQUFHLFNBQVM7RUFDckIsSUFBSW1CLEdBQUcsR0FBRyxVQUFVO0VBQ3BCLElBQUksQ0FBQ0osbUJBQW1CLEVBQUU7SUFDeEJmLEtBQUssR0FBRyxTQUFTO0lBQ2pCbUIsR0FBRyxHQUFHLFVBQVU7SUFDaEIsSUFBSUwsY0FBYyxFQUFFO01BQ2xCZCxLQUFLLEdBQUcsU0FBUztNQUNqQm1CLEdBQUcsMEJBQUFDLE1BQUEsQ0FBMEJOLGNBQWMsZUFBWTtJQUN6RDtFQUNGO0VBQ0Esb0JBQ0VyQixJQUFBO0lBQ0VRLFNBQVMsS0FBQW1CLE1BQUEsQ0FBS0gsd0JBQXdCLHNEQUFvRDtJQUMxRmYsS0FBSyxFQUFFO01BQUVtQixVQUFVLEVBQUVyQjtJQUFNLENBQUU7SUFBQVEsUUFBQSxFQUU1QlUsT0FBTyxnQkFDTnpCLElBQUEsQ0FBQ0YsU0FBUztNQUFDK0IsUUFBUSxFQUFDLFFBQVE7TUFBQ3JCLFNBQVMsRUFBQztJQUFjLENBQUUsQ0FBQyxnQkFFeERKLEtBQUEsQ0FBQUYsU0FBQTtNQUFBYSxRQUFBLGdCQUNFZixJQUFBLENBQUNLLFNBQVM7UUFBQ0UsS0FBSyxFQUFFQTtNQUFNLENBQUUsQ0FBQyxLQUFDLGVBQUFQLElBQUE7UUFBTVEsU0FBUyxFQUFDLE1BQU07UUFBQU8sUUFBQSxFQUFFVztNQUFHLENBQU8sQ0FBQztJQUFBLENBQy9EO0VBQ0gsQ0FDRSxDQUFDO0FBRVY7QUFFQSxlQUFlUixlQUFlIn0=