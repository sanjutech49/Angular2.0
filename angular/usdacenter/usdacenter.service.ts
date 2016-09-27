module usda.service {
    'use strict';
    export interface IUSDACenterService { }

    export class USDACenterService implements IUSDACenterService {
        static $inject = [];
        constructor() { }
    }
    angular.module('usdaCenter').service('usdaCenterService', USDACenterService);
} 