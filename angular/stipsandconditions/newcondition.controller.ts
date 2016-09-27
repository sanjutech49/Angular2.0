/// <reference path="../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />


class NewConditionController {

    NewConditionViewModel;
    AssignedToList;
    SignedOffList;
    CodesList;
    DueList;
    CategoryList;

    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance, private ConditionsSub, private NewCondition) {
    
        //  todo- why copy and why duplication the binding, just use the NewCondition in the template ?
        this.NewConditionViewModel = angular.copy(NewCondition);
        this.AssignedToList = ConditionsSub.AssignedToList;
        this.SignedOffList = ConditionsSub.SignedOffList;
        this.CodesList = ConditionsSub.CodesList;
        this.DueList = ConditionsSub.DueList;
        this.CategoryList = ConditionsSub.CategoryList;
    }

    conditions_addnewcondition_addItem = (NewConditionViewModel) => {
        this.$modalInstance.close(NewConditionViewModel);
    }

    conditions_addnewcondition_cancel = () => {
        this.$modalInstance.dismiss('cancel');
    }

    configurationcodechanged = (code, NewConditionViewModel, AssignedToList, DueList) => {
        NewConditionViewModel.ConfigurationCode = code;
        angular.forEach(AssignedToList,(assignedTo) => {
            if (assignedTo.RoleId == code.CurativeRoleCdId) {
                NewConditionViewModel.AssignedTo = assignedTo;
                return false;
            }
        });
        angular.forEach(this.DueList,(due) => {
            if (due.EnumerationValueId == code.GateCdId) {
                NewConditionViewModel.Due = due;
                return false;
            }
        });
        NewConditionViewModel.InternalOnly = code.ExternallyVisible;
    }
}

angular.module('stipsandconditions').controller('NewConditionController', NewConditionController);

 