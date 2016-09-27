/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../global/global.ts" />	
var util;
(function (util) {
    var HttpUIBlockService = (function () {
        function HttpUIBlockService(blockUI) {
            var _this = this;
            this.blockUI = blockUI;
            // get UI blocking behavior
            this.getServiceEventMethod = function (message) {
                return function (status) {
                    if (status == 0 /* beforeCall */)
                        _this.blockUI.start(message);
                    else if (status == 1 /* afterCall */)
                        _this.blockUI.stop();
                };
            };
            // get the UI blocking behavior and the delegation
            this.getWrappedEventMethod = function (message, serviceEvent) {
                return function (status) {
                    if (status == 0 /* beforeCall */)
                        _this.blockUI.start(message);
                    else if (status == 1 /* afterCall */)
                        _this.blockUI.stop();
                    serviceEvent(status);
                };
            };
        }
        HttpUIBlockService.$inject = ['blockUI'];
        HttpUIBlockService.className = 'HttpUIBlockService';
        return HttpUIBlockService;
    })();
    util.HttpUIBlockService = HttpUIBlockService;
    moduleRegistration.registerService(moduleNames.services, HttpUIBlockService);
})(util || (util = {}));
//# sourceMappingURL=http.blockui.js.map