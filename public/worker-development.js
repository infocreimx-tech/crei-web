/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/worker/index.ts":
/*!*****************************!*\
  !*** ./src/worker/index.ts ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\nself.addEventListener('push', (event)=>{\n    if (event.data) {\n        const data = event.data.json();\n        const title = data.title || \"Notificación de CREI\";\n        const options = {\n            body: data.body || \"Tienes una nueva actualización\",\n            icon: data.icon || \"/app-logo.png\",\n            badge: \"/icon.svg\",\n            data: data.url ? {\n                url: data.url\n            } : undefined,\n            vibrate: [\n                200,\n                100,\n                200,\n                100,\n                200,\n                100,\n                200\n            ]\n        };\n        event.waitUntil(self.registration.showNotification(title, options));\n    }\n});\nself.addEventListener('notificationclick', (event)=>{\n    event.notification.close();\n    if (event.notification.data && event.notification.data.url) {\n        event.waitUntil(self.clients.matchAll({\n            type: \"window\"\n        }).then((clientList)=>{\n            for (const client of clientList){\n                if (client.url === event.notification.data.url && \"focus\" in client) {\n                    return client.focus();\n                }\n            }\n            if (self.clients.openWindow) {\n                return self.clients.openWindow(event.notification.data.url);\n            }\n        }));\n    }\n});\n// eslint-disable-next-line @typescript-eslint/triple-slash-reference\n/// <reference lib=\"webworker\" />\n\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvd29ya2VyL2luZGV4LnRzIiwibWFwcGluZ3MiOiI7QUFNQUEsS0FBS0MsZ0JBQWdCLENBQUMsUUFBUSxDQUFDQztJQUM3QixJQUFJQSxNQUFNQyxJQUFJLEVBQUU7UUFDZCxNQUFNQSxPQUFPRCxNQUFNQyxJQUFJLENBQUNDLElBQUk7UUFDNUIsTUFBTUMsUUFBUUYsS0FBS0UsS0FBSyxJQUFJO1FBQzVCLE1BQU1DLFVBQVU7WUFDZEMsTUFBTUosS0FBS0ksSUFBSSxJQUFJO1lBQ25CQyxNQUFNTCxLQUFLSyxJQUFJLElBQUk7WUFDbkJDLE9BQU87WUFDUE4sTUFBTUEsS0FBS08sR0FBRyxHQUFHO2dCQUFFQSxLQUFLUCxLQUFLTyxHQUFHO1lBQUMsSUFBSUM7WUFDckNDLFNBQVM7Z0JBQUM7Z0JBQUs7Z0JBQUs7Z0JBQUs7Z0JBQUs7Z0JBQUs7Z0JBQUs7YUFBSTtRQUM5QztRQUVBVixNQUFNVyxTQUFTLENBQUNiLEtBQUtjLFlBQVksQ0FBQ0MsZ0JBQWdCLENBQUNWLE9BQU9DO0lBQzVEO0FBQ0Y7QUFFQU4sS0FBS0MsZ0JBQWdCLENBQUMscUJBQXFCLENBQUNDO0lBQzFDQSxNQUFNYyxZQUFZLENBQUNDLEtBQUs7SUFDeEIsSUFBSWYsTUFBTWMsWUFBWSxDQUFDYixJQUFJLElBQUlELE1BQU1jLFlBQVksQ0FBQ2IsSUFBSSxDQUFDTyxHQUFHLEVBQUU7UUFDMURSLE1BQU1XLFNBQVMsQ0FDYmIsS0FBS2tCLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDO1lBQUVDLE1BQU07UUFBUyxHQUFHQyxJQUFJLENBQUMsQ0FBQ0M7WUFDOUMsS0FBSyxNQUFNQyxVQUFVRCxXQUFZO2dCQUMvQixJQUFJQyxPQUFPYixHQUFHLEtBQUtSLE1BQU1jLFlBQVksQ0FBQ2IsSUFBSSxDQUFDTyxHQUFHLElBQUksV0FBV2EsUUFBUTtvQkFDbkUsT0FBT0EsT0FBT0MsS0FBSztnQkFDckI7WUFDRjtZQUNBLElBQUl4QixLQUFLa0IsT0FBTyxDQUFDTyxVQUFVLEVBQUU7Z0JBQzNCLE9BQU96QixLQUFLa0IsT0FBTyxDQUFDTyxVQUFVLENBQUN2QixNQUFNYyxZQUFZLENBQUNiLElBQUksQ0FBQ08sR0FBRztZQUM1RDtRQUNGO0lBRUo7QUFDRjtBQXRDQSxxRUFBcUU7QUFDckUsaUNBQWlDO0FBRXZCIiwic291cmNlcyI6WyIvVXNlcnMvbHVpc3BhbmlhZ3VhcGFsYWNpb3MvRGVza3RvcC9DUkVJIC9DUkVJL2NyZWktd2ViL3NyYy93b3JrZXIvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC90cmlwbGUtc2xhc2gtcmVmZXJlbmNlXG4vLy8gPHJlZmVyZW5jZSBsaWI9XCJ3ZWJ3b3JrZXJcIiAvPlxuXG5leHBvcnQge307XG5kZWNsYXJlIGNvbnN0IHNlbGY6IFNlcnZpY2VXb3JrZXJHbG9iYWxTY29wZTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdwdXNoJywgKGV2ZW50KSA9PiB7XG4gIGlmIChldmVudC5kYXRhKSB7XG4gICAgY29uc3QgZGF0YSA9IGV2ZW50LmRhdGEuanNvbigpO1xuICAgIGNvbnN0IHRpdGxlID0gZGF0YS50aXRsZSB8fCBcIk5vdGlmaWNhY2nDs24gZGUgQ1JFSVwiO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBib2R5OiBkYXRhLmJvZHkgfHwgXCJUaWVuZXMgdW5hIG51ZXZhIGFjdHVhbGl6YWNpw7NuXCIsXG4gICAgICBpY29uOiBkYXRhLmljb24gfHwgXCIvYXBwLWxvZ28ucG5nXCIsXG4gICAgICBiYWRnZTogXCIvaWNvbi5zdmdcIixcbiAgICAgIGRhdGE6IGRhdGEudXJsID8geyB1cmw6IGRhdGEudXJsIH0gOiB1bmRlZmluZWQsXG4gICAgICB2aWJyYXRlOiBbMjAwLCAxMDAsIDIwMCwgMTAwLCAyMDAsIDEwMCwgMjAwXSxcbiAgICB9O1xuXG4gICAgZXZlbnQud2FpdFVudGlsKHNlbGYucmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24odGl0bGUsIG9wdGlvbnMpKTtcbiAgfVxufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbm90aWZpY2F0aW9uY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgZXZlbnQubm90aWZpY2F0aW9uLmNsb3NlKCk7XG4gIGlmIChldmVudC5ub3RpZmljYXRpb24uZGF0YSAmJiBldmVudC5ub3RpZmljYXRpb24uZGF0YS51cmwpIHtcbiAgICBldmVudC53YWl0VW50aWwoXG4gICAgICBzZWxmLmNsaWVudHMubWF0Y2hBbGwoeyB0eXBlOiBcIndpbmRvd1wiIH0pLnRoZW4oKGNsaWVudExpc3QpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjbGllbnQgb2YgY2xpZW50TGlzdCkge1xuICAgICAgICAgIGlmIChjbGllbnQudXJsID09PSBldmVudC5ub3RpZmljYXRpb24uZGF0YS51cmwgJiYgXCJmb2N1c1wiIGluIGNsaWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudC5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5jbGllbnRzLm9wZW5XaW5kb3cpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5jbGllbnRzLm9wZW5XaW5kb3coZXZlbnQubm90aWZpY2F0aW9uLmRhdGEudXJsKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG59KTtcbiJdLCJuYW1lcyI6WyJzZWxmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiZGF0YSIsImpzb24iLCJ0aXRsZSIsIm9wdGlvbnMiLCJib2R5IiwiaWNvbiIsImJhZGdlIiwidXJsIiwidW5kZWZpbmVkIiwidmlicmF0ZSIsIndhaXRVbnRpbCIsInJlZ2lzdHJhdGlvbiIsInNob3dOb3RpZmljYXRpb24iLCJub3RpZmljYXRpb24iLCJjbG9zZSIsImNsaWVudHMiLCJtYXRjaEFsbCIsInR5cGUiLCJ0aGVuIiwiY2xpZW50TGlzdCIsImNsaWVudCIsImZvY3VzIiwib3BlbldpbmRvdyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/worker/index.ts\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				if (!originalFactory) {
/******/ 					document.location.reload();
/******/ 					return;
/******/ 				}
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/worker/index.ts");
/******/ 	
/******/ })()
;