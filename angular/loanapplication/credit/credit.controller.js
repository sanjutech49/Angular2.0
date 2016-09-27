/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/enums.ts" />
/// <reference path="../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../ts/lib/genericUtil.ts" />
/// <reference path="../../ts/lib/common.util.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../loanevents/loanEvents.service.ts" />
var credit;
(function (credit) {
    var CreditController = (function () {
        function CreditController($scope, $modal, $resource, $controller, modalPopoverFactory, simpleModalWindowFactory, CreditHelpers, NavigationSvc, $q, $interval, CreditSvc, wrappedLoan, applicationData, controllerData, enums, CreditStateService) {
            var _this = this;
            this.$scope = $scope;
            this.$modal = $modal;
            this.$resource = $resource;
            this.$controller = $controller;
            this.modalPopoverFactory = modalPopoverFactory;
            this.simpleModalWindowFactory = simpleModalWindowFactory;
            this.CreditHelpers = CreditHelpers;
            this.NavigationSvc = NavigationSvc;
            this.$q = $q;
            this.$interval = $interval;
            this.CreditSvc = CreditSvc;
            this.wrappedLoan = wrappedLoan;
            this.applicationData = applicationData;
            this.controllerData = controllerData;
            this.enums = enums;
            this.CreditStateService = CreditStateService;
            this.showLoader = true;
            this.showErrorContainer = false;
            this.runCreditItemOpen = false;
            this.SavingDataInProgress = false;
            this.disableFields = false;
            this.showCollections = function () {
                return _this.CreditStateService.showCollections();
            };
            this.showPublicRecords = function () {
                return _this.CreditStateService.showPublicRecords();
            };
            this.displayCreditScores = function () {
                return !!_this.wrappedLoan.ref.active.credit && !!_this.wrappedLoan.ref.active.credit.creditExceptionsResolved && !!_this.wrappedLoan.ref.active.getBorrower().ficoScore;
            };
            this.displayCreditReportMessage = function (creditViewModel) {
                return creditViewModel.creditStatus != _this.enums.creditReportStatus.retrieving && !common.string.isNullOrWhiteSpace(creditViewModel.creditReportMessage) && creditViewModel.creditStatus != _this.enums.creditReportStatus.undefined;
            };
            this.toggleGrid = function (isCollapsed) {
                _this.controllerData.isCollapsed.liabilities = _this.controllerData.isCollapsed.realEstate = _this.controllerData.isCollapsed.collections = _this.controllerData.isCollapsed.miscExpenses = _this.controllerData.isCollapsed.publicRecords = isCollapsed;
            };
            // @todo - move the below functions into another module where they belong
            this.borrowerMainInfoExists = function (user) {
                return _this.isDataFilledIn(user.firstName) && _this.isDataFilledIn(user.lastName) && _this.isDataFilledIn(user.ssn) && user.ssn != "0" && _this.isDataFilledIn(user.confirmSsn) && user.confirmSsn != "0" && user.ssn == user.confirmSsn && _this.isDataFilledIn(user.dateOfBirth) && _this.isDateOfBirthValid(user.dateOfBirth);
            };
            this.isDataFilledIn = function (data) {
                return data != null && data != undefined && data.length != 0;
            };
            this.isDateOfBirthValid = function (date) {
                if (!date)
                    return true;
                var minAdultsAge = 18;
                var dateRegEx = new RegExp("^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](17|18|19|20|21|22)?[0-9]{2})*$");
                return (dateRegEx.test(date) && (_this.getAge(new Date(date)) >= minAdultsAge));
            };
            this.getAge = function (birth) {
                var b = moment(birth);
                var age = moment().diff(b, 'years');
                return age;
            };
            // end of @todo 
            this.disableReRunCreditButton = function () {
                // @todo-cl::PROPERTY-ADDRESS
                return !_this.borrowerMainInfoExists(_this.wrappedLoan.ref.active.getBorrower()) || (_this.wrappedLoan.ref.active.isSpouseOnTheLoan && !_this.borrowerMainInfoExists(_this.wrappedLoan.ref.active.getCoBorrower())) || _this.wrappedLoan.ref.active.isCreditRunning;
            };
            /**
            * Format FICO score, if it is 0 then return N/A
            */
            this.formatFICOScore = function (value) {
                return _this.CreditSvc.formatFICOScore(value);
            };
            // @todo use TypeScript inheritance
            //extend controller
            angular.extend(this, $controller('DocumentCtrl', { $scope: this }));
            // modalWindowDependency so it can be accessed from SaveCreditTab in helper
            // note: depedency injection for modalWindowFactory in CreditHelper can't be resolved in Save function, so it's a workaround
            this.modalWindowDependecy = this.simpleModalWindowFactory;
            this.showLoader = false;
            this.showErrorContainer = false;
            this.disableFields = false;
            this.debtAccountOwnershipTypes = CreditStateService.debtAccountOwnershipTypes;
            //this.GetCreditReportStatus();
            this.wrappedLoan.ref.active.credit.disableReRunCreditButton = this.disableReRunCreditButton();
        }
        Object.defineProperty(CreditController.prototype, "totalLiabilities", {
            get: function () {
                var app = this.wrappedLoan.ref.active;
                var tot = 0;
                var totLiabilities = app.getLiabilitesBalanceTotal();
                tot += totLiabilities;
                var totReo = this.CreditStateService.summateTotalREOBalance();
                tot += totReo;
                var totCollections = app.getCollectionsTotalUnpaidBalance();
                tot += totCollections;
                return tot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "totalPaymentAmount", {
            // public records aren't included in any calculation
            get: function () {
                var app = this.wrappedLoan.ref.active;
                var tot = 0;
                var totReoPayments = this.CreditStateService.summateTotalREOPayment();
                tot += totReoPayments;
                var totLiabilitiesPayments = app.getLiabilitesPaymentTotal();
                tot += totLiabilitiesPayments;
                var totCollectionsPayments = app.getCollectionsTotalPayment();
                tot += totCollectionsPayments;
                var totMiscExpensesPayments = app.getMiscExpensesTotal();
                tot += totMiscExpensesPayments;
                return tot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "totalNetWorth", {
            get: function () {
                var app = this.wrappedLoan.ref.active;
                var tot = 0;
                var totAssets = app.getTotalAssetsAmount();
                tot += totAssets;
                var totReo = app.getReoEstimatedValueTotal;
                tot += totReo;
                var totLiabilities = this.totalLiabilities;
                tot -= totLiabilities;
                return tot;
            },
            enumerable: true,
            configurable: true
        });
        CreditController.$inject = ['$scope', '$modal', '$resource', '$controller', 'modalPopoverFactory', 'simpleModalWindowFactory', 'CreditHelpers', 'NavigationSvc', '$q', '$interval', 'CreditSvc', 'wrappedLoan', 'applicationData', 'controllerData', 'enums', 'CreditStateService'];
        return CreditController;
    })();
    angular.module('loanApplication').controller('creditController', CreditController);
})(credit || (credit = {}));
//# sourceMappingURL=credit.controller.js.map