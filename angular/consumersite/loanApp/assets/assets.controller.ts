/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path='../../../../angular/ts/extendedViewModels/asset.extendedViewModel.ts' />
/// <reference path="../../../../angular/ts/generated/viewModels.ts" />
/// <reference path="../../../../angular/ts/generated/viewModelClasses.ts" />

module consumersite {

    export class AssetsController {

        private assetActive: vm.Asset;
        private ownerTypeLookup: vm.ILookupEntry<srv.OwnerTypeEnum>[];

        static className = "assetsController";

        public static $inject = ['loan', 'loanAppPageContext', 'applicationData'];

        constructor(private loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any) {
            this.populateOwnerTypeLookup();
        
            //Assets array is empty, add one for the user to begin the page.
            if (this.loan.loanApp.assets.length == 0) {
                this.addAsset();
            }
            else { // select the last one
                this.assetActive = this.loan.loanApp.assets[this.loan.loanApp.assets.length - 1];
            }

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

        addAsset = (): void => {
            this.assetActive = this.loan.loanApp.assets[this.loan.loanApp.addAsset() - 1];
        }

        assetCount = () => {
            return this.loan.loanApp.assets.length;
        }

        populateOwnerTypeLookup = () => {
            this.ownerTypeLookup = [];

            this.ownerTypeLookup.push({ value: srv.OwnerTypeEnum.Borrower, text: this.loan.loanApp.borrower.fullName });

            if (this.loan.loanApp.hasCoBorrower) {
                this.ownerTypeLookup.push({ value: srv.OwnerTypeEnum.CoBorrower, text: this.loan.loanApp.coBorrower.fullName });
            }

            this.ownerTypeLookup.push({ value: srv.OwnerTypeEnum.Joint, text: "Joint" });
        }

        getOwnerTypeLookups = (): ng.IPromise<vm.ILookupEntry<srv.OwnerTypeEnum>[]> | vm.ILookupEntry<srv.OwnerTypeEnum>[] => {
            return this.ownerTypeLookup;
        }
    }
    moduleRegistration.registerController(consumersite.moduleName, AssetsController);
} 