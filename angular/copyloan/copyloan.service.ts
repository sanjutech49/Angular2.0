/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />

module copyLoan.service {
    'use strict';

    export interface ICopyLoanService {
        duplicateLoan(request: srv.ICopyLoanViewModel): ng.resource.IResource<any>;
    }

    export class CopyLoanService implements ICopyLoanService {
        apiPath: string;

        static $inject = ['$resource', 'apiRoot'];
        static className = 'copyLoanService';

        constructor(private $resource: angular.resource.IResourceService, private apiRoot: string) {
            this.apiPath = apiRoot + 'CopyLoanService/';
        }

        duplicateLoan = (request: srv.ICopyLoanViewModel): ng.resource.IResource<any> => {
            return this.$resource(this.apiPath).save(request);
        }
    }

    angular.module('copyLoan').service('copyLoanService', CopyLoanService);
} 