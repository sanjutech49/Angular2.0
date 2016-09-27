module common {
    'use strict';

    export interface IGuidService {
        newGuid(): IGuid;
        getNewGuid(): ng.IPromise<any>;
    }

    export interface IGuid {
        value: string;
        isResolved: boolean;
    }

    export class Guid implements Guid {
        constructor() {
            this.isResolved = false;
        }

        value: string;
        isResolved: boolean;
    }

    class GuidService implements IGuidService {
        constructor(public $http: ng.IHttpService, private apiRoot: string) {
            this.url = apiRoot + 'Common';
        }
        private url: string;

        /**
        * @desc Retrieves Guid.NewGuid
        * Usage: vm.guid = guidService.newGuid();
        */
        newGuid = (): Guid =>  {
            var guid = new Guid();

            var newGuidUrl = this.url + '/NewGuid';
            var promise = this.$http.get(newGuidUrl).then((response) => {
                if (response && response.status == 200 && response.data != null) {
                    guid.value = String(response.data);
                    guid.isResolved = true;
                }
            });

            return guid;
        }

        getNewGuid(): ng.IPromise<any> {

            var newGuidUrl = this.url + '/NewGuid';
            return this.$http.get(newGuidUrl, { cache: false });
        }
    }

    guidService.$inject = [
        '$http',
        'apiRoot'
    ];

    /**
    * Service used to interact with REST services for Guid manipulation.
    */
    function guidService($http: ng.IHttpService, apiRoot: string): IGuidService {
        return new GuidService($http, apiRoot);
    }

    angular.module('common').service('guidService', guidService);
}