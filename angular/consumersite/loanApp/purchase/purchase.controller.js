/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var PurchaseController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function PurchaseController() {
            this.controllerAsName = "purchaseCntrl";
            this.printSomething = function () {
                console.log("Purchase works");
            };
        }
        PurchaseController.className = "purchaseController";
        PurchaseController.$inject = [];
        return PurchaseController;
    })();
    consumersite.PurchaseController = PurchaseController;
    moduleRegistration.registerController(consumersite.moduleName, PurchaseController);
    var loanCenter;
    (function (loanCenter) {
        'use strict';
        var PurchaseInfo = (function () {
            function PurchaseInfo(PurchaseInfo) {
                this.purchaseInfoObj = {
                    purchaseId: null,
                    addressTypeId: null,
                    cityName: null,
                    stateId: null,
                    stateName: null,
                    states: null,
                    streetName: null,
                    unitNumber: null,
                    zipCode: null,
                    origPurchasePrice: null,
                    monthlyHOA: null,
                    estimatedValue: null,
                    loanAmt: null,
                    occupancyType: null,
                    purchaseType: null,
                    nbrOfUnits: null,
                    downPayment: null,
                    downPaymentBounce: null
                };
            }
            return PurchaseInfo;
        })();
    })(loanCenter || (loanCenter = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=purchase.controller.js.map