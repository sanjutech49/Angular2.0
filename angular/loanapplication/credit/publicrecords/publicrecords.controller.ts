/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../credit.state.service.ts" />


module credit {

    export class publicRecordsController {
        static className = 'PublicRecordsController';
        static $inject = ['wrappedLoan', 'CreditHelpers', 'modalPopoverFactory', 'controllerData', 'applicationData', 'loanEvent', 'CreditStateService'];

        isCollapsed: boolean;
        commonData: any;
        summateTotalPublicRecordsAmount: () => number;

        getPublicRecords: () => cls.PublicRecordViewModel[];

        constructor(public wrappedLoan, private creditHelpers, private modalPopoverFactory, private controllerData, private applicationData,
            private loanEvent: events.LoanEventService, private CreditStateService: credit.CreditStateService) {

            //properties
            this.isCollapsed = controllerData.isCollapsed;
            this.commonData = controllerData.common;
            this.summateTotalPublicRecordsAmount = this.CreditStateService.summateTotalPublicRecordsAmount;
            this.getPublicRecords = () => {
                return this.wrappedLoan.ref.active.publicRecords;
            }
        }

        showCompanyInfo = (model, event) => {
            var initialModel = angular.copy(model.companyData);

            var result = this.creditHelpers.getCompanyInfoData(model, true, this.wrappedLoan.ref.active.LiabilitiesFor(), null, false, false, this.commonData.disableFields, this.wrappedLoan.ref.lookup.allStates);
            var self = this;
            var confirmationPopup = this.modalPopoverFactory.openModalPopover('angular/loanapplication/credit/companycreditcontrol.html', result, model.companyData, event);
            confirmationPopup.result.then(function (data) {

                model.companyData.hasChanges = self.creditHelpers.companyHasChanges(initialModel, model, result);

                var shouldUpdate = model.debtsAccountOwnershipType != model.companyData.liabillityFor;

                model.debtsAccountOwnershipType = model.companyData.liabillityFor;
                
                // todo, publicRecordComment is a 'string' enum 
                if (shouldUpdate)
                    self.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.PublicRecordCommentID, model);

                self.creditHelpers.ProcessRulesForLiabilityOwnershipType(model, self);
            });
        }




        publicRecordsCommentChanged = (publicRecord: cls.PublicRecordViewModel) => {

            // todo, publicRecordComment is a 'string' enum 
            publicRecord.includeInTotalAmount(publicRecord);
        }
    }

    //
    // @todo: Register per standards
    // 
    angular.module('loanApplication').controller('publicRecordsController', publicRecordsController);
} 