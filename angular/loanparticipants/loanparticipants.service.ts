module loancenter {
    'use strict';

    export class loanParticipantsService {
        $inject = ['$resource', 'api'];

        private proxy;

        constructor(private $resource: ng.resource.IResourceService, private apiRoot: string) { }

        getEmptyContact() {
            this.proxy = this.$resource(this.apiRoot + 'LoanParticipantsService/GetEmptyCompanyContact', {}, {
                GetEmptyContact: { method: 'GET' }
            });
            return this.proxy.GetEmptyContact().$promise
        }

        public static Factory() {
            var service = ($resource, api) => {
                return new loanParticipantsService($resource, api);
            };

            service['$inject'] = ['$resource', 'api'];

            return service;
        }
    }

    angular.module('loanCenter').service('loanParticipantsService', loancenter.loanParticipantsService);
} 