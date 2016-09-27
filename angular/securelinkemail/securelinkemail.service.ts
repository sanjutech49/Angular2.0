
module secureLinkEmail.service {
    'use strict';


    export class SecureLinkEmailService {
        apiPath: string;

        static $inject = ['$resource', 'apiRoot'];
        static className = 'secureLinkEmailService';
        private secureLinkEmailTemplates;
        private secureLinkEmailSend;
        private secureLinkUrl;
        
        constructor(private $resource: ng.resource.IResourceService, private apiRoot: string) {     
            var apiPath = this.apiRoot + 'secureLink/';

            this.secureLinkEmailTemplates = this.$resource(apiPath + 'GetSecureLinkEmailTemplates', { }, {
                getTemplates: {
                    method: 'GET',
                    url: apiPath + 'GetSecureLinkEmailTemplates',
                    params: { LoanId: '@LoanId', LoanApplicationId: '@LoanApplicationId' },
                    isArray: true
                }
            });

            this.secureLinkEmailSend = this.$resource(apiPath + 'SendSecureLinkEmail', {}, {
                sendEmail: {
                    method: 'POST',
                    url: apiPath + 'SendSecureLinkEmail',
                    params: { }
                }
            });

            this.secureLinkUrl = this.$resource(apiPath + 'GetSecureLinkUrlToken', {}, {
                getSecureLinkUrl: {
                    method: 'GET',
                    url: apiPath + 'GetSecureLinkUrlToken',
                    params: { }
                }
            });
       
        }

        //getSecureLinkEmailTemplates = (loanId: string, loanApplicationId: string): any => {
        //    var rqst = {
        //        LoanId: loanId, LoanApplicationId: loanApplicationId
        //    };
            
        //    return this.secureLinkEmailTemplates.getTemplates(rqst);  
        //}

        //sendSecureLinkEmail = (secureLinkEmailVM: srv.cls.SecureLinkEmailViewModel): any => {
        //    return this.secureLinkEmailSend.sendEmail(secureLinkEmailVM);
        //}

        //getSecureLinkUrlToken = (): any => {
        //    return this.secureLinkUrl.getSecureLinkUrl({ });
        //}

    }

    angular.module('loanCenter').service('secureLinkEmailService', SecureLinkEmailService);
} 