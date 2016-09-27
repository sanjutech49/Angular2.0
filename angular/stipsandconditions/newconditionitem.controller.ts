/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

class NewConditionItemCtrl {

    NewConditionViewModel;
    ItemsList;
    ForList;
    DocumentList;
    Status;
    UpdatedBy;
    UpdatedDate;
    search;
    IsPropertyCondition;

    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance, NewConditionViewModel, ConditionsSub, DocumentsList) {

        this.NewConditionViewModel = NewConditionViewModel;
        this.ItemsList = ConditionsSub.ItemsList;
        this.ForList = ConditionsSub.ForList;
        this.DocumentList = DocumentsList;
        this.Status = ConditionsSub.NewCondition.CurativeItems[0].Status;
        this.UpdatedBy = ConditionsSub.NewCondition.CurativeItems[0].UpdatedBy;
        this.UpdatedDate = new Date();
        this.search = [];

        var selectedCategory = this.NewConditionViewModel.ConfigurationCode.CategoryCdId;
        this.IsPropertyCondition = false;
        angular.forEach(ConditionsSub.PropertyConditionList,(propertyItem) => {
            if (propertyItem == selectedCategory) {
                this.IsPropertyCondition = true;
            }
        });

    }
    docTypeFilter = (item, NewConditionViewModel) => {
        var show = false;
        angular.forEach(NewConditionViewModel.ConfigurationCode.ItemConfigurations,(itemConfiguration) => {
            if (itemConfiguration.DocTypeId == item.EnumerationValueId) {
                show = true;
            }
        });
        return show;
    };

    filterForMenu = (item, IsPropertyCondition) => {

        if ((IsPropertyCondition && item.Section == "Property") || (!IsPropertyCondition && item.Section != "Property"))
            return true;
        else return false;
    }

    conditions_addnewconditionitem_save = (NewConditionViewModel) => {
        this.$modalInstance.close(NewConditionViewModel);
    };

    conditions_addnewconditionitem_cancel = (NewConditionViewModel) => {
        // remove added items for existing condition
        angular.forEach(NewConditionViewModel.CurativeItems,(item) => {
            if (item.PreviouslyAdded) {
                return true;
            }
            else {
                item.IsRemoved = true;
            }
        });
        this.$modalInstance.dismiss('cancel');
    };

    conditions_addnewconditionitem_addNewItem = (NewConditionViewModel, Status, UpdatedBy) => {
        NewConditionViewModel.CurativeItems.push({ Description: null, Document: null, For: null, Item: null, Status: Status, UpdatedBy: UpdatedBy, UpdatedDate: new Date() });
    };
}

angular.module('stipsandconditions').controller('NewConditionItemCtrl', NewConditionItemCtrl);