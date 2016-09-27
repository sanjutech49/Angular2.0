/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var AlertPreferencesController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        //constructor(wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>) {
        function AlertPreferencesController(loan, loanAppPageContext) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.controllerAsName = "alertPrefCntrl";
            if (!angular.isDefined(this._alertEmails)) {
                this._alertEmails = [];
            }
            if (!angular.isDefined(this._alertMobiles)) {
                this._alertMobiles = [];
            }
            this._alertEmails.push("test1@abc.com");
            this._alertEmails.push("test2@abc.com");
            this._alertEmails.push("test3@abc.com");
            this._alertMobiles.push("800-555-1212");
            this._alertMobiles.push("800-555-1213");
            this._alertMobiles.push("800-555-1214");
            this._enableEmailAlerts = true;
            this._enableMobileAlerts = true;
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(AlertPreferencesController.prototype, "enableEmailAlerts", {
            get: function () {
                return this._enableEmailAlerts;
            },
            set: function (value) {
                this._enableEmailAlerts = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlertPreferencesController.prototype, "alertEmails", {
            get: function () {
                return this._alertEmails;
            },
            set: function (value) {
                this._alertEmails = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlertPreferencesController.prototype, "enableMobileAlerts", {
            get: function () {
                return this._enableMobileAlerts;
            },
            set: function (value) {
                this._enableMobileAlerts = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlertPreferencesController.prototype, "alertMobiles", {
            get: function () {
                return this._alertMobiles;
            },
            set: function (value) {
                this._alertMobiles = value;
            },
            enumerable: true,
            configurable: true
        });
        AlertPreferencesController.className = "alertPreferencesController";
        //public static $inject = ['wrappedLoan'];
        AlertPreferencesController.$inject = ['loan', 'loanAppPageContext'];
        return AlertPreferencesController;
    })();
    consumersite.AlertPreferencesController = AlertPreferencesController;
    moduleRegistration.registerController(consumersite.moduleName, AlertPreferencesController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=alertpreferences.controller.js.map