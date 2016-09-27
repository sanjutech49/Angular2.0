/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var PropertyController = (function () {
        function PropertyController(loan, loanAppPageContext, applicationData, navigationService, $scope, $location) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.navigationService = navigationService;
            //Scroll so just the loanAppNavbarIsVisible
            //loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(PropertyController.prototype, "isPurchaseTypeLoan", {
            get: function () {
                return this.loan.loanPurposeType == 1 /* Purchase */;
            },
            set: function (isPurchaseTypeLoan) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "isSameAsPropertyAddress", {
            get: function () {
                return this.loan.loanApp.borrower.currentAddress.isSameAsPropertyAddress;
            },
            set: function (isSameAsPropertyAddress) {
                this.loan.loanApp.borrower.currentAddress.isSameAsPropertyAddress = isSameAsPropertyAddress;
            },
            enumerable: true,
            configurable: true
        });
        PropertyController.className = "propertyController";
        PropertyController.$inject = ['loan', 'loanAppPageContext', 'applicationData', 'navigationService', '$scope', '$location'];
        return PropertyController;
    })();
    consumersite.PropertyController = PropertyController;
    // @todo-cc: REMOVE
    var PropertyControllerVx = (function () {
        function PropertyControllerVx(loan, loanAppPageContext, applicationData, navigationService, $scope, $location) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.navigationService = navigationService;
            this.isPurchaseTypeLoan = function () {
                return _this.loan.loanPurposeType == 1 /* Purchase */;
            };
            this.SaveContinueProperty = function () {
                _this.$location1.url('/borrowerAddressInfo');
                // this.navigationService.goToAddress();
            };
            //isRefinanceTypeLoan = () => {
            //    //return this.loan.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance;
            //    return true;
            //}
            this.needPreApproval_Click = function (value) {
                console.log(value);
                _this.loan.property.NeedPreApproval = value;
                _this.streetNamePlaceholder = value ? "TBD" : "";
            };
            this.sameaddress = true;
            this.streetNamePlaceholder = "TBD";
            loan.property.numberOfUnits = 1;
            loan.property.NeedPreApproval = true;
            //loan.property.isCurrentAddressSame= true;
            this.$location1 = $location;
            //  $scope.UINavigate.canNavigate = true;
        }
        PropertyControllerVx.className = "propertyControllerVx";
        PropertyControllerVx.$inject = ['loan', 'loanAppPageContext', 'applicationData', 'navigationService', '$scope', '$location'];
        return PropertyControllerVx;
    })();
    consumersite.PropertyControllerVx = PropertyControllerVx;
    moduleRegistration.registerController(consumersite.moduleName, PropertyController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=property.controller.js.map