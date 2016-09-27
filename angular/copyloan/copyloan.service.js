/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
var copyLoan;
(function (copyLoan) {
    var service;
    (function (service) {
        'use strict';
        var CopyLoanService = (function () {
            function CopyLoanService($resource, apiRoot) {
                var _this = this;
                this.$resource = $resource;
                this.apiRoot = apiRoot;
                this.duplicateLoan = function (request) {
                    return _this.$resource(_this.apiPath).save(request);
                };
                this.apiPath = apiRoot + 'CopyLoanService/';
            }
            CopyLoanService.$inject = ['$resource', 'apiRoot'];
            CopyLoanService.className = 'copyLoanService';
            return CopyLoanService;
        })();
        service.CopyLoanService = CopyLoanService;
        angular.module('copyLoan').service('copyLoanService', CopyLoanService);
    })(service = copyLoan.service || (copyLoan.service = {}));
})(copyLoan || (copyLoan = {}));
//# sourceMappingURL=copyloan.service.js.map