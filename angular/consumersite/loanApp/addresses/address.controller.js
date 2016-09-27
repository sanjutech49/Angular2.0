/// <reference path="../otherincome/otherincome.controller.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var AddressController = (function () {
        function AddressController(loan, loanAppPageContext, consumerLoanService) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.consumerLoanService = consumerLoanService;
            this.isBorrower = true;
            this.isBorrower = !loanAppPageContext.isCoBorrowerState;
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(AddressController.prototype, "hasCoBorrower", {
            get: function () {
                return this.loan.loanApp.hasCoBorrower;
            },
            set: function (hasCoBorrower) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddressController.prototype, "borrowerName", {
            get: function () {
                return this.loan.loanApp.borrower.fullName;
            },
            set: function (borrowerName) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddressController.prototype, "coBorrowerName", {
            get: function () {
                if (this.loan.loanApp.hasCoBorrower) {
                    return this.loan.loanApp.coBorrower.fullName;
                }
                else {
                    return "";
                }
            },
            set: function (coBorrowerName) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddressController.prototype, "borrower", {
            get: function () {
                var borrower = this.isBorrower ? this.loan.loanApp.borrower : this.loan.loanApp.coBorrower;
                return borrower;
            },
            set: function (borrower) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddressController.prototype, "addressCurrent", {
            get: function () {
                var addressCurrent;
                if (this.borrower.currentAddress.isSameAsPropertyAddress) {
                    addressCurrent = this.loan.property;
                }
                else {
                    addressCurrent = this.borrower.currentAddress;
                }
                return addressCurrent;
            },
            set: function (addressCurrent) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddressController.prototype, "isSameMailingAsBorrowerCurrentAddress", {
            get: function () {
                return this.borrower.mailingAddress.isSameMailingAsBorrowerCurrentAddress;
            },
            set: function (isSameMailingAsBorrowerCurrentAddress) {
                this.borrower.mailingAddress.isSameMailingAsBorrowerCurrentAddress = isSameMailingAsBorrowerCurrentAddress;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddressController.prototype, "addressMailing", {
            get: function () {
                if (this.isSameMailingAsBorrowerCurrentAddress) {
                    return this.addressCurrent;
                }
                else {
                    return this.borrower.mailingAddress;
                }
            },
            set: function (addressMailing) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddressController.prototype, "isPreviousAddressRequired", {
            get: function () {
                if (!this.borrower.currentAddress.timeAtAddressYears && !this.borrower.currentAddress.timeAtAddressMonths) {
                    return false;
                }
                var years = lib.getNumericValue(this.borrower.currentAddress.timeAtAddressYears);
                var months = lib.getNumericValue(this.borrower.currentAddress.timeAtAddressMonths);
                var monthsTotal = (years * 12) + months;
                return monthsTotal < 25;
            },
            set: function (isPreviousAddressRequired) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddressController.prototype, "addressPrevious", {
            get: function () {
                return this.borrower.previousAddress;
            },
            set: function (addressPrevious) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddressController.prototype, "isCoborrowerAddressSame", {
            get: function () {
                return this.loan.loanApp.coBorrowerHasDifferentCurrentAddress;
            },
            set: function (isCoborrowerAddressSame) {
                this.loan.loanApp.coBorrowerHasDifferentCurrentAddress = isCoborrowerAddressSame;
            },
            enumerable: true,
            configurable: true
        });
        AddressController.className = "addressController";
        AddressController.$inject = ['loan', 'loanAppPageContext', 'consumerLoanService'];
        return AddressController;
    })();
    consumersite.AddressController = AddressController;
    // @todo-cc: REMOVE
    var AddressControllerVx = (function () {
        function AddressControllerVx(loan, loanAppPageContext, consumerLoanService) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.consumerLoanService = consumerLoanService;
            this.populateAddressFromProperty = function () {
                _this.borrower.currentAddress.streetName = _this.loan.property.streetName;
                _this.borrower.currentAddress.stateName = _this.loan.property.stateName;
                _this.borrower.currentAddress.zipCode = _this.loan.property.zipCode;
                _this.borrower.currentAddress.cityName = _this.loan.property.cityName;
                _this.borrower.currentAddress.isSameMailingAsBorrowerCurrentAddress = _this.loan.property.isSameMailingAsBorrowerCurrentAddress;
            };
            this.rbAddressClicked = function () {
                //  alert('hello');
            };
            this.clearAddress = function () {
                _this.borrower.currentAddress.streetName = undefined;
                _this.borrower.currentAddress.stateName = undefined;
                _this.borrower.currentAddress.zipCode = undefined;
                _this.borrower.currentAddress.cityName = undefined;
            };
            this.saveAddress = function () {
                var borrowerAddress = new cls.PropertyViewModel();
                borrowerAddress.streetName = _this.borrower.currentAddress.streetName;
                borrowerAddress.zipCode = _this.borrower.currentAddress.zipCode;
                borrowerAddress.cityName = _this.borrower.currentAddress.cityName;
                borrowerAddress.stateName = _this.borrower.currentAddress.stateName;
                borrowerAddress.timeAtAddressMonths = _this.borrower.currentAddress.timeAtAddressMonths;
                borrowerAddress.timeAtAddressYears = _this.borrower.currentAddress.timeAtAddressYears;
                //this.consumerLoanService.saveAddress(this.loan, borrowerAddress);
            };
            //this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            //this.borrower = !this.isBorrower ? this.loan.loanApp.coBorrower : this.loan.loanApp.borrower;
            //this.isSameAddress = true;
            //this.isCurrentAddressSame = false;
            //if (this.loan.property.isCurrentAddressSame == true)
            //    this.populateAddressFromProperty();
            //else
            //    this.clearAddress();
        }
        Object.defineProperty(AddressControllerVx.prototype, "hasCoBorrower", {
            get: function () {
                return this.loan.loanApp.hasCoBorrower;
            },
            set: function (hasCoBorrower) {
                this.loan.loanApp.hasCoBorrower = hasCoBorrower;
            },
            enumerable: true,
            configurable: true
        });
        AddressControllerVx.className = "addressControllerVx";
        AddressControllerVx.$inject = ['loan', 'loanAppPageContext', 'consumerLoanService'];
        return AddressControllerVx;
    })();
    consumersite.AddressControllerVx = AddressControllerVx;
    moduleRegistration.registerController(consumersite.moduleName, AddressController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=address.controller.js.map