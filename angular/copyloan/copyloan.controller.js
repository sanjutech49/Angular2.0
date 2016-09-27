/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="copyloan.service.ts" />
var copyLoan;
(function (copyLoan) {
    var controller;
    (function (controller) {
        'use strict';
        var CopyLoanController = (function () {
            function CopyLoanController(copyLoanService, wrappedLoan, applicationData, $modalStack, enums, loanEvent, blockUI, $log, $state) {
                var _this = this;
                this.copyLoanService = copyLoanService;
                this.wrappedLoan = wrappedLoan;
                this.applicationData = applicationData;
                this.$modalStack = $modalStack;
                this.enums = enums;
                this.loanEvent = loanEvent;
                this.blockUI = blockUI;
                this.$log = $log;
                this.$state = $state;
                this.label = '';
                /*
                * @desc Logic for verifying if credit report will be enabled and initializing
                * logic for enabling/disabling duplicate loan button
                */
                this.enableCreditReport = function () {
                    lib.forEach(_this.loanApplications, function (item) {
                        if (item.isSpouseOnTheLoan) {
                            if (!_this.includeBorrower[item.loanApplicationId] || !_this.includeCoBorrower[item.loanApplicationId]) {
                                _this.toggleCreditCheckbox(item.loanApplicationId);
                            }
                            else {
                                _this.enableCreditCheckbox[item.loanApplicationId] = true;
                            }
                        }
                        else {
                            if (!_this.includeBorrower[item.loanApplicationId]) {
                                _this.toggleCreditCheckbox(item.loanApplicationId);
                            }
                            else {
                                _this.enableCreditCheckbox[item.loanApplicationId] = true;
                            }
                        }
                    });
                    _this.getCheckboxes();
                };
                /*
                * @desc Credit report checkbox is unchecked and disabled as borrower
                * and coborrower must be checked in order to copy credit report for the loan
                * application
                */
                this.toggleCreditCheckbox = function (loanApplicationId) {
                    _this.includeCreditReport[loanApplicationId] = false;
                    _this.enableCreditCheckbox[loanApplicationId] = false;
                };
                /*
                * @desc Loops throughout loan applications to verify conditions for enabling/disabling
                * duplicate loan button
                */
                this.getCheckboxes = function () {
                    for (var i = 0; i < _this.loanApplications.length; i++) {
                        if (_this.includeBorrower[_this.loanApplications[i].loanApplicationId] || _this.includeCoBorrower[_this.loanApplications[i].loanApplicationId] || _this.includeCreditReport[_this.loanApplications[i].loanApplicationId]) {
                            _this.enableDuplicateLoan = true;
                            break;
                        }
                        else
                            _this.enableDuplicateLoan = false;
                    }
                };
                this.setClosingDate = function () {
                    var dateNow = new Date();
                    var currentClosingDate = new Date(moment(_this.wrappedLoan.ref.closingDate.dateValue).format("MM/DD/YYYY")); //javascript illogical behavior workaround
                    if (currentClosingDate > dateNow)
                        _this.closingDate = moment(_this.wrappedLoan.ref.closingDate.dateValue).format("MM/DD/YYYY");
                    else
                        _this.closingDate = moment(dateNow.setDate(dateNow.getDate() + 30)).format("MM/DD/YYYY");
                };
                /*
                 * @desc Checks if the borrower name is valid
                 */
                this.hasBorrowerValidName = function (borrower) {
                    return borrower.hasValidName();
                };
                /*
                 * @desc Gets lien positions from lookup
                 */
                this.getLienPositions = function () {
                    if (angular.isDefined(_this.applicationData.lookup.lienPositions)) {
                        return _this.applicationData.lookup.lienPositions;
                    }
                    else {
                        return _this.lienPosition;
                    }
                };
                /*
                 * @desc Gets loan purpose types from lookup
                 */
                this.getLoanPurposeTypes = function () {
                    if (angular.isDefined(_this.applicationData.lookup.loanTransactionTypes)) {
                        return _this.applicationData.lookup.loanTransactionTypes;
                    }
                    else {
                        return _this.loanPurpose;
                    }
                };
                /*
                 * @desc Closes modal window
                 */
                this.close = function () {
                    _this.$modalStack.dismissAll('close');
                };
                this.hasBorrower = function (name) {
                    return name != 'New Application';
                };
                this.duplicateLoan = function () {
                    var self = _this;
                    self.blockUI.start('Duplicating loan...');
                    var loanApplicationIds = [];
                    var borrowerIds = [];
                    var creditReportIds = [];
                    var creditReportIncluded = [];
                    var loanApplications = _this.wrappedLoan.ref.getLoanApplications();
                    var addLoanApplication;
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
                    var newMainApplicationId = loanApplicationIds.filter(function (id) { return id == self.wrappedLoan.ref.primary.loanApplicationId; }).length == 0 ? loanApplicationIds[0] : null;
                    var copyLoanVM = new cls.CopyLoanViewModel(borrowerIds, self.copySubjectPropertyFlag, creditReportIds, creditReportIncluded, loanApplicationIds, self.wrappedLoan.ref.loanId, self.wrappedLoan.ref.loanNumber, self.closingDate, self.lienPosition, self.loanPurpose, newMainApplicationId, _this.subjectPropertyId, _this.userAccountId);
                    self.copyLoanService.duplicateLoan(copyLoanVM).$promise.then(function (result) {
                        self.blockUI.stop();
                        self.$state.go('loanCenter.loan.loanDetails.sections', { 'loanId': result.Response }, { reload: true });
                    }, function (error) {
                        self.blockUI.stop();
                        self.$log.error('Duplicating loan failed', error);
                    });
                };
                /*
                 * @desc Gets label text based on a borrower type
                 */
                this.getLabel = function (borrower, isPrimary) {
                    if (isPrimary && !borrower.isCoBorrower) {
                        _this.label = 'PB';
                    }
                    else if (!borrower.isCoBorrower) {
                        _this.label = 'B';
                    }
                    else {
                        _this.label = 'C';
                    }
                    return _this.label;
                };
                /*
                 * @desc Formats address
                 */
                this.formatAddress = function (property) {
                    return property.formatAddress();
                };
                /*
                * @desc Trigger loan calculator
                */
                this.onLoanPurposeChange = function () {
                    _this.loanEvent.broadcastPropertyChangedEvent(30 /* todo */);
                };
                this.lienPosition = 1 /* First */;
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
                lib.forEach(this.loanApplications, function (item) {
                    _this.includeBorrower[item.loanApplicationId] = true;
                    _this.includeCreditReport[item.loanApplicationId] = true;
                    if (item.isSpouseOnTheLoan)
                        _this.includeCoBorrower[item.loanApplicationId] = true;
                    _this.enableCreditCheckbox[item.loanApplicationId] = true;
                });
                this.enableDuplicateLoan = true;
            }
            CopyLoanController.$inject = ['copyLoanService', 'wrappedLoan', 'applicationData', '$modalStack', 'enums', 'loanEvent', 'blockUI', '$log', '$state'];
            return CopyLoanController;
        })();
        angular.module('copyLoan').controller('copyLoanController', CopyLoanController);
    })(controller = copyLoan.controller || (copyLoan.controller = {}));
})(copyLoan || (copyLoan = {}));
//# sourceMappingURL=copyloan.controller.js.map