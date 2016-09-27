var compliancecenter;
(function (compliancecenter) {
    'use strict';
    var AuditLogService = (function () {
        function AuditLogService($http, ApiRoot) {
            this.$http = $http;
            this.ApiRoot = ApiRoot;
        }
        AuditLogService.prototype.getData = function (loanId, userAccountId) {
            var getDataApiUrl = this.ApiRoot + 'AuditLog/Get';
            var parameters = {
                loanId: loanId,
                userAccountId: userAccountId
            };
            var config = { params: parameters };
            return this.$http.get(getDataApiUrl, config).then(function (response) {
                return response.data;
            });
        };
        return AuditLogService;
    })();
    factory.$inject = [
        '$http',
        'apiRoot'
    ];
    function factory($http, apiEndpoint) {
        return new AuditLogService($http, apiEndpoint);
    }
    angular.module('compliancecenter').factory('auditLogSvc', factory);
})(compliancecenter || (compliancecenter = {}));
//# sourceMappingURL=auditlog.service.js.map