var complianceEase;
(function (complianceEase) {
    var service;
    (function (service) {
        'use strict';
        var ComplianceEaseService = (function () {
            function ComplianceEaseService(apiRoot, $resource, $q, $log, $interval) {
                var _this = this;
                this.apiRoot = apiRoot;
                this.$resource = $resource;
                this.$q = $q;
                this.$log = $log;
                this.$interval = $interval;
                /*
                 * @desc: Submits new request to ComplianceEase
                */
                this.submit = function (request) {
                    return _this.$resource(_this.apiPath).save(request);
                };
                /*
                 * @desc: Gets ComplianceEase Data
                */
                this.getComplianceData = function (loanId, userAccountId) {
                    return _this.$resource(_this.apiPath, { loanId: loanId, userAccountId: userAccountId }).get();
                };
                /*
                 * @desc: Check for new data every 10s
                */
                this.refreshComplianceData = function (loanId, userAccountId, callback) {
                    _this.interval = _this.$interval(function () {
                        _this.getComplianceData(loanId, userAccountId).$promise.then(function (success) {
                            callback(success.response);
                        }, function (error) {
                            _this.$log.error('Error occurred while refreshing ComplianceEase Data!', error);
                        });
                    }, 10000);
                };
                /**
                * @desc: Formats date string into required format
               */
                this.formatDate = function (value, format) {
                    if (!!value) {
                        format = format ? format : 'MM/DD/YYYY';
                        return moment(value).format(format);
                    }
                    else {
                        return '';
                    }
                };
                this.apiPath = apiRoot + "ComplianceResultService/";
            }
            ComplianceEaseService.className = 'complianceEaseService';
            ComplianceEaseService.$inject = ['apiRoot', '$resource', '$q', '$log', '$interval'];
            return ComplianceEaseService;
        })();
        service.ComplianceEaseService = ComplianceEaseService;
        angular.module('complianceEase').service('complianceEaseService', ComplianceEaseService);
    })(service = complianceEase.service || (complianceEase.service = {}));
})(complianceEase || (complianceEase = {}));
//# sourceMappingURL=complianceease.service.js.map