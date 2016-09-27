var loanCenter;
(function (loanCenter) {
    var ContextualBarDetailsController = (function () {
        function ContextualBarDetailsController($rootScope, $scope, ContextualBarSvc, enums, LoanCalculator, wrappedLoan, applicationData, loanService, userAccountId, modalPopoverFactory, commonCalculatorSvc) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.ContextualBarSvc = ContextualBarSvc;
            this.enums = enums;
            this.LoanCalculator = LoanCalculator;
            this.wrappedLoan = wrappedLoan;
            this.applicationData = applicationData;
            this.loanService = loanService;
            this.userAccountId = userAccountId;
            this.modalPopoverFactory = modalPopoverFactory;
            this.commonCalculatorSvc = commonCalculatorSvc;
            /**
            * @desc Gets Aus type string representation.
            */
            this.getAusType = function () {
                return _this.ContextualBarSvc.getAusType(_this.wrappedLoan.ref, _this.applicationData.lookup.ausTypes);
            };
            this.GetIconColor = function (numberparam) {
                return numberparam >= 0 ? _this.enums.iconColors.active : _this.enums.iconColors.expired;
            };
            this.IsDateTextExpired = function (numberparam) {
                return numberparam < 0;
            };
            this.IsDescriptionTextExpired = function (numberparam) {
                return numberparam <= 0;
            };
            this.getLowestMiddleFicoScore = function () {
                var midFicoScore = _this.commonCalculatorSvc.GetLowestMiddleFicoScore(_this.wrappedLoan, _this.applicationData);
                return midFicoScore;
            };
            var self = this;
            self.IsVisible = false;
            self.iconColors = self.enums.iconColors;
            this.loan = this.wrappedLoan.ref;
            self.lowerDecisionScore = self.getLowestMiddleFicoScore();
            $scope.$on("REFRESHCotextualBar", function (event) {
                self.lowerDecisionScore = self.getLowestMiddleFicoScore();
            });
        }
        ContextualBarDetailsController.className = 'ContextualBarDetailsController';
        ContextualBarDetailsController.$inject = ['$rootScope', '$scope', 'ContextualBarSvc', 'enums', 'LoanCalculator', 'wrappedLoan', 'applicationData', 'loanService', 'userAccountId', 'modalPopoverFactory', 'commonCalculatorSvc'];
        return ContextualBarDetailsController;
    })();
    loanCenter.ContextualBarDetailsController = ContextualBarDetailsController;
    //
    // @todo: Register per standards
    // 
    angular.module('contextualBar').controller('ContextualBarDetailsCtrl', ContextualBarDetailsController);
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=contextualbardetails.controller.js.map