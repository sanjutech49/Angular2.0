module secureLinkEmail.controller {
    'use strict';

    class SecureLinkEmailController {

        static className = 'secureLinkEmailController';
        
        public secureLinkEmail: srv.ISecureLinkEmailViewModel;
        public secureLinkEmailTemplateArray: srv.ISecureLinkEmailTemplateViewModel[] = [];
        private tempLoanId: any;
        public isEmailSent: boolean;
        public secureLinkURL: srv.ISecureLinkUrlResponse;

        emailHtmlBody: string;

        static $inject = ['wrappedLoan', '$modalStack', 'loanEvent', 'blockUI', '$log', '$state', '$sce', 'SecureLinkEmailAlternativeService', 'applicationData'];

        constructor(private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private $modalStack, private loanEvent, private blockUI, private $log, private $state,
            private $sce: ng.ISCEService, private SecureLinkEmailService: srv.SecureLinkEmailAlternativeService, private applicationData: any) {
            
            var user: cls.UserAccountViewModel = applicationData.currentUser;
            
            this.secureLinkEmail = new srv.cls.SecureLinkEmailViewModel();
            //this.secureLinkEmailTemplateArray = new srv.cls.SecureLinkEmailTemplateViewModel();
            
            this.secureLinkEmail.toEmail = wrappedLoan.ref.active.getBorrower().userAccount.username;
            //this.secureLinkEmail.ccEmail = wrappedLoan.ref.active.getBorrower().userAccount.username;
            this.secureLinkEmail.fromEmail = user.username;
            //this.tempLoanId = 'E2DE27CC-AFB4-4298-AE33-741458D5EE4A';

            //
            // SecureLinkEmailService.GetSecureLinkEmailTemplates(wrappedLoan.ref.loanId, wrappedLoan.ref.active.loanApplicationId).then(result => {
            //
            var sleml = new srv.cls.SecureLinkEmailViewModel();
            sleml.loanId = wrappedLoan.ref.loanId;
            sleml.loanApplicationId = wrappedLoan.ref.active.loanApplicationId;
            SecureLinkEmailService.GetSecureLinkEmailTemplates(sleml).then(result => {
                this.secureLinkEmailTemplateArray = result;
            },
                error => {
                    this.$log.error('Error occurred while getting SecureLink Email Templates Data!', error);
            }); 
           
            
            
        }

        get toEmail() {
            return this.secureLinkEmail.toEmail;
        }
        set toEmail(toEmail: string) {
            this.secureLinkEmail.toEmail = toEmail;
        }

        get ccEmail() {
            return this.secureLinkEmail.ccEmail;
        }
        set ccEmail(ccEmail: string) {
            this.secureLinkEmail.ccEmail = ccEmail;
        }

        get fromEmail() {
            return this.secureLinkEmail.fromEmail;
        }
        set fromEmail(fromEmail: string) {
            this.secureLinkEmail.fromEmail = fromEmail;
        }
        setActiveTemplate = (): void => {
            var i: number = 0;
            while (i < this.secureLinkEmailTemplateArray.length) {
                if (this.secureLinkEmail.activeTemplate.title === this.secureLinkEmailTemplateArray[i].title) {
                    this.secureLinkEmail.activeTemplate.emailBody = this.secureLinkEmailTemplateArray[i].emailBody;
                    this.secureLinkEmail.activeTemplate.emailSubject = this.secureLinkEmailTemplateArray[i].emailSubject;
                    break;
                }
                i++;
            }
        }

        close = (): void => {
            this.$modalStack.dismissAll('close');
        }

        sendEmail = (): boolean => {
            //this.secureLinkEmailService.sendSecureLinkEmail(this.secureLinkEmail);
            this.SecureLinkEmailService.SendSecureLinkEmail(this.tempLoanId, this.tempLoanId).then(result => {
                this.isEmailSent = result;
            },
                error => {
                    this.$log.error('Error occurred while getting SecureLink Email Templates Data!', error);
                    this.isEmailSent = false;
                });
            return this.isEmailSent;
        }

        getSecureLinkURL = (): srv.ISecureLinkUrlResponse => {

            this.SecureLinkEmailService.GetSecureLinkUrlToken(this.tempLoanId, this.tempLoanId).then(result => {
                this.secureLinkURL = result;
            },
                error => {
                    this.$log.error('Error occurred while getting SecureLink Email Templates Data!', error);
                    this.secureLinkURL = null;
                });
            return this.secureLinkURL;
        }

    }
    angular.module('secureLinkEmail').controller('secureLinkEmailController', SecureLinkEmailController);
}