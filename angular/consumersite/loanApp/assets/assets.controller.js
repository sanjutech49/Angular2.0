/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path='../../../../angular/ts/extendedViewModels/asset.extendedViewModel.ts' />
/// <reference path="../../../../angular/ts/generated/viewModels.ts" />
/// <reference path="../../../../angular/ts/generated/viewModelClasses.ts" />
var consumersite;
(function (consumersite) {
    var AssetsController = (function () {
        function AssetsController(loan, loanAppPageContext, applicationData) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.addAsset = function () {
                _this.assetActive = _this.loan.loanApp.assets[_this.loan.loanApp.addAsset() - 1];
            };
            this.assetCount = function () {
                return _this.loan.loanApp.assets.length;
            };
            this.populateOwnerTypeLookup = function () {
                _this.ownerTypeLookup = [];
                _this.ownerTypeLookup.push({ value: 1 /* Borrower */, text: _this.loan.loanApp.borrower.fullName });
                if (_this.loan.loanApp.hasCoBorrower) {
                    _this.ownerTypeLookup.push({ value: 2 /* CoBorrower */, text: _this.loan.loanApp.coBorrower.fullName });
                }
                _this.ownerTypeLookup.push({ value: 3 /* Joint */, text: "Joint" });
            };
            this.getOwnerTypeLookups = function () {
                return _this.ownerTypeLookup;
            };
            this.populateOwnerTypeLookup();
            //Assets array is empty, add one for the user to begin the page.
            if (this.loan.loanApp.assets.length == 0) {
                this.addAsset();
            }
            else {
                this.assetActive = this.loan.loanApp.assets[this.loan.loanApp.assets.length - 1];
            }
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        AssetsController.className = "assetsController";
        AssetsController.$inject = ['loan', 'loanAppPageContext', 'applicationData'];
        return AssetsController;
    })();
    consumersite.AssetsController = AssetsController;
    moduleRegistration.registerController(consumersite.moduleName, AssetsController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=assets.controller.js.map