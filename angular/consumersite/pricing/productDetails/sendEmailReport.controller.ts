/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class sendEmailReportController {

        public controllerAsName: string = "sendEmailReportCntrl";
        static className = "sendEmailReportController";

        private tempLoanId: any;
        private isEmailSent: boolean;
        private secureLinkEmail: srv.ISecureLinkEmailViewModel;
        private secureLinkEmailTemplateArray: srv.ISecureLinkEmailTemplateViewModel[] = [];
        private SecureLinkEmailService: srv.SecureLinkEmailService;

        private activeTemplate: srv.ISecureLinkEmailTemplateViewModel;

        firstName: string;
        lastName: string;
        emailAddress: string;

        public static $inject = ['$http', '$controller', 'loan', 'applicationData', 'BroadcastSvc', 'pricingResultsSvc', 'NavigationSvc'];
        vm = this;


        constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance, private loan: vm.Loan, private applicationData, private $http,
            private BroadcastSvc, private pricingResultsSvc, private NavigationSvc) {
            //this.BroadcastSvc,
            //this.pricingResultsSvc,
            //this.NavigationSvc
            
        }

        saveLoanAndSendUserSelectedProductCategories = () => {
            //if (!vm.isEmailValid)
            //    return;

            //if (sendEmail)
            //    vm.userSelectedProductCategoriesVM.sendEmail = sendEmail;

            this.loan.loanApp.borrower.firstName = this.firstName;
            this.loan.loanApp.borrower.lastName = this.lastName;
            if (this.emailAddress)
                this.applicationData.currentUser.username = this.emailAddress;

            var userSelectedProductCategoriesVM = new srv.cls.UserSelectedProductCategoriesViewModel();


            userSelectedProductCategoriesVM.firstName = this.loan.loanApp.borrower.firstName;
            userSelectedProductCategoriesVM.lastName = this.loan.loanApp.borrower.lastName;
            userSelectedProductCategoriesVM.email = this.applicationData.currentUser.username;
            userSelectedProductCategoriesVM.borrowerUserAccountId = this.applicationData.currentUser.userAccountId;

            this.saveAndSendUserSelectedProductCategories(userSelectedProductCategoriesVM);

            //  this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUser.userAccountId, this.loan, function () { this.saveAndSendUserSelectedProductCategories(userSelectedProductCategoriesVM) });
        }

        saveAndSendUserSelectedProductCategories = (viewModel) => {
            viewModel.loanId = this.loan.getLoan().loanId;

            this.pricingResultsSvc.SaveAndSendUserSelectedProductCategories(viewModel).then(
                function (result) {
                    if (result.data)
                        // commonModalWindowFactory.close('close');
                        this.close();

                },
                function (error) {
                    //commonModalWindowFactory.open({ type: modalWindowType.error, message: 'An error occured during saving and sending Comparison PDF.' });
                    console.log("Error:" + JSON.stringify(error));
                });

            //  this.BroadcastSvc.broadcastRepopulatePricingResults(); 
        }

        close = () => {

            this.$modalInstance.dismiss('cancel');
        }


        clickCancelSendReportClick = () => {
            this.close();
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

        sendEmail = (): boolean => {
            this.saveLoanAndSendUserSelectedProductCategories();
            return true;
            //this.secureLinkEmail.toEmail = this.emailAddress;

            //this.tempLoanId = this.loan.getLoan().loanId;
            //this.SecureLinkEmailService.SendSecureLinkEmail(this.tempLoanId, this.tempLoanId).then(result => {
            //    this.isEmailSent = result;
            //},
            //    error => {
            //        console.log('Error occurred while getting SecureLink Email Templates Data!', error);
            //        this.isEmailSent = false;
            //    });
            //return this.isEmailSent;
        }
    }
    moduleRegistration.registerController(consumersite.moduleName, sendEmailReportController);
} 