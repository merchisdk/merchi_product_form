"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const uuid_1 = require("uuid");
const react_tooltip_1 = require("react-tooltip");
const TooltipElement = ({ children, place = 'top', tooltip }) => {
    // Generate a unique ID immediately for the tooltip anchor.
    const ttid = `id-${(0, uuid_1.v4)()}`;
    // Only render the Tooltip if a tooltip text is provided.
    const renderTooltip = tooltip ? ((0, jsx_runtime_1.jsx)(react_tooltip_1.Tooltip, { anchorSelect: `#${ttid}`, place: place, style: { zIndex: 2, display: 'block' }, children: tooltip })) : null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { id: ttid, role: "tooltip", "aria-describedby": tooltip ? ttid : undefined, children: children }), renderTooltip] }));
};
exports.default = TooltipElement;
