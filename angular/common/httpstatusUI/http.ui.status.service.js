/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var common;
(function (common) {
    var HttpUIStatusService = (function () {
        function HttpUIStatusService(blockUI, simpleModalWindowFactory, commonModalWindowFactory, modalWindowType) {
            var _this = this;
            this.blockUI = blockUI;
            this.simpleModalWindowFactory = simpleModalWindowFactory;
            this.commonModalWindowFactory = commonModalWindowFactory;
            this.modalWindowType = modalWindowType;
            this.save = function (message, saveMethod, happyPathHandler, unhappyPathHandler, displayStatus) {
                if (displayStatus === void 0) { displayStatus = true; }
                return _this.call(message, 'ERROR_SAVE_MODAL', saveMethod, happyPathHandler, unhappyPathHandler, displayStatus);
            };
            this.load = function (message, loadMethod, happyPathHandler, unhappyPathHandler, displayStatus) {
                if (displayStatus === void 0) { displayStatus = true; }
                return _this.call(message, 'ERROR_LOAD_MODAL', loadMethod, happyPathHandler, unhappyPathHandler, displayStatus);
            };
            this.call = function (message, mode, method, happyPathHandler, unhappyPathHandler, displayStatus) {
                if (displayStatus)
                    _this.commonModalWindowFactory.open({ type: _this.modalWindowType.loader, message: message });
                return method(function (returnData) {
                    if (displayStatus)
                        _this.commonModalWindowFactory.close();
                    // use the input happyPath handler, or cast the data as type T
                    if (happyPathHandler)
                        return happyPathHandler(returnData);
                    else
                        return returnData;
                }, function (error) {
                    if (displayStatus)
                        _this.commonModalWindowFactory.close();
                    if (unhappyPathHandler)
                        unhappyPathHandler(error);
                    _this.simpleModalWindowFactory.trigger(mode);
                });
            };
        }
        HttpUIStatusService.className = 'HttpUIStatusService';
        HttpUIStatusService.$inject = ['blockUI', 'simpleModalWindowFactory', 'commonModalWindowFactory', 'modalWindowType'];
        return HttpUIStatusService;
    })();
    common.HttpUIStatusService = HttpUIStatusService;
    angular.module('http.ui.status').service(HttpUIStatusService.className, HttpUIStatusService);
})(common || (common = {}));
//# sourceMappingURL=http.ui.status.service.js.map