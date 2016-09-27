/// <reference path="../../../ts/extendedViewModels/property.extendedViewModel.ts" />

module credit {

    class RealEstateController {

        static $inject = ['wrappedLoan', 'CreditHelpers', 'modalPopoverFactory', '$modal', 'applicationData', 'controllerData', 'enums', 'loanEvent', 'CreditStateService'];

        isCollapsed: boolean;
        disableFields = false;
        borrowerDebtAccountOwnershipTypes: srv.IList<srv.ILookupItem>;
        coBorrowerDebtAccountOwnershipTypes: srv.IList<srv.ILookupItem>;
        debtAccountOwnershipTypes: srv.IList<srv.ILookupItem>;
        summateTotalREOPropertyValues: () => number;
        summateTotalREOBalance: () => number;
        summateTotalREOPayment: () => number;

        constructor(private wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, private CreditHelpers, private modalPopoverFactory, private $modal, private applicationData,
            private controllerData, private enums, private loanEvent: events.LoanEventService, private CreditStateService: credit.CreditStateService) {

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

        getReos = () => {
            return this.wrappedLoan.ref.active.reos.filter((item: srv.ILiabilityViewModel) => { return !item.isSecondaryPartyRecord; });
        }

        deleteRealEstateRow = (item) => {

            this.CreditStateService.deleteREO(item);
            //CreditHelpers.deleteRealEstateRow(vm, clientId);
            // this.wrappedLoan.ref.active.removeFromCollection(item, wrappedLoan.ref.active.borrower.getPledgedAssets(), wrappedLoan.ref.active.coBorrower.getPledgedAssets());
        }

        editRealEstateItem = (pledgedAsset) => {
            this.addEditRealEstateItem(pledgedAsset, false);
        }

        addRealEstateItem = () => {

            //
            // @todo-cl: MUST COPY UP/DOWN
            //

            var newReo = new cls.LiabilityViewModel(this.wrappedLoan.ref.getTransactionInfoRef()); // cls.PendingREOViewModel();
            newReo.borrowerDebtCommentId = this.enums.PledgedAssetComment.DoNotPayoff;
            newReo.isUserEntry = true;
            this.addEditRealEstateItem(newReo, true);
        }

        //
        // @todo-cl: MUST COPY UP/DOWN
        //
        // addEditRealEstateItem = (pledgedAsset: cls.PendingREOViewModel, isNew: boolean) => {
        addEditRealEstateItem = (pledgedAsset: cls.LiabilityViewModel, isNew: boolean) => {
            //if (pledgedAsset.property.propertyId == lib.getEmptyGuid())
            //    pledgedAsset.property.propertyId = "";

            if (isNew || (pledgedAsset.unpaidBalance == 0 && !pledgedAsset.isLenderSectionVisible))
                pledgedAsset.unpaidBalance = 0;

            if (isNew || (pledgedAsset.minPayment == 0 && !pledgedAsset.isLenderSectionVisible))
                pledgedAsset.minPayment = 0;

            if (!pledgedAsset.lienPosition)
                pledgedAsset.lienPosition = 0;

            var modalInstance = this.$modal.open({
                templateUrl: 'angular/loanapplication/credit/realestate/realestateitem.html',
                controller: 'realEstateItemController',
                controllerAs: 'realEstateItemCtrl',
                backdrop: 'static',
                windowClass: 'imp-modal flyout imp-modal-real-estate-information',
                resolve: {
                    isNew: () => {
                        return isNew;
                    },
                    originalPledgedAssetModel: () => {
                        return pledgedAsset;
                    },
                    disableFields: () => {
                        return this.disableFields;
                    },
                    wrappedLoan: () => {
                        return this.wrappedLoan;
                    },
                    debtAccountOwnershipTypes: () => {
                        return this.debtAccountOwnershipTypes;
                    },
                    lookup: () => {
                        return this.applicationData.lookup;
                    },
                    generalSettings: () => {
                        return this.applicationData.generalSettings;
                    },
                    loanEvent: () => {
                        return this.loanEvent;
                    }
                }
            });

            modalInstance.result.then(function () {
                // @todo: Delete once confirmed labels are updating per loan.loanFunctions
                // CreditHelpers.calculateTotalsForReo(vm);
            })
        }

        moveREOToLiability = (pledgedAsset: cls.LiabilityViewModel, isCoborrower: boolean) => {

            this.CreditStateService.moveREOToLiability(pledgedAsset, isCoborrower);

            //var liability = CreditHelpers.moveREOToLiability(vm, pledgedAsset, isCoborrower);
            //if (liability) {
            //    pledgedAsset = liability;
            //}
        }
    }
    angular.module('loanApplication').controller('realEstateController', RealEstateController);
}
