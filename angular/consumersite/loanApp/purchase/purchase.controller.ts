/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class PurchaseController {

        public controllerAsName: string = "purchaseCntrl";

        static className = "purchaseController";

        public static $inject = [];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor() {
        }

        printSomething = () => {
            console.log("Purchase works");
        }

    }
    moduleRegistration.registerController(consumersite.moduleName, PurchaseController);

    module loanCenter {
        'use strict';

        interface IPurchaseInfo {
            purchaseId: number;
            addressTypeId: number;
            cityName: string;
            stateId: string;
            stateName: string;
            states: string;
            streetName: number;
            unitNumber: number;
            zipCode: number;
            origPurchasePrice: number;
            monthlyHOA: number;
            estimatedValue: number;
            loanAmt: number;
            occupancyType: number;
            purchaseType: number;
            nbrOfUnits: number;
            downPayment: number;
            downPaymentBounce: number;
        }

        class PurchaseInfo {
            public purchaseInfoObj: IPurchaseInfo;

            constructor(PurchaseInfo) {
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
                }
            }
        }
    }
} 

