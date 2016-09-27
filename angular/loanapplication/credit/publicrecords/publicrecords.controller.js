/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../credit.state.service.ts" />
var credit;
(function (credit) {
    var publicRecordsController = (function () {
        function publicRecordsController(wrappedLoan, creditHelpers, modalPopoverFactory, controllerData, applicationData, loanEvent, CreditStateService) {
            var _this = this;
            this.wrappedLoan = wrappedLoan;
            this.creditHelpers = creditHelpers;
            this.modalPopoverFactory = modalPopoverFactory;
            this.controllerData = controllerData;
            this.applicationData = applicationData;
            this.loanEvent = loanEvent;
            this.CreditStateService = CreditStateService;
            this.showCompanyInfo = function (model, event) {
                var initialModel = angular.copy(model.companyData);
                var result = _this.creditHelpers.getCompanyInfoData(model, true, _this.wrappedLoan.ref.active.LiabilitiesFor(), null, false, false, _this.commonData.disableFields, _this.wrappedLoan.ref.lookup.allStates);
                var self = _this;
                var confirmationPopup = _this.modalPopoverFactory.openModalPopover('angular/loanapplication/credit/companycreditcontrol.html', result, model.companyData, event);
                confirmationPopup.result.then(function (data) {
                    model.companyData.hasChanges = self.creditHelpers.companyHasChanges(initialModel, model, result);
                    var shouldUpdate = model.debtsAccountOwnershipType != model.companyData.liabillityFor;
                    model.debtsAccountOwnershipType = model.companyData.liabillityFor;
                    // todo, publicRecordComment is a 'string' enum 
                    if (shouldUpdate)
                        self.loanEvent.broadcastPropertyChangedEvent(11 /* PublicRecordCommentID */, model);
                    self.creditHelpers.ProcessRulesForLiabilityOwnershipType(model, self);
                });
            };
            this.publicRecordsCommentChanged = function (publicRecord) {
                // todo, publicRecordComment is a 'string' enum 
                publicRecord.includeInTotalAmount(publicRecord);
            };
            //properties
            this.isCollapsed = controllerData.isCollapsed;
            this.commonData = controllerData.common;
            this.summateTotalPublicRecordsAmount = this.CreditStateService.summateTotalPublicRecordsAmount;
            this.getPublicRecords = function () {
                return _this.wrappedLoan.ref.active.publicRecords;
            };
        }
        publicRecordsController.className = 'PublicRecordsController';
        publicRecordsController.$inject = ['wrappedLoan', 'CreditHelpers', 'modalPopoverFactory', 'controllerData', 'applicationData', 'loanEvent', 'CreditStateService'];
        return publicRecordsController;
    })();
    credit.publicRecordsController = publicRecordsController;
    //
    // @todo: Register per standards
    // 
    angular.module('loanApplication').controller('publicRecordsController', publicRecordsController);
})(credit || (credit = {}));
//# sourceMappingURL=publicrecords.controller.js.map