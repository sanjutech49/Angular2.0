module integrationsServices.service {
    'use strict';

    export interface IIntegrationsService {
        getIntegrationData(loanId: string, userAccountId: number): ng.resource.IResource<any>;
    }

    export class IntegrationsService implements IIntegrationsService {
        apiPath: string;

        static className = 'integrationsService';
        static $inject = ['apiRoot', '$resource'];

        constructor(private apiRoot: string, private $resource: ng.resource.IResourceService) {
            this.apiPath = apiRoot + "Integrations/";
        }

        /*
         * @desc: Gets Integration Data 
        */
        getIntegrationData = (loanId: string, userAccountId: number): ng.resource.IResource<any> => {
            return this.$resource(this.apiPath, { loanId: loanId, userAccountId: userAccountId }).get();
        }
    }

    angular.module('integrations').service('integrationsService', IntegrationsService);
}