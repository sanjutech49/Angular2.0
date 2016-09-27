/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../documents/documents.service.ts" />
module complianceEase.controller {

    export class complianceEaseController {

        static $inject = ['wrappedLoan', 'applicationData', 'NavigationSvc', 'complianceEaseService', 'complianceData', '$log', '$state', 'commonModalWindowFactory', 'modalWindowType', 'DocumentsService', 'enums', 'modalPopoverFactory'];
        static className = 'complianceEaseController';

        counter = 0;
        submitting = false;

        constructor(public wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private applicationData: any, private navigationService: any,
            private complianceEaseService: complianceEase.service.IComplianceEaseService, private complianceData: srv.ICollection<srv.IComplianceResultViewModel>,
            private $log: ng.ILogService, private $state: ng.ui.IStateService, private commonModalWindowFactory: any, private modalWindowType: any,
            private documentsService: documents.IDocumentsService, private enums: any, private modalPopoverFactory: any) {

            //Start refreshing ComplianceEase data every 10s
            this.complianceEaseService.refreshComplianceData(this.wrappedLoan.ref.loanId, this.applicationData.currentUserId,(data) => { this.complianceData = data; });
            this.navigationService.contextualType = this.enums.ContextualTypes.ComplianceEase;
        }

        /*
         * @desc: Saves loan and submits request to ComplianceEase integration
        */
        saveLoanAndSubmit = () => {
            this.navigationService.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan,(wrappedLoan) => {
                var request = new srv.cls.ComplianceEaseRequestViewModel();
                request.loanId = this.wrappedLoan.ref.loanId;
                request.branchId = this.wrappedLoan.ref.branchId;
                request.channelId = this.wrappedLoan.ref.channelId;
                request.companyId = this.wrappedLoan.ref.companyId;
                request.divisionId = this.wrappedLoan.ref.divisionId;
                request.userAccountId = this.applicationData.currentUserId;
                request.submitedBy = this.applicationData.currentUser.fullName;
                this.submit(request);
            },(error) => {
                    console.log(error);
                }, 'Saving Loan and Submitting to CE...');
        }

        /*
         * @desc: Formats date string into required format
        */
        formatDate = (value: string, format: string): string => {
            return this.complianceEaseService.formatDate(value, format);
        }

        /*
         * @desc: Colors text retrieved from CE
        */
        colorText = (value: string): string => {
            if (value) {
            switch (value.toUpperCase()) {
                case 'PASS':
                    return '#46cc7c';
                case 'FAIL':
                    return '#ef1126';
                case 'WARNING':
                    return '#FFEEC5';
                }
            }

                    return '#000';
            }

        /*
         * @desc: Event handler for refresh button from UI
        */
        refreshComplianceEaseData = (): void => {
            this.complianceEaseService.getComplianceData(this.wrappedLoan.ref.loanId, this.applicationData.currentUserId).$promise.then(
                (success) => {
                    this.complianceData = success.response;
                },
                (error) => {
                    this.$log.error('Error occurred while getting ComplianceEase Data!', error);
                });
        }

        /*
         * @desc: Opens PDF document by repo Id in a different tab
        */
        openPDF = (documentId: string): void => {
            this.documentsService.openDocument(documentId, false, true);
        }

        private submit = (request: srv.IComplianceEaseRequestViewModel) => {
            this.complianceEaseService.submit(request).$promise.then(
                (success) => {
                    if (success.response) {
                        this.commonModalWindowFactory.open({ type: this.modalWindowType.success, message: "Request to ComplianceEase Successfully Submitted" });
                    }
                    else {
                        this.commonModalWindowFactory.open({ type: this.modalWindowType.success, message: "Request to ComplianceEase Failed. Please try again." });
                    }
                },
                (error) => {
                    this.$log.error('Error occurred while submitting ComplianceEase request!', error);
                    this.commonModalWindowFactory.open({ type: this.modalWindowType.success, message: "Request to ComplianceEase Failed. Please try again." });
                });
        }

        showComplianceResultDetails = (event, details) => {

            this.modalPopoverFactory.openModalPopover('angular/complianceease/complianceresultdetails.html', {}, details, event, { horisontalPopupPositionPerWidth: 0.1, className: 'tooltip-arrow-left' });
        }
    }

    angular.module('complianceEase').controller('complianceEaseController', complianceEaseController);
}
