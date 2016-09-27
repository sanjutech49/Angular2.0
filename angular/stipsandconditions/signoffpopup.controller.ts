/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

class SignOffPopUpController {
    static $inject = ['$modal', '$modalInstance'];

    constructor(private $modal,  private $modalInstance,
        private Code, private Condition, private ConditionItem, private PreviousItem, private ConditionsMainViewModelParam) {
    }

    conditions_signoffpopup_cancel = () => {
        this.ConditionItem.Status = this.PreviousItem.Status;
        this.ConditionItem.UpdatedDate = this.PreviousItem.UpdatedDate;
        this.ConditionItem.UpdatedBy = this.PreviousItem.UpdatedBy;
        this.$modalInstance.close(this.Condition);
    };

    conditions_signoffpopup_addNewItem = (ConditionsMainViewModelParam, Condition ) => {
        var newConditionViewModel = angular.copy(ConditionsMainViewModelParam.ConditionsSub.NewCondition);
        var newConditionItem = this.$modal.open({
            templateUrl: 'angular/stipsandconditions/addnewconditionitem.html',
            controller: NewConditionItemCtrl,
            controllerAs: 'newConditionsItemCtr',
            backdrop: 'static',
            resolve: {
                NewConditionViewModel: () => {
                    newConditionViewModel.ConfigurationCode.Code = Condition.ConfigurationCode.Code;
                    newConditionViewModel.ConfigurationCode.Title = Condition.ConfigurationCode.Title;
                    return newConditionViewModel;
                },
                ConditionsSub: function () {
                    return ConditionsMainViewModelParam.ConditionsSub;
                },
                DocumentsList: function () {
                    return ConditionsMainViewModelParam.ConditionsDocuments;
                }
            }
        });
    };

    conditions_signoffpopup_signOff = (Condition, ConditionItem) => {
        Condition.IsSignedOff = true;
        Condition.SignOffDate = new Date();
        Condition.UserSignedOff = ConditionItem.UpdatedBy;
        this.$modalInstance.close(this.Condition);
    };

}