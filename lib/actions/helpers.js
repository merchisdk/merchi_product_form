function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
var TransformationType = /*#__PURE__*/function (TransformationType) {
  TransformationType["CAMEL"] = "camel";
  TransformationType["UNDERSCORE"] = "underscore";
  return TransformationType;
}(TransformationType || {});
var functionDict = _defineProperty(_defineProperty({}, TransformationType.CAMEL, camelCase), TransformationType.UNDERSCORE, snakeCase);
function parseJsonKeyNames(jsonObject, standard) {
  if (_typeof(jsonObject) === 'object' && jsonObject !== null) {
    if (Array.isArray(jsonObject)) {
      var _iterator = _createForOfIteratorHelper(jsonObject),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          parseJsonKeyNames(item, standard);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      var oldKeys = Object.keys(jsonObject);
      for (var _i = 0, _oldKeys = oldKeys; _i < _oldKeys.length; _i++) {
        var old = _oldKeys[_i];
        var newKey = functionDict[standard](old);
        if (newKey !== old) {
          jsonObject[newKey] = jsonObject[old];
          delete jsonObject[old];
          parseJsonKeyNames(jsonObject[newKey], standard);
        } else {
          parseJsonKeyNames(jsonObject[old], standard);
        }
      }
    }
  }
  return jsonObject;
}
function parseJsonKeyCamel(jsonObject) {
  return parseJsonKeyNames(jsonObject, TransformationType.CAMEL);
}
export function unpackRecursiveJsonIter(jsonObject, options, fileIndex) {
  if (!options) options = {};
  var result = options.existing || new FormData();
  var prefix = options._prefix || '';
  if (!fileIndex) fileIndex = {
    value: 0
  };
  var appendData = function appendData(name, value) {
    if (prefix) {
      name = prefix + '-' + name;
    }
    if (value !== undefined && value !== null) {
      result.set(name, value.toString()); // Convert to string since FormData accepts only strings or Blobs.
    }
  };
  var processSingleEntityProperty = function processSingleEntityProperty(key, value) {
    var innerPrefix = key + '-0';
    if (prefix) {
      innerPrefix = prefix + '-' + innerPrefix;
    }
    unpackRecursiveJsonIter(value, {
      existing: result,
      _prefix: innerPrefix
    }, fileIndex);
    appendData(key + '-count', '1');
  };
  var _loop = function _loop(_key) {
    if ([undefined, '', null].includes(jsonObject[_key]) || _key === 'rights') {
      return 1; // continue
    }
    if (Array.isArray(jsonObject[_key])) {
      jsonObject[_key].forEach(function (item, index) {
        if ((_typeof(item) === "object" || Array.isArray(item)) && item !== null) {
          var arrayPrefix = prefix ? "".concat(prefix, "-").concat(_key, "-").concat(index) : "".concat(_key, "-").concat(index);
          unpackRecursiveJsonIter(item, {
            existing: result,
            _prefix: arrayPrefix
          }, fileIndex);
        } else {
          appendData("".concat(_key, "-").concat(index), item);
        }
      });
      appendData(_key + '-count', jsonObject[_key].length.toString());
    } else if (_typeof(jsonObject[_key]) === "object" && jsonObject[_key] !== null) {
      processSingleEntityProperty(_key, jsonObject[_key]);
    } else {
      appendData(_key, jsonObject[_key]);
    }
  };
  for (var _key in jsonObject) {
    if (_loop(_key)) continue;
  }
  return result;
}
function isJsonFlat(jsonObject) {
  for (var _key2 in jsonObject) {
    if (jsonObject.hasOwnProperty(_key2)) {
      var value = jsonObject[_key2];
      if (_typeof(value) === 'object' && value !== null) {
        return false;
      }
    }
  }
  return true;
}
export function encodeMerchiApiData(dataDict) {
  var dataJson = parseJsonKeyCamel(dataDict);
  return unpackRecursiveJsonIter(dataJson);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjYW1lbENhc2UiLCJzbmFrZUNhc2UiLCJUcmFuc2Zvcm1hdGlvblR5cGUiLCJmdW5jdGlvbkRpY3QiLCJfZGVmaW5lUHJvcGVydHkiLCJDQU1FTCIsIlVOREVSU0NPUkUiLCJwYXJzZUpzb25LZXlOYW1lcyIsImpzb25PYmplY3QiLCJzdGFuZGFyZCIsIl90eXBlb2YiLCJBcnJheSIsImlzQXJyYXkiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwiaXRlbSIsInZhbHVlIiwiZXJyIiwiZSIsImYiLCJvbGRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIl9pIiwiX29sZEtleXMiLCJsZW5ndGgiLCJvbGQiLCJuZXdLZXkiLCJwYXJzZUpzb25LZXlDYW1lbCIsInVucGFja1JlY3Vyc2l2ZUpzb25JdGVyIiwib3B0aW9ucyIsImZpbGVJbmRleCIsInJlc3VsdCIsImV4aXN0aW5nIiwiRm9ybURhdGEiLCJwcmVmaXgiLCJfcHJlZml4IiwiYXBwZW5kRGF0YSIsIm5hbWUiLCJ1bmRlZmluZWQiLCJzZXQiLCJ0b1N0cmluZyIsInByb2Nlc3NTaW5nbGVFbnRpdHlQcm9wZXJ0eSIsImtleSIsImlubmVyUHJlZml4IiwiX2xvb3AiLCJfa2V5IiwiaW5jbHVkZXMiLCJmb3JFYWNoIiwiaW5kZXgiLCJhcnJheVByZWZpeCIsImNvbmNhdCIsImlzSnNvbkZsYXQiLCJoYXNPd25Qcm9wZXJ0eSIsImVuY29kZU1lcmNoaUFwaURhdGEiLCJkYXRhRGljdCIsImRhdGFKc29uIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbnMvaGVscGVycy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2FtZWxDYXNlIGZyb20gJ2xvZGFzaC9jYW1lbENhc2UnO1xuaW1wb3J0IHNuYWtlQ2FzZSBmcm9tICdsb2Rhc2gvc25ha2VDYXNlJztcblxuaW50ZXJmYWNlIEpzb25PYmplY3Qge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmVudW0gVHJhbnNmb3JtYXRpb25UeXBlIHtcbiAgQ0FNRUwgPSBcImNhbWVsXCIsXG4gIFVOREVSU0NPUkUgPSBcInVuZGVyc2NvcmVcIlxufVxuXG5jb25zdCBmdW5jdGlvbkRpY3Q6IHsgW2tleSBpbiBUcmFuc2Zvcm1hdGlvblR5cGVdOiAod29yZDogc3RyaW5nKSA9PiBzdHJpbmcgfSA9IHtcbiAgW1RyYW5zZm9ybWF0aW9uVHlwZS5DQU1FTF06IGNhbWVsQ2FzZSxcbiAgW1RyYW5zZm9ybWF0aW9uVHlwZS5VTkRFUlNDT1JFXTogc25ha2VDYXNlXG59O1xuXG5mdW5jdGlvbiBwYXJzZUpzb25LZXlOYW1lcyhqc29uT2JqZWN0OiBhbnksIHN0YW5kYXJkOiBrZXlvZiB0eXBlb2YgZnVuY3Rpb25EaWN0KTogYW55IHtcbiAgaWYgKHR5cGVvZiBqc29uT2JqZWN0ID09PSAnb2JqZWN0JyAmJiBqc29uT2JqZWN0ICE9PSBudWxsKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoanNvbk9iamVjdCkpIHtcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YganNvbk9iamVjdCkge1xuICAgICAgICBwYXJzZUpzb25LZXlOYW1lcyhpdGVtLCBzdGFuZGFyZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG9sZEtleXMgPSBPYmplY3Qua2V5cyhqc29uT2JqZWN0KTtcbiAgICAgIGZvciAobGV0IG9sZCBvZiBvbGRLZXlzKSB7XG4gICAgICAgIGNvbnN0IG5ld0tleSA9IGZ1bmN0aW9uRGljdFtzdGFuZGFyZF0ob2xkKTtcbiAgICAgICAgaWYgKG5ld0tleSAhPT0gb2xkKSB7XG4gICAgICAgICAganNvbk9iamVjdFtuZXdLZXldID0ganNvbk9iamVjdFtvbGRdO1xuICAgICAgICAgIGRlbGV0ZSBqc29uT2JqZWN0W29sZF07XG4gICAgICAgICAgcGFyc2VKc29uS2V5TmFtZXMoanNvbk9iamVjdFtuZXdLZXldLCBzdGFuZGFyZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyc2VKc29uS2V5TmFtZXMoanNvbk9iamVjdFtvbGRdLCBzdGFuZGFyZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGpzb25PYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHBhcnNlSnNvbktleUNhbWVsKGpzb25PYmplY3Q6IGFueSkge1xuICByZXR1cm4gcGFyc2VKc29uS2V5TmFtZXMoanNvbk9iamVjdCwgVHJhbnNmb3JtYXRpb25UeXBlLkNBTUVMKTtcbn1cblxuaW50ZXJmYWNlIENvdW50ZXIge1xuICB2YWx1ZTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgU2VyaWFsaXNlT3B0aW9ucyB7XG4gIGV4aXN0aW5nPzogRm9ybURhdGE7XG4gIGV4Y2x1ZGVPbGQ/OiBib29sZWFuO1xuICBfcHJlZml4Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5wYWNrUmVjdXJzaXZlSnNvbkl0ZXIoanNvbk9iamVjdDogSnNvbk9iamVjdCwgb3B0aW9ucz86IFNlcmlhbGlzZU9wdGlvbnMsIGZpbGVJbmRleD86IENvdW50ZXIpOiBGb3JtRGF0YSB7XG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICBjb25zdCByZXN1bHQgPSBvcHRpb25zLmV4aXN0aW5nIHx8IG5ldyBGb3JtRGF0YSgpO1xuICBjb25zdCBwcmVmaXggPSBvcHRpb25zLl9wcmVmaXggfHwgJyc7XG5cbiAgaWYgKCFmaWxlSW5kZXgpIGZpbGVJbmRleCA9IHsgdmFsdWU6IDAgfTtcblxuICBjb25zdCBhcHBlbmREYXRhID0gKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xuICAgIGlmIChwcmVmaXgpIHtcbiAgICAgIG5hbWUgPSBwcmVmaXggKyAnLScgKyBuYW1lO1xuICAgIH1cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgcmVzdWx0LnNldChuYW1lLCB2YWx1ZS50b1N0cmluZygpKTsgIC8vIENvbnZlcnQgdG8gc3RyaW5nIHNpbmNlIEZvcm1EYXRhIGFjY2VwdHMgb25seSBzdHJpbmdzIG9yIEJsb2JzLlxuICAgIH1cbiAgfTtcblxuICBjb25zdCBwcm9jZXNzU2luZ2xlRW50aXR5UHJvcGVydHkgPSAoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcbiAgICBsZXQgaW5uZXJQcmVmaXggPSBrZXkgKyAnLTAnO1xuICAgIGlmIChwcmVmaXgpIHtcbiAgICAgIGlubmVyUHJlZml4ID0gcHJlZml4ICsgJy0nICsgaW5uZXJQcmVmaXg7XG4gICAgfVxuICAgIHVucGFja1JlY3Vyc2l2ZUpzb25JdGVyKHZhbHVlLCB7IGV4aXN0aW5nOiByZXN1bHQsIF9wcmVmaXg6IGlubmVyUHJlZml4IH0sIGZpbGVJbmRleCk7XG4gICAgYXBwZW5kRGF0YShrZXkgKyAnLWNvdW50JywgJzEnKTtcbiAgfTtcblxuICBmb3IgKGNvbnN0IGtleSBpbiBqc29uT2JqZWN0KSB7XG4gICAgaWYgKFt1bmRlZmluZWQsICcnLCBudWxsXS5pbmNsdWRlcyhqc29uT2JqZWN0W2tleV0pIHx8IGtleSA9PT0gJ3JpZ2h0cycpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KGpzb25PYmplY3Rba2V5XSkpIHtcbiAgICAgIGpzb25PYmplY3Rba2V5XS5mb3JFYWNoKChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgaWYgKCh0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KGl0ZW0pKSAmJiBpdGVtICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgYXJyYXlQcmVmaXggPSBwcmVmaXggPyBgJHtwcmVmaXh9LSR7a2V5fS0ke2luZGV4fWAgOiBgJHtrZXl9LSR7aW5kZXh9YDtcbiAgICAgICAgICB1bnBhY2tSZWN1cnNpdmVKc29uSXRlcihpdGVtLCB7IGV4aXN0aW5nOiByZXN1bHQsIF9wcmVmaXg6IGFycmF5UHJlZml4IH0sIGZpbGVJbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXBwZW5kRGF0YShgJHtrZXl9LSR7aW5kZXh9YCwgaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXBwZW5kRGF0YShrZXkgKyAnLWNvdW50JywganNvbk9iamVjdFtrZXldLmxlbmd0aC50b1N0cmluZygpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBqc29uT2JqZWN0W2tleV0gPT09IFwib2JqZWN0XCIgJiYganNvbk9iamVjdFtrZXldICE9PSBudWxsKSB7XG4gICAgICBwcm9jZXNzU2luZ2xlRW50aXR5UHJvcGVydHkoa2V5LCBqc29uT2JqZWN0W2tleV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHBlbmREYXRhKGtleSwganNvbk9iamVjdFtrZXldKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpc0pzb25GbGF0KGpzb25PYmplY3Q6IGFueSk6IGJvb2xlYW4ge1xuICBmb3IgKGxldCBrZXkgaW4ganNvbk9iamVjdCkge1xuICAgIGlmIChqc29uT2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0ganNvbk9iamVjdFtrZXldO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZU1lcmNoaUFwaURhdGEoZGF0YURpY3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgY29uc3QgZGF0YUpzb24gPSBwYXJzZUpzb25LZXlDYW1lbChkYXRhRGljdCk7XG4gIHJldHVybiB1bnBhY2tSZWN1cnNpdmVKc29uSXRlcihkYXRhSnNvbik7XG59XG4iXSwibWFwcGluZ3MiOiI7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