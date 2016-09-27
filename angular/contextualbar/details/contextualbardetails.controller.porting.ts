
//angular.module('ContextualBarLoanDetails').controller('ContextualBarDetailsCtrl', ContextualBarDetailsController);
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts"/>
/// <reference path="../../ts/generated/viewModels.ts" />

class ContextualBarDetailsController {

    static $inject = ['$rootScope', 'ContextualBarSvc', 'loan'];
    IsVisible = false;
    LockHistoryPopup: string;
    LoanDetailsContextualBarViewModel: any;

    constructor(private $rootScope: ng.IRootScopeService, private ContextualBarSvc, private loan: srv.ILoanViewModel) {

        $rootScope.$on('REFRESH', function () {
            this.IsVisible = false;
            this.GetContextualBarDetails();
        });
    }

    GetContextualBarDetails = () => {
        var SelectedLoan = this.$rootScope.SelectedLoan;

        this.ContextualBarSvc.ContextualBarGetters.GetContextualBarDetails({
            loanId: SelectedLoan.LoanId,
            userAccountId: SelectedLoan.UserAccountId,
            contextualType: loanCenter.ContextualTypes.LoanApplication
        }).$promise
            .then(function (data) {
            this.LoanDetailsContextualBarViewModel = data;
            this.IsVisible = true;
            this.ShowHistory();
        }, errorMsg  => {
                console.log("Error:" + JSON.stringify(errorMsg));
            });
    }

    GetIconColor = (number) : loanCenter.IconColors => {
        return number >= 0 ? loanCenter.IconColors.Active : loanCenter.IconColors.Expired;  
    }

    IsDateTextExpired = (number) => {
        return number >= 0 ? false : true;
    }

    IsDescriptionTextExpired = (number) => {
        return number > 0 ? false : true;
    };

    // TODO - get rid of this implementation - NO HTML in a view model!
    ShowHistory = () => {
        this.LockHistoryPopup = '<div><table> <thead><th><tr><td class="condition-lock-history-td boldText">Locked On</td><td class="condition-lock-history-td boldText">Period</td><td class="condition-lock-history-td boldText">Expires On</td><td class="condition-lock-history-td boldText">Locked By</td></tr></th><thead><tbody>';
        angular.forEach(this.LoanDetailsContextualBarViewModel.LoanLockHistoryData, (history) => {
            this.LockHistoryPopup += '<tr><td class="condition-lock-history-td">' + history.LockedOn + '</td><td class="condition-lock-history-td">' + history.Period + ' Days</td><td class="condition-lock-history-td">' + history.ExpiresOn + '</td><td class="condition-lock-history-td">' + history.ModifyBy + '</td></tr>'
        })
        this.LockHistoryPopup += '</tbody></table></div>';
    }
}
