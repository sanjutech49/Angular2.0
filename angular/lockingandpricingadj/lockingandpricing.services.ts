/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/global/global.ts" /> 
/// <reference path="../loancenter/loancenter.app.ts" />

module loanCenter {
    'use strict';

    export class lockingPricingService {
        lockExpireDateUrl: any;
        apiPath: string;

        static className = 'LockingPricingService';
        static $inject = ['apiRoot',  '$resource', '$q', ];

        constructor(private ApiRoot: string,           
            private $resource: ng.resource.IResourceService,
            private $q: ng.IQService
            ) { 
            var vm = this;
            vm.apiPath = ApiRoot + "LockingPricing/";

            vm.lockExpireDateUrl = vm.apiPath + 'LockExpireDate';
        }

        lockLoan = () => {

         return  this.$resource(this.lockExpireDateUrl, { loanid: 'loanid', useraccountid: 'useraccountid' });
        } 
    }
    angular.module('lockingandpricingadj').service('lockingPricingService', lockingPricingService);
}

//moduleRegistration.registerService(moduleNames.loanCenter, loanCenter.manageAccountService);