/// <reference path="../../../ts/extendedViewModels/property.extendedViewModel.ts" />
var credit;
(function (credit) {
    var RealEstateController = (function () {
        function RealEstateController(wrappedLoan, CreditHelpers, modalPopoverFactory, $modal, applicationData, controllerData, enums, loanEvent, CreditStateService) {
            var _this = this;
            this.wrappedLoan = wrappedLoan;
            this.CreditHelpers = CreditHelpers;
            this.modalPopoverFactory = modalPopoverFactory;
            this.$modal = $modal;
            this.applicationData = applicationData;
            this.controllerData = controllerData;
            this.enums = enums;
            this.loanEvent = loanEvent;
            this.CreditStateService = CreditStateService;
            this.disableFields = false;
            this.getReos = function () {
                return _this.wrappedLoan.ref.active.reos.filter(function (item) {
                    return !item.isSecondaryPartyRecord;
                });
            };
            this.deleteRealEstateRow = function (item) {
                _this.CreditStateService.deleteREO(item);
                //CreditHelpers.deleteRealEstateRow(vm, clientId);
                // this.wrappedLoan.ref.active.removeFromCollection(item, wrappedLoan.ref.active.borrower.getPledgedAssets(), wrappedLoan.ref.active.coBorrower.getPledgedAssets());
            };
            this.editRealEstateItem = function (pledgedAsset) {
                _this.addEditRealEstateItem(pledgedAsset, false);
            };
            this.addRealEstateItem = function () {
                //
                // @todo-cl: MUST COPY UP/DOWN
                //
                var newReo = new cls.LiabilityViewModel(_this.wrappedLoan.ref.getTransactionInfoRef()); // cls.PendingREOViewModel();
                newReo.borrowerDebtCommentId = _this.enums.PledgedAssetComment.DoNotPayoff;
                newReo.isUserEntry = true;
                _this.addEditRealEstateItem(newReo, true);
            };
            //
            // @todo-cl: MUST COPY UP/DOWN
            //
            // addEditRealEstateItem = (pledgedAsset: cls.PendingREOViewModel, isNew: boolean) => {
            this.addEditRealEstateItem = function (pledgedAsset, isNew) {
                //if (pledgedAsset.property.propertyId == lib.getEmptyGuid())
                //    pledgedAsset.property.propertyId = "";
                if (isNew || (pledgedAsset.unpaidBalance == 0 && !pledgedAsset.isLenderSectionVisible))
                    pledgedAsset.unpaidBalance = 0;
                if (isNew || (pledgedAsset.minPayment == 0 && !pledgedAsset.isLenderSectionVisible))
                    pledgedAsset.minPayment = 0;
                if (!pledgedAsset.lienPosition)
                    pledgedAsset.lienPosition = 0;
                var modalInstance = _this.$modal.open({
                    templateUrl: 'angular/loanapplication/credit/realestate/realestateitem.html',
                    controller: 'realEstateItemController',
                    controllerAs: 'realEstateItemCtrl',
                    backdrop: 'static',
                    windowClass: 'imp-modal flyout imp-modal-real-estate-information',
                    resolve: {
                        isNew: function () {
                            return isNew;
                        },
                        originalPledgedAssetModel: function () {
                            return pledgedAsset;
                        },
                        disableFields: function () {
                            return _this.disableFields;
                        },
                        wrappedLoan: function () {
                            return _this.wrappedLoan;
                        },
                        debtAccountOwnershipTypes: function () {
                            return _this.debtAccountOwnershipTypes;
                        },
                        lookup: function () {
                            return _this.applicationData.lookup;
                        },
                        generalSettings: function () {
                            return _this.applicationData.generalSettings;
                        },
                        loanEvent: function () {
                            return _this.loanEvent;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    // @todo: Delete once confirmed labels are updating per loan.loanFunctions
                    // CreditHelpers.calculateTotalsForReo(vm);
                });
            };
            this.moveREOToLiability = function (pledgedAsset, isCoborrower) {
                _this.CreditStateService.moveREOToLiability(pledgedAsset, isCoborrower);
                //var liability = CreditHelpers.moveREOToLiability(vm, pledgedAsset, isCoborrower);
                //if (liability) {
                //    pledgedAsset = liability;
                //}
            };
            //properties
            this.isCollapsed = controllerData.isCollapsed;
            this.borrowerDebtAccountOwnershipTypes = CreditStateService.borrowerDebtAccountOwnershipTypes;
            this.coBorrowerDebtAccountOwnershipTypes = CreditStateService.coBorrowerDebtAccountOwnershipTypes;
            this.debtAccountOwnershipTypes = CreditStateService.debtAccountOwnershipTypes;
            this.applicationData = applicationData;
            this.summateTotalREOPropertyValues = CreditStateService.summateTotalREOPropertyValues;
            this.summateTotalREOBalance = CreditStateService.summateTotalREOBalance;
            this.summateTotalREOPayment = CreditStateService.summateTotalREOPayment;
        }
        RealEstateController.$inject = ['wrappedLoan', 'CreditHelpers', 'modalPopoverFactory', '$modal', 'applicationData', 'controllerData', 'enums', 'loanEvent', 'CreditStateService'];
        return RealEstateController;
    })();
    angular.module('loanApplication').controller('realEstateController', RealEstateController);
})(credit || (credit = {}));
//# sourceMappingURL=realestate.controller.js.map