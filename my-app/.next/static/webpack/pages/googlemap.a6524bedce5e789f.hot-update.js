"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/googlemap",{

/***/ "./src/pages/googlemap.js":
/*!********************************!*\
  !*** ./src/pages/googlemap.js ***!
  \********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ googlemap; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n// import React from \"react\";\n// import GoogleMapReact from \"google-map-react\";\n// import MobileHeader from \"@/components/MobileHeader\";\n// import DesktopHeader from \"@/components/DesktopHeader\";\n// import { useMediaQuery } from \"@chakra-ui/react\";\n// const AnyReactComponent = ({ text }) => <div>{text}</div>;\n// export default function googlemap() {\n//     const [isDesktop] = useMediaQuery(\"(min-width: 1025px)\");\n//   const defaultProps = {\n//     center: {\n//       lat: 10.99835602,\n//       lng: 77.01502627,\n//     },\n//     zoom: 11,\n//   };\n//   return (\n//     // Important! Always set the container height explicitly\n//     <div>\n//       <div className=\"headers\">\n//         {isDesktop ? <DesktopHeader /> : <MobileHeader />}\n//       </div>\n//       <div style={{ height: \"70vh\", width: \"85%\" ,marginLeft:\"10%\",marginTop:\"3%\"}}>\n//         <GoogleMapReact\n//           bootstrapURLKeys={{ key: \"\" }}\n//           defaultCenter={defaultProps.center}\n//           defaultZoom={defaultProps.zoom}\n//         >\n//           <AnyReactComponent lat={59.955413} lng={30.337844} text=\"My Marker\" />\n//         </GoogleMapReact>\n//       </div>\n//     </div>\n//   );\n// }\n\nfunction googlemap() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"iframe\", {\n            src: \"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29542.59243415947!2d68.94879391436048!3d22.246753523800926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39569c266399e37b%3A0xb5866e461a106e0a!2sDwarka%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1717755135628!5m2!1sen!2sin\",\n            width: \"600\",\n            height: \"450\",\n            style: \"border:0;\",\n            allowfullscreen: \"\",\n            loading: \"lazy\",\n            referrerpolicy: \"no-referrer-when-downgrade\"\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\Lenovo\\\\Downloads\\\\Patanjali-App-main\\\\my-app\\\\src\\\\pages\\\\googlemap.js\",\n            lineNumber: 42,\n            columnNumber: 13\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Lenovo\\\\Downloads\\\\Patanjali-App-main\\\\my-app\\\\src\\\\pages\\\\googlemap.js\",\n        lineNumber: 41,\n        columnNumber: 9\n    }, this);\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvZ29vZ2xlbWFwLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDZCQUE2QjtBQUM3QixpREFBaUQ7QUFDakQsd0RBQXdEO0FBQ3hELDBEQUEwRDtBQUMxRCxvREFBb0Q7QUFHcEQsNkRBQTZEO0FBRTdELHdDQUF3QztBQUN4QyxnRUFBZ0U7QUFDaEUsMkJBQTJCO0FBQzNCLGdCQUFnQjtBQUNoQiwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCLFNBQVM7QUFDVCxnQkFBZ0I7QUFDaEIsT0FBTztBQUVQLGFBQWE7QUFDYiwrREFBK0Q7QUFDL0QsWUFBWTtBQUNaLGtDQUFrQztBQUNsQyw2REFBNkQ7QUFDN0QsZUFBZTtBQUNmLHVGQUF1RjtBQUN2RiwwQkFBMEI7QUFDMUIsMkNBQTJDO0FBQzNDLGdEQUFnRDtBQUNoRCw0Q0FBNEM7QUFDNUMsWUFBWTtBQUNaLG1GQUFtRjtBQUNuRiw0QkFBNEI7QUFDNUIsZUFBZTtBQUNmLGFBQWE7QUFDYixPQUFPO0FBQ1AsSUFBSTs7QUFFVyxTQUFTQTtJQUNwQixxQkFDSSw4REFBQ0M7a0JBQ0csNEVBQUNDO1lBQU9DLEtBQUk7WUFBbVJDLE9BQU07WUFBTUMsUUFBTztZQUFNQyxPQUFNO1lBQVlDLGlCQUFnQjtZQUFHQyxTQUFRO1lBQU9DLGdCQUFlOzs7Ozs7Ozs7OztBQUd2WSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvcGFnZXMvZ29vZ2xlbWFwLmpzPzI5YzMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG4vLyBpbXBvcnQgR29vZ2xlTWFwUmVhY3QgZnJvbSBcImdvb2dsZS1tYXAtcmVhY3RcIjtcclxuLy8gaW1wb3J0IE1vYmlsZUhlYWRlciBmcm9tIFwiQC9jb21wb25lbnRzL01vYmlsZUhlYWRlclwiO1xyXG4vLyBpbXBvcnQgRGVza3RvcEhlYWRlciBmcm9tIFwiQC9jb21wb25lbnRzL0Rlc2t0b3BIZWFkZXJcIjtcclxuLy8gaW1wb3J0IHsgdXNlTWVkaWFRdWVyeSB9IGZyb20gXCJAY2hha3JhLXVpL3JlYWN0XCI7XHJcblxyXG5cclxuLy8gY29uc3QgQW55UmVhY3RDb21wb25lbnQgPSAoeyB0ZXh0IH0pID0+IDxkaXY+e3RleHR9PC9kaXY+O1xyXG5cclxuLy8gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ29vZ2xlbWFwKCkge1xyXG4vLyAgICAgY29uc3QgW2lzRGVza3RvcF0gPSB1c2VNZWRpYVF1ZXJ5KFwiKG1pbi13aWR0aDogMTAyNXB4KVwiKTtcclxuLy8gICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XHJcbi8vICAgICBjZW50ZXI6IHtcclxuLy8gICAgICAgbGF0OiAxMC45OTgzNTYwMixcclxuLy8gICAgICAgbG5nOiA3Ny4wMTUwMjYyNyxcclxuLy8gICAgIH0sXHJcbi8vICAgICB6b29tOiAxMSxcclxuLy8gICB9O1xyXG5cclxuLy8gICByZXR1cm4gKFxyXG4vLyAgICAgLy8gSW1wb3J0YW50ISBBbHdheXMgc2V0IHRoZSBjb250YWluZXIgaGVpZ2h0IGV4cGxpY2l0bHlcclxuLy8gICAgIDxkaXY+XHJcbi8vICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyc1wiPlxyXG4vLyAgICAgICAgIHtpc0Rlc2t0b3AgPyA8RGVza3RvcEhlYWRlciAvPiA6IDxNb2JpbGVIZWFkZXIgLz59XHJcbi8vICAgICAgIDwvZGl2PlxyXG4vLyAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogXCI3MHZoXCIsIHdpZHRoOiBcIjg1JVwiICxtYXJnaW5MZWZ0OlwiMTAlXCIsbWFyZ2luVG9wOlwiMyVcIn19PlxyXG4vLyAgICAgICAgIDxHb29nbGVNYXBSZWFjdFxyXG4vLyAgICAgICAgICAgYm9vdHN0cmFwVVJMS2V5cz17eyBrZXk6IFwiXCIgfX1cclxuLy8gICAgICAgICAgIGRlZmF1bHRDZW50ZXI9e2RlZmF1bHRQcm9wcy5jZW50ZXJ9XHJcbi8vICAgICAgICAgICBkZWZhdWx0Wm9vbT17ZGVmYXVsdFByb3BzLnpvb219XHJcbi8vICAgICAgICAgPlxyXG4vLyAgICAgICAgICAgPEFueVJlYWN0Q29tcG9uZW50IGxhdD17NTkuOTU1NDEzfSBsbmc9ezMwLjMzNzg0NH0gdGV4dD1cIk15IE1hcmtlclwiIC8+XHJcbi8vICAgICAgICAgPC9Hb29nbGVNYXBSZWFjdD5cclxuLy8gICAgICAgPC9kaXY+XHJcbi8vICAgICA8L2Rpdj5cclxuLy8gICApO1xyXG4vLyB9XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnb29nbGVtYXAoKXtcclxuICAgIHJldHVybihcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8aWZyYW1lIHNyYz1cImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9lbWJlZD9wYj0hMW0xOCExbTEyITFtMyExZDI5NTQyLjU5MjQzNDE1OTQ3ITJkNjguOTQ4NzkzOTE0MzYwNDghM2QyMi4yNDY3NTM1MjM4MDA5MjYhMm0zITFmMCEyZjAhM2YwITNtMiExaTEwMjQhMmk3NjghNGYxMy4xITNtMyExbTIhMXMweDM5NTY5YzI2NjM5OWUzN2IlM0EweGI1ODY2ZTQ2MWExMDZlMGEhMnNEd2Fya2ElMkMlMjBHdWphcmF0ITVlMCEzbTIhMXNlbiEyc2luITR2MTcxNzc1NTEzNTYyOCE1bTIhMXNlbiEyc2luXCIgd2lkdGg9XCI2MDBcIiBoZWlnaHQ9XCI0NTBcIiBzdHlsZT1cImJvcmRlcjowO1wiIGFsbG93ZnVsbHNjcmVlbj1cIlwiIGxvYWRpbmc9XCJsYXp5XCIgcmVmZXJyZXJwb2xpY3k9XCJuby1yZWZlcnJlci13aGVuLWRvd25ncmFkZVwiPjwvaWZyYW1lPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJnb29nbGVtYXAiLCJkaXYiLCJpZnJhbWUiLCJzcmMiLCJ3aWR0aCIsImhlaWdodCIsInN0eWxlIiwiYWxsb3dmdWxsc2NyZWVuIiwibG9hZGluZyIsInJlZmVycmVycG9saWN5Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/googlemap.js\n"));

/***/ })

});