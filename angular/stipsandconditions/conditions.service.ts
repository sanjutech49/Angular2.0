/// <reference path="conditions.module.ts" />
/// <reference path='../../Scripts/typings/angularjs/angular.d.ts'/>



module stipsandconditions {
    'use strict';


    export interface IConditionsService {
        getData(loanId: string, userAccountId: number): ng.IPromise<any>;
      
    }



    class ConditionsService implements IConditionsService {
        constructor(private $http: ng.IHttpService, private ApiRoot: string) { }

        getData(loanId: string, userAccountId: number) : ng.IPromise<any> {         
            var getDataApiUrl = this.ApiRoot + 'Conditions/GetData';
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

    function factory($http: ng.IHttpService, apiEndpoint: string): IConditionsService {
        return new ConditionsService($http, apiEndpoint);
    }

    angular.module('stipsandconditions').factory('conditionsSvc', factory);

}



