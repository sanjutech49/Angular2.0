var usda;
(function (usda) {
    var service;
    (function (service) {
        'use strict';
        var USDACenterService = (function () {
            function USDACenterService() {
            }
            USDACenterService.$inject = [];
            return USDACenterService;
        })();
        service.USDACenterService = USDACenterService;
        angular.module('usdaCenter').service('usdaCenterService', USDACenterService);
    })(service = usda.service || (usda.service = {}));
})(usda || (usda = {}));
//# sourceMappingURL=usdacenter.service.js.map