module loanCenter {

    export class ContextualBarDetailsController {
        'use strict';
        static className = 'ContextualBarDetailsController';

        private loan: srv.ILoanViewModel;
        IsVisible: boolean;
        iconColors: string;
        public lowerDecisionScore: string;

        static $inject = ['$rootScope', '$scope', 'ContextualBarSvc', 'enums', 'LoanCalculator', 'wrappedLoan', 'applicationData', 'loanService', 'userAccountId', 'modalPopoverFactory', 'commonCalculatorSvc'];

        constructor(private $rootScope, private $scope, public ContextualBarSvc: contextualBar.ContextualBarSvc, private enums, private LoanCalculator, public wrappedLoan, public applicationData, private loanService, private userAccountId, private modalPopoverFactory, private commonCalculatorSvc) {
            var self = this;

            self.IsVisible = false;
            self.iconColors = self.enums.iconColors;
            this.loan = <srv.ILoanViewModel>this.wrappedLoan.ref;

            self.lowerDecisionScore = self.getLowestMiddleFicoScore();

            $scope.$on("REFRESHCotextualBar", function (event) {
                self.lowerDecisionScore = self.getLowestMiddleFicoScore();
            });
        }

        /**
        * @desc Gets Aus type string representation.
        */
        public getAusType = (): string => {
            return this.ContextualBarSvc.getAusType(<srv.ILoanViewModel>this.wrappedLoan.ref, this.applicationData.lookup.ausTypes);
        }
        GetIconColor = (numberparam: number): string => {
            return numberparam >= 0 ? this.enums.iconColors.active : this.enums.iconColors.expired;
        }

        IsDateTextExpired = (numberparam: number): boolean => {
            return numberparam < 0;
        }

        IsDescriptionTextExpired = (numberparam: number): boolean => {
            return numberparam <= 0;
        }

        public getLowestMiddleFicoScore = (): string => {
            var midFicoScore = this.commonCalculatorSvc.GetLowestMiddleFicoScore(this.wrappedLoan, this.applicationData);

            return midFicoScore;
        }

        

    }

    //
    // @todo: Register per standards
    // 
    angular.module('contextualBar').controller('ContextualBarDetailsCtrl', ContextualBarDetailsController);
}