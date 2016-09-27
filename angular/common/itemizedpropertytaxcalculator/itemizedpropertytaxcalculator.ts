module loanCenter {
    'use strict';

    export class itemizedPropertyTaxCalculatorController {

        static className = 'itemizedPropertyTaxCalculatorController';
        static $inject = ['paymentPeriodMonths', 'costDetailsSvc'];

        constructor(private paymentPeriodMonths, private costDetailsSvc) {
            this.paymentPeriodMonths = paymentPeriodMonths;
            this.costDetailsSvc = costDetailsSvc;

        }

        private basePred = (itemizedPropertyTax: srv.IItemizedPropertyTaxViewModel) => itemizedPropertyTax.amount != null;

        public initialize(model: srv.ICostViewModel) {
            if (model.itemizedPropertyTaxes.length == 0) {
                this.costDetailsSvc.initializeItemizedPropertyTaxes.query({ costId: model.costId })
                    .$promise.then(function (data: Array<srv.IItemizedPropertyTaxViewModel>) {
                    model.itemizedPropertyTaxes = angular.copy(data);
                },
                    function (error) {
                        console.log(error);
                    });
            }
            this.recalculateAmount(model);
        }

        public recalculateAmount = (model: srv.ICostViewModel): void => {
            model.amountForYear = lib.summate(model.itemizedPropertyTaxes, l => this.basePred(l), l => l.amount);
            model.amountPerMonth = model.amountForYear/12;
        }

    }

    angular.module('loanCenter').controller('itemizedPropertyTaxCalculatorController', itemizedPropertyTaxCalculatorController);
} 