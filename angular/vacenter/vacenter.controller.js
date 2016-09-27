/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="vacenter.service.ts" />
var va;
(function (va) {
    var controller;
    (function (controller) {
        'use strict';
        var VACenterController = (function () {
            function VACenterController(vaCenterService, wrappedLoan, $state, navigationService, applicationData, enums, fhaCenterService) {
                var _this = this;
                this.vaCenterService = vaCenterService;
                this.wrappedLoan = wrappedLoan;
                this.$state = $state;
                this.navigationService = navigationService;
                this.applicationData = applicationData;
                this.enums = enums;
                this.fhaCenterService = fhaCenterService;
                /*
                 * @desc: Calls Mega save
                */
                this.saveChanges = function () {
                    _this.navigationService.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan);
                };
                /*
                 * @desc: Reloads current state
                */
                this.cancelChanges = function () {
                    _this.navigationService.cancelChanges(_this.wrappedLoan.ref.loanId);
                };
                this.selectVACalculator = function (value) {
                    _this.fhaCenterService.selectProduct(_this.applicationData.lookup.vaCalculators, value);
                    _this.navigationService.navigateToVACalculator(value);
                };
                this.getSelectedVACalculatorName = function () {
                    return lib.filter(_this.applicationData.lookup.vaCalculators, function (item) {
                        return item.selected;
                    })[0].text;
                };
                navigationService.contextualType = enums.ContextualTypes.VaCenter;
                lib.forEach(this.applicationData.lookup.vaCalculators, function (item) {
                    item.selected = item.value == String(1 /* VAGeneralInformation */) ? true : false;
                });
            }
            VACenterController.$inject = ['vaCenterService', 'wrappedLoan', '$state', 'NavigationSvc', 'applicationData', 'enums', 'fhaCenterService'];
            return VACenterController;
        })();
        angular.module('vaCenter').controller('vaCenterController', VACenterController);
    })(controller = va.controller || (va.controller = {}));
})(va || (va = {}));
//# sourceMappingURL=vacenter.controller.js.map