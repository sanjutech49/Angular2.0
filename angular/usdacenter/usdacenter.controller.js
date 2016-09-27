/// <reference path="../common/directives/common/impdirectives.settings.ts" />
var usda;
(function (usda) {
    var controller;
    (function (controller) {
        var USDACenterController = (function () {
            function USDACenterController(navigationService, enums, $window, $state, applicationData, wrappedLoan, commonService) {
                var _this = this;
                this.navigationService = navigationService;
                this.enums = enums;
                this.$window = $window;
                this.$state = $state;
                this.applicationData = applicationData;
                this.wrappedLoan = wrappedLoan;
                this.commonService = commonService;
                /**
                * @desc: Function will add new household member to the list
                */
                this.addNewHouseholdMember = function () {
                };
                /**
                * @desc: Function will display Property Eligibility pop up
                */
                this.runPropertyEligibility = function () {
                };
                /**
                * @desc: Function will opet third party web site in a new browser tab
                */
                this.openThirtPartyWebSite = function () {
                    _this.$window.open('http://eligibility.sc.egov.usda.gov/eligibility/incomeEligibilityAction.do', '_blank');
                };
                /**
                * @desc:  Function will run Mega Save
                */
                this.saveChanges = function () {
                    _this.navigationService.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan);
                };
                /**
                * @desc: Function will reload a loan, and all unsaved changes will be lost
                */
                this.cancelChanges = function () {
                    _this.$state.reload();
                };
                this.getAgeOutOfDoB = function (dateOfBirth) {
                    return _this.commonService.getYearsOutOfDate(dateOfBirth);
                };
                navigationService.contextualType = enums.ContextualTypes.USDACenter;
            }
            USDACenterController.$inject = ['NavigationSvc', 'enums', '$window', '$state', 'applicationData', 'wrappedLoan', 'commonService'];
            return USDACenterController;
        })();
        angular.module('usdaCenter').controller('usdaCenterController', USDACenterController);
    })(controller = usda.controller || (usda.controller = {}));
})(usda || (usda = {}));
//# sourceMappingURL=usdacenter.controller.js.map