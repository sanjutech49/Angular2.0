/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
var docusign;
(function (docusign) {
    var HttpUIStatusService = (function () {
        function HttpUIStatusService(blockUI) {
            var _this = this;
            this.blockUI = blockUI;
            this.save = function (message, saveMethod, happyPathHandler, unhappyPathHandler, displayStatus) {
                if (displayStatus === void 0) { displayStatus = true; }
                return _this.call(message, saveMethod, happyPathHandler, unhappyPathHandler, displayStatus);
            };
            this.load = function (message, loadMethod, happyPathHandler, unhappyPathHandler, displayStatus) {
                if (displayStatus === void 0) { displayStatus = true; }
                return _this.call(message, loadMethod, happyPathHandler, unhappyPathHandler, displayStatus);
            };
            this.call = function (message, method, happyPathHandler, unhappyPathHandler, displayStatus) {
                if (displayStatus)
                    _this.blockUI.start(message);
                return method(function (returnData) {
                    if (displayStatus)
                        _this.blockUI.stop();
                    // use the input happyPath handler, or cast the data as type T
                    if (happyPathHandler)
                        return happyPathHandler(returnData);
                    else
                        return returnData;
                }, function (error) {
                    if (displayStatus)
                        _this.blockUI.stop();
                    if (unhappyPathHandler)
                        unhappyPathHandler(error);
                });
            };
        }
        HttpUIStatusService.className = 'HttpUIStatusService';
        HttpUIStatusService.$inject = ['blockUI'];
        return HttpUIStatusService;
    })();
    docusign.HttpUIStatusService = HttpUIStatusService;
    angular.module('docusign').service(HttpUIStatusService.className, HttpUIStatusService);
})(docusign || (docusign = {}));
//# sourceMappingURL=http.status.service.js.map