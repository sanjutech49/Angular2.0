/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var AdditionalBorrowerController = (function () {
        function AdditionalBorrowerController(loan, loanAppPageContext, applicationData) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(AdditionalBorrowerController.prototype, "firstName", {
            get: function () {
                return this._firstName;
            },
            set: function (firstName) {
                this._firstName = firstName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdditionalBorrowerController.prototype, "lastName", {
            get: function () {
                return this._lastName;
            },
            set: function (lastName) {
                this._lastName = lastName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdditionalBorrowerController.prototype, "email", {
            get: function () {
                return this._email;
            },
            set: function (email) {
                this._email = email;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdditionalBorrowerController.prototype, "phone", {
            get: function () {
                return this._phone;
            },
            set: function (phone) {
                this._phone = phone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdditionalBorrowerController.prototype, "phoneType", {
            get: function () {
                return this._phoneType;
            },
            set: function (phoneType) {
                this._phoneType = phoneType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdditionalBorrowerController.prototype, "phoneTypeOptions", {
            get: function () {
                return this.applicationData.lookup.phoneNumberTypes;
            },
            enumerable: true,
            configurable: true
        });
        AdditionalBorrowerController.className = "additionalBorrowerController";
        AdditionalBorrowerController.$inject = ['loan', 'loanAppPageContext', 'applicationData'];
        return AdditionalBorrowerController;
    })();
    consumersite.AdditionalBorrowerController = AdditionalBorrowerController;
    moduleRegistration.registerController(consumersite.moduleName, AdditionalBorrowerController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=additionalBorrower.controller.js.map