/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="copyloan.service.ts" />

module copyLoan.controller {
    'use strict';

    class CopyLoanController {
        loanPurpose: number;
        lienPosition: number;
        includeBorrower: any;
        includeCoBorrower: any;
        includeCreditReport: any;
        copySubjectPropertyFlag: boolean;
        subjectPropertyId: string;
        label: string = '';
        closingDate: string;
        userAccountId: number;
        newMainApplicationId: string;
        enableDuplicateLoan: boolean;
        loanApplications: any;
        enableCreditCheckbox: any;

        static $inject = ['copyLoanService', 'wrappedLoan', 'applicationData','$modalStack', 'enums', 'loanEvent', 'blockUI', '$log', '$state'];
        constructor(private copyLoanService: copyLoan.service.ICopyLoanService, private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>,
            public applicationData: any, private $modalStack, private enums: any, private loanEvent, private blockUI, private $log, private $state) {

            this.lienPosition = srv.LienPosition.First;
            this.loanPurpose = wrappedLoan.ref.loanPurposeType;
            this.userAccountId = applicationData.currentUser.userAccountId;
            this.setClosingDate();

            this.loanApplications = wrappedLoan.ref.getLoanApplications();

            this.subjectPropertyId = wrappedLoan.ref.getSubjectProperty().propertyId;
            this.copySubjectPropertyFlag = true;
            this.includeBorrower = new Array();
            this.includeCoBorrower = new Array();
            this.includeCreditReport = new Array();
            this.enableCreditCheckbox = new Array();

            lib.forEach(this.loanApplications, (item: srv.ILoanApplicationViewModel) => {
                this.includeBorrower[item.loanApplicationId] = true;
                this.includeCreditReport[item.loanApplicationId] = true;
                if (item.isSpouseOnTheLoan)
                    this.includeCoBorrower[item.loanApplicationId] = true;
                    this.enableCreditCheckbox[item.loanApplicationId] = true;
            });
            this.enableDuplicateLoan = true;
        }     
        
        /*
        * @desc Logic for verifying if credit report will be enabled and initializing 
        * logic for enabling/disabling duplicate loan button
        */
        enableCreditReport = () => {
            lib.forEach(this.loanApplications,(item: srv.ILoanApplicationViewModel) => {
                if (item.isSpouseOnTheLoan) {
                    if (!this.includeBorrower[item.loanApplicationId] || !this.includeCoBorrower[item.loanApplicationId]) {
                        this.toggleCreditCheckbox(item.loanApplicationId);
                    }
                    else {
                        this.enableCreditCheckbox[item.loanApplicationId] = true;
                    }
                }
                else {
                    if (!this.includeBorrower[item.loanApplicationId]) {
                        this.toggleCreditCheckbox(item.loanApplicationId);
                    }
                    else {
                        this.enableCreditCheckbox[item.loanApplicationId] = true;
                    }
                }
            });        
            this.getCheckboxes(); 
        }

        /*
        * @desc Credit report checkbox is unchecked and disabled as borrower
        * and coborrower must be checked in order to copy credit report for the loan
        * application
        */
        toggleCreditCheckbox = (loanApplicationId) => {
            this.includeCreditReport[loanApplicationId] = false;
            this.enableCreditCheckbox[loanApplicationId] = false;
        }
        
        /*
        * @desc Loops throughout loan applications to verify conditions for enabling/disabling 
        * duplicate loan button
        */
        getCheckboxes = () => {
            for (var i = 0; i < this.loanApplications.length; i++) {
                if (this.includeBorrower[this.loanApplications[i].loanApplicationId] ||
                    this.includeCoBorrower[this.loanApplications[i].loanApplicationId] ||
                    this.includeCreditReport[this.loanApplications[i].loanApplicationId]) {
                    this.enableDuplicateLoan = true;
                    break;
                }
                else
                    this.enableDuplicateLoan = false;
            } 
        }

        setClosingDate = () => {
          
            var dateNow = new Date();
            var currentClosingDate = new Date(moment(this.wrappedLoan.ref.closingDate.dateValue).format("MM/DD/YYYY")); //javascript illogical behavior workaround
            if (currentClosingDate > dateNow)
                this.closingDate = moment(this.wrappedLoan.ref.closingDate.dateValue).format("MM/DD/YYYY");
            else
                this.closingDate = moment(dateNow.setDate(dateNow.getDate() + 30)).format("MM/DD/YYYY");
        }

       /*
        * @desc Checks if the borrower name is valid
        */
        hasBorrowerValidName = (borrower: srv.IBorrowerViewModel) => {
           return borrower.hasValidName();
        }

       /*
        * @desc Gets lien positions from lookup
        */
        getLienPositions = (): any => {
            if (angular.isDefined(this.applicationData.lookup.lienPositions)) {
                return this.applicationData.lookup.lienPositions;
            }
            else {
                return this.lienPosition;
            }   
        }

       /*
        * @desc Gets loan purpose types from lookup
        */
        getLoanPurposeTypes = (): any => {
            if (angular.isDefined(this.applicationData.lookup.loanTransactionTypes)) {
                return this.applicationData.lookup.loanTransactionTypes;
            }
            else {
                return this.loanPurpose;   
            }    
        }

       /*
        * @desc Closes modal window
        */
        close = (): void => {
            this.$modalStack.dismissAll('close');
        }

        hasBorrower = (name: string) => {
            return name != 'New Application';
        }

        duplicateLoan = () => {

            var self = this;
            self.blockUI.start('Duplicating loan...');
            var loanApplicationIds: string[] = [];
            var borrowerIds: string[] = [];
            var creditReportIds: string[] = [];
            var creditReportIncluded: string[] = [];

            var loanApplications: srv.IList<srv.ILoanApplicationViewModel> = this.wrappedLoan.ref.getLoanApplications();
            var addLoanApplication: boolean;

            for (var i = 0; i < loanApplications.length; i++) {

                addLoanApplication = false;

                if (self.includeBorrower[loanApplications[i].loanApplicationId]) {
                    borrowerIds.push(loanApplications[i].getBorrower().borrowerId);
                    addLoanApplication = true;
                }
                if (self.includeCoBorrower[loanApplications[i].loanApplicationId]) {
                    borrowerIds.push(loanApplications[i].getCoBorrower().borrowerId);
                    addLoanApplication = true;
                }
                if (self.includeCreditReport[loanApplications[i].loanApplicationId]) {
                    creditReportIds.push(loanApplications[i].credit.creditReportId);
                    creditReportIncluded.push(loanApplications[i].loanApplicationId);
                    addLoanApplication = true;
                }
                if (addLoanApplication) {
                    loanApplicationIds.push(loanApplications[i].loanApplicationId);
                    addLoanApplication = false;
                }
            }

            //check if main loan application is not being duplicated
            //and choose new one to be main
            var newMainApplicationId: string = loanApplicationIds.filter(id => id == self.wrappedLoan.ref.primary.loanApplicationId).length == 0 ?
                loanApplicationIds[0] : null;

            var copyLoanVM: cls.CopyLoanViewModel = new cls.CopyLoanViewModel(borrowerIds, self.copySubjectPropertyFlag, creditReportIds, creditReportIncluded, loanApplicationIds,
                self.wrappedLoan.ref.loanId, self.wrappedLoan.ref.loanNumber, self.closingDate, self.lienPosition, self.loanPurpose, newMainApplicationId, this.subjectPropertyId, this.userAccountId); 

            self.copyLoanService.duplicateLoan(copyLoanVM).$promise.then(function (result) {
                self.blockUI.stop();
                self.$state.go('loanCenter.loan.loanDetails.sections', { 'loanId': result.Response }, { reload: true });
            }, function (error) {
                    self.blockUI.stop();
                    self.$log.error('Duplicating loan failed', error);
                });
        }
       /*
        * @desc Gets label text based on a borrower type
        */
        getLabel = (borrower: srv.IBorrowerViewModel, isPrimary: boolean) => {
            if (isPrimary && !borrower.isCoBorrower) {
                this.label = 'PB';
            }
            else if (!borrower.isCoBorrower) {
                this.label = 'B';
            }
            else {
                this.label = 'C';   
            } 
            return this.label;
        }

       /*
        * @desc Formats address 
        */
        formatAddress = (property:srv.IPropertyViewModel) => {
            return property.formatAddress(); 
        }
        /*
        * @desc Trigger loan calculator
        */
        onLoanPurposeChange = (): void => {
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo);
        }
    }
    angular.module('copyLoan').controller('copyLoanController', CopyLoanController);
} 