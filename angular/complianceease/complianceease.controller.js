/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../documents/documents.service.ts" />
var complianceEase;
(function (complianceEase) {
    var controller;
    (function (controller) {
        var complianceEaseController = (function () {
            function complianceEaseController(wrappedLoan, applicationData, navigationService, complianceEaseService, complianceData, $log, $state, commonModalWindowFactory, modalWindowType, documentsService, enums, modalPopoverFactory) {
                var _this = this;
                this.wrappedLoan = wrappedLoan;
                this.applicationData = applicationData;
                this.navigationService = navigationService;
                this.complianceEaseService = complianceEaseService;
                this.complianceData = complianceData;
                this.$log = $log;
                this.$state = $state;
                this.commonModalWindowFactory = commonModalWindowFactory;
                this.modalWindowType = modalWindowType;
                this.documentsService = documentsService;
                this.enums = enums;
                this.modalPopoverFactory = modalPopoverFactory;
                this.counter = 0;
                this.submitting = false;
                /*
                 * @desc: Saves loan and submits request to ComplianceEase integration
                */
                this.saveLoanAndSubmit = function () {
                    _this.navigationService.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan, function (wrappedLoan) {
                        var request = new srv.cls.ComplianceEaseRequestViewModel();
                        request.loanId = _this.wrappedLoan.ref.loanId;
                        request.branchId = _this.wrappedLoan.ref.branchId;
                        request.channelId = _this.wrappedLoan.ref.channelId;
                        request.companyId = _this.wrappedLoan.ref.companyId;
                        request.divisionId = _this.wrappedLoan.ref.divisionId;
                        request.userAccountId = _this.applicationData.currentUserId;
                        request.submitedBy = _this.applicationData.currentUser.fullName;
                        _this.submit(request);
                    }, function (error) {
                        console.log(error);
                    }, 'Saving Loan and Submitting to CE...');
                };
                /*
                 * @desc: Formats date string into required format
                */
                this.formatDate = function (value, format) {
                    return _this.complianceEaseService.formatDate(value, format);
                };
                /*
                 * @desc: Colors text retrieved from CE
                */
                this.colorText = function (value) {
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
                };
                /*
                 * @desc: Event handler for refresh button from UI
                */
                this.refreshComplianceEaseData = function () {
                    _this.complianceEaseService.getComplianceData(_this.wrappedLoan.ref.loanId, _this.applicationData.currentUserId).$promise.then(function (success) {
                        _this.complianceData = success.response;
                    }, function (error) {
                        _this.$log.error('Error occurred while getting ComplianceEase Data!', error);
                    });
                };
                /*
                 * @desc: Opens PDF document by repo Id in a different tab
                */
                this.openPDF = function (documentId) {
                    _this.documentsService.openDocument(documentId, false, true);
                };
                this.submit = function (request) {
                    _this.complianceEaseService.submit(request).$promise.then(function (success) {
                        if (success.response) {
                            _this.commonModalWindowFactory.open({ type: _this.modalWindowType.success, message: "Request to ComplianceEase Successfully Submitted" });
                        }
                        else {
                            _this.commonModalWindowFactory.open({ type: _this.modalWindowType.success, message: "Request to ComplianceEase Failed. Please try again." });
                        }
                    }, function (error) {
                        _this.$log.error('Error occurred while submitting ComplianceEase request!', error);
                        _this.commonModalWindowFactory.open({ type: _this.modalWindowType.success, message: "Request to ComplianceEase Failed. Please try again." });
                    });
                };
                this.showComplianceResultDetails = function (event, details) {
                    _this.modalPopoverFactory.openModalPopover('angular/complianceease/complianceresultdetails.html', {}, details, event, { horisontalPopupPositionPerWidth: 0.1, className: 'tooltip-arrow-left' });
                };
                //Start refreshing ComplianceEase data every 10s
                this.complianceEaseService.refreshComplianceData(this.wrappedLoan.ref.loanId, this.applicationData.currentUserId, function (data) {
                    _this.complianceData = data;
                });
                this.navigationService.contextualType = this.enums.ContextualTypes.ComplianceEase;
            }
            complianceEaseController.$inject = ['wrappedLoan', 'applicationData', 'NavigationSvc', 'complianceEaseService', 'complianceData', '$log', '$state', 'commonModalWindowFactory', 'modalWindowType', 'DocumentsService', 'enums', 'modalPopoverFactory'];
            complianceEaseController.className = 'complianceEaseController';
            return complianceEaseController;
        })();
        controller.complianceEaseController = complianceEaseController;
        angular.module('complianceEase').controller('complianceEaseController', complianceEaseController);
    })(controller = complianceEase.controller || (complianceEase.controller = {}));
})(complianceEase || (complianceEase = {}));
//# sourceMappingURL=complianceease.controller.js.map