module compliancecenter {
    'use strict';

    export interface IAuditLogService {
        getData(loanId: string, userAccountId: number): ng.IPromise<any>;
    }

    class AuditLogService implements IAuditLogService {
        constructor(private $http: ng.IHttpService, private ApiRoot: string) { }

        getData(loanId: string, userAccountId: number): ng.IPromise<any> {
            var getDataApiUrl = this.ApiRoot + 'AuditLog/Get';
            var parameters = {
                loanId: loanId,
                userAccountId: userAccountId
            };
            var config = { params: parameters };
            return this.$http.get(getDataApiUrl, config)
                .then((response: ng.IHttpPromiseCallbackArg<any>): any => {
                return <any>response.data;
            });
        }
    }

    factory.$inject = [
        '$http',
        'apiRoot'
    ];

    function factory($http: ng.IHttpService, apiEndpoint: string): IAuditLogService {
        return new AuditLogService($http, apiEndpoint);
    }

    angular.module('compliancecenter').factory('auditLogSvc', factory);
}



