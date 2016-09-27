module preapprovalletters {
    'use strict';

    export class preapprovallettersService {
        apiPath: string;
        postApiPath: string;

        preapprovalSend: any;

        static $inject = ['apiRoot', '$resource', '$q', '$http'];

        constructor(private apiRoot: string, private $resource: ng.resource.IResourceService, private $q: ng.IQService, private $http) {
            this.postApiPath = this.apiRoot + 'PreApprovalLetters/Post';

            var postAction: ng.resource.IActionDescriptor = {
                method: 'POST',
                isArray: false
            };

            this.preapprovalSend = this.$resource(this.postApiPath, { viewModel: '@viewModel' }, { create: postAction } );
        }

        

        send = (viewModel: srv.IPreApprovalLettersViewModel): ng.IPromise<srv.IPreApprovalLettersViewModel> => {
            var config = {
                params: {
                    viewModel: viewModel
                }
            };

            return this.$http.post(this.postApiPath, viewModel, { params: {  } });
            //return this.preapprovalSend.save(viewModel);
        }
    }
    angular.module('preapprovalletters').service('preapprovallettersService', preapprovallettersService);
}

//moduleRegistration.registerService(moduleNames.loanCenter, loanCenter.manageAccountService);