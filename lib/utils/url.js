function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export function urlSearchParams(inputParams) {
  var params = _objectSpread({}, inputParams); // Create a shallow copy to prevent mutation

  Object.keys(params).forEach(function (key) {
    if (params[key] === undefined || params[key] === null || params[key] === "") {
      delete params[key];
    } else if (Array.isArray(params[key])) {
      params[key] = params[key].join(',');
    } else if (_typeof(params[key]) === 'object') {
      params[key] = JSON.stringify(params[key]);
    }
  });
  return new URLSearchParams(params).toString();
}
export function updateRouteParams(pathname, router, params) {
  // Remove keys with undefined values
  Object.keys(params).forEach(function (key) {
    if (params[key] === undefined) {
      delete params[key];
    }
  });
  var embed = JSON.stringify(params.embed || {});
  delete params.embed;
  var queryString = new URLSearchParams(params).toString();
  router.push("".concat(pathname, "?").concat(queryString));
}
export function paramsToObject(queryString) {
  var searchParams = new URLSearchParams(queryString);
  var obj = {};
  var _iterator = _createForOfIteratorHelper(searchParams.entries()),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        _key = _step$value[0],
        value = _step$value[1];
      try {
        // Try to parse as JSON
        obj[_key] = JSON.parse(value);
      } catch (e) {
        // If it's not valid JSON, use the raw value
        obj[_key] = value;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return obj;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ1cmxTZWFyY2hQYXJhbXMiLCJpbnB1dFBhcmFtcyIsInBhcmFtcyIsIl9vYmplY3RTcHJlYWQiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsInVuZGVmaW5lZCIsIkFycmF5IiwiaXNBcnJheSIsImpvaW4iLCJfdHlwZW9mIiwiSlNPTiIsInN0cmluZ2lmeSIsIlVSTFNlYXJjaFBhcmFtcyIsInRvU3RyaW5nIiwidXBkYXRlUm91dGVQYXJhbXMiLCJwYXRobmFtZSIsInJvdXRlciIsImVtYmVkIiwicXVlcnlTdHJpbmciLCJwdXNoIiwiY29uY2F0IiwicGFyYW1zVG9PYmplY3QiLCJzZWFyY2hQYXJhbXMiLCJvYmoiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsImVudHJpZXMiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsIl9zdGVwJHZhbHVlIiwiX3NsaWNlZFRvQXJyYXkiLCJ2YWx1ZSIsInBhcnNlIiwiZSIsImVyciIsImYiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvdXJsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB1cmxTZWFyY2hQYXJhbXMoaW5wdXRQYXJhbXM6IGFueSk6IHN0cmluZyB7XG4gIGNvbnN0IHBhcmFtcyA9IHsgLi4uaW5wdXRQYXJhbXMgfTsgIC8vIENyZWF0ZSBhIHNoYWxsb3cgY29weSB0byBwcmV2ZW50IG11dGF0aW9uXG5cbiAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKHBhcmFtc1trZXldID09PSB1bmRlZmluZWQgfHwgcGFyYW1zW2tleV0gPT09IG51bGwgfHwgcGFyYW1zW2tleV0gPT09IFwiXCIpIHtcbiAgICAgIGRlbGV0ZSBwYXJhbXNba2V5XTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zW2tleV0pKSB7XG4gICAgICBwYXJhbXNba2V5XSA9IHBhcmFtc1trZXldLmpvaW4oJywnKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXNba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHBhcmFtc1trZXldID0gSlNPTi5zdHJpbmdpZnkocGFyYW1zW2tleV0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG5ldyBVUkxTZWFyY2hQYXJhbXMocGFyYW1zKS50b1N0cmluZygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUm91dGVQYXJhbXMocGF0aG5hbWU6IHN0cmluZywgcm91dGVyOiBhbnksIHBhcmFtczogYW55KSB7XG5cbiAgLy8gUmVtb3ZlIGtleXMgd2l0aCB1bmRlZmluZWQgdmFsdWVzXG4gIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChwYXJhbXNba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWxldGUgcGFyYW1zW2tleV07XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZW1iZWQgPSBKU09OLnN0cmluZ2lmeShwYXJhbXMuZW1iZWQgfHwge30pO1xuICBkZWxldGUgcGFyYW1zLmVtYmVkO1xuXG4gIGNvbnN0IHF1ZXJ5U3RyaW5nID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhwYXJhbXMpLnRvU3RyaW5nKCk7XG4gIHJvdXRlci5wdXNoKGAke3BhdGhuYW1lfT8ke3F1ZXJ5U3RyaW5nfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYW1zVG9PYmplY3QocXVlcnlTdHJpbmc6IHN0cmluZyk6IGFueSB7XG4gIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocXVlcnlTdHJpbmcpO1xuICBjb25zdCBvYmo6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcblxuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBzZWFyY2hQYXJhbXMuZW50cmllcygpIGFzIGFueSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBUcnkgdG8gcGFyc2UgYXMgSlNPTlxuICAgICAgb2JqW2tleV0gPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBJZiBpdCdzIG5vdCB2YWxpZCBKU09OLCB1c2UgdGhlIHJhdyB2YWx1ZVxuICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFNBQVNBLGVBQWVBLENBQUNDLFdBQWdCLEVBQVU7RUFDeEQsSUFBTUMsTUFBTSxHQUFBQyxhQUFBLEtBQVFGLFdBQVcsQ0FBRSxDQUFDLENBQUU7O0VBRXBDRyxNQUFNLENBQUNDLElBQUksQ0FBQ0gsTUFBTSxDQUFDLENBQUNJLE9BQU8sQ0FBQyxVQUFBQyxHQUFHLEVBQUk7SUFDakMsSUFBSUwsTUFBTSxDQUFDSyxHQUFHLENBQUMsS0FBS0MsU0FBUyxJQUFJTixNQUFNLENBQUNLLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSUwsTUFBTSxDQUFDSyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUU7TUFDM0UsT0FBT0wsTUFBTSxDQUFDSyxHQUFHLENBQUM7SUFDcEIsQ0FBQyxNQUFNLElBQUlFLEtBQUssQ0FBQ0MsT0FBTyxDQUFDUixNQUFNLENBQUNLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7TUFDckNMLE1BQU0sQ0FBQ0ssR0FBRyxDQUFDLEdBQUdMLE1BQU0sQ0FBQ0ssR0FBRyxDQUFDLENBQUNJLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDckMsQ0FBQyxNQUFNLElBQUlDLE9BQUEsQ0FBT1YsTUFBTSxDQUFDSyxHQUFHLENBQUMsTUFBSyxRQUFRLEVBQUU7TUFDMUNMLE1BQU0sQ0FBQ0ssR0FBRyxDQUFDLEdBQUdNLElBQUksQ0FBQ0MsU0FBUyxDQUFDWixNQUFNLENBQUNLLEdBQUcsQ0FBQyxDQUFDO0lBQzNDO0VBQ0YsQ0FBQyxDQUFDO0VBRUYsT0FBTyxJQUFJUSxlQUFlLENBQUNiLE1BQU0sQ0FBQyxDQUFDYyxRQUFRLENBQUMsQ0FBQztBQUMvQztBQUVBLE9BQU8sU0FBU0MsaUJBQWlCQSxDQUFDQyxRQUFnQixFQUFFQyxNQUFXLEVBQUVqQixNQUFXLEVBQUU7RUFFNUU7RUFDQUUsTUFBTSxDQUFDQyxJQUFJLENBQUNILE1BQU0sQ0FBQyxDQUFDSSxPQUFPLENBQUMsVUFBQUMsR0FBRyxFQUFJO0lBQ2pDLElBQUlMLE1BQU0sQ0FBQ0ssR0FBRyxDQUFDLEtBQUtDLFNBQVMsRUFBRTtNQUM3QixPQUFPTixNQUFNLENBQUNLLEdBQUcsQ0FBQztJQUNwQjtFQUNGLENBQUMsQ0FBQztFQUNGLElBQU1hLEtBQUssR0FBR1AsSUFBSSxDQUFDQyxTQUFTLENBQUNaLE1BQU0sQ0FBQ2tCLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztFQUNoRCxPQUFPbEIsTUFBTSxDQUFDa0IsS0FBSztFQUVuQixJQUFNQyxXQUFXLEdBQUcsSUFBSU4sZUFBZSxDQUFDYixNQUFNLENBQUMsQ0FBQ2MsUUFBUSxDQUFDLENBQUM7RUFDMURHLE1BQU0sQ0FBQ0csSUFBSSxJQUFBQyxNQUFBLENBQUlMLFFBQVEsT0FBQUssTUFBQSxDQUFJRixXQUFXLENBQUUsQ0FBQztBQUMzQztBQUVBLE9BQU8sU0FBU0csY0FBY0EsQ0FBQ0gsV0FBbUIsRUFBTztFQUN2RCxJQUFNSSxZQUFZLEdBQUcsSUFBSVYsZUFBZSxDQUFDTSxXQUFXLENBQUM7RUFDckQsSUFBTUssR0FBMkIsR0FBRyxDQUFDLENBQUM7RUFBQyxJQUFBQyxTQUFBLEdBQUFDLDBCQUFBLENBRVpILFlBQVksQ0FBQ0ksT0FBTyxDQUFDLENBQUM7SUFBQUMsS0FBQTtFQUFBO0lBQWpELEtBQUFILFNBQUEsQ0FBQUksQ0FBQSxNQUFBRCxLQUFBLEdBQUFILFNBQUEsQ0FBQUssQ0FBQSxJQUFBQyxJQUFBLEdBQTBEO01BQUEsSUFBQUMsV0FBQSxHQUFBQyxjQUFBLENBQUFMLEtBQUEsQ0FBQU0sS0FBQTtRQUE5QzdCLElBQUcsR0FBQTJCLFdBQUE7UUFBRUUsS0FBSyxHQUFBRixXQUFBO01BQ3BCLElBQUk7UUFDRjtRQUNBUixHQUFHLENBQUNuQixJQUFHLENBQUMsR0FBR00sSUFBSSxDQUFDd0IsS0FBSyxDQUFDRCxLQUFLLENBQUM7TUFDOUIsQ0FBQyxDQUFDLE9BQU9FLENBQUMsRUFBRTtRQUNWO1FBQ0FaLEdBQUcsQ0FBQ25CLElBQUcsQ0FBQyxHQUFHNkIsS0FBSztNQUNsQjtJQUNGO0VBQUMsU0FBQUcsR0FBQTtJQUFBWixTQUFBLENBQUFXLENBQUEsQ0FBQUMsR0FBQTtFQUFBO0lBQUFaLFNBQUEsQ0FBQWEsQ0FBQTtFQUFBO0VBRUQsT0FBT2QsR0FBRztBQUNaIn0=