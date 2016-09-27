(function () {
    'use strict';
    angular.module('stipsandconditionsOld', []);
    angular.module('stipsandconditionsOld').controller('LoanCenterConditionsController', function ($scope, $compile, $http, $modal, $filter) {
        $scope.ConditionsMainViewModel = [];
        $scope.refresh = function (loanId, refreshNeeded) {
            if (conditionsLoaded && refreshNeeded != true) {
                // Refresh from session if needed and show tab content
                $("#loanDetailsSubTabProgressBar").hide();
                $("#conditionsSubSection").show();
            }
            else {
                $.getJSON('Conditions/GetConditionsData?loanid=' + loanId, function (data) {
                    if (data.success != false) {
                        $scope.getData(data, true);
                    }
                    else {
                        $scope.openErrorPopup(data.message);
                    }

                    if (refreshNeeded === true) {
                        setTimeout(function () { HideProcessingInfo(); }, 300);
                        return;
                    }

                    $("#conditionsSubSection").html(
                    $compile(
                        $("#conditionsSubSection").html()
                    )($scope));

                    conditionsLoaded = true;

                    if ($("#ConditionsMenuLi").hasClass("ui-tabs-selected")) {
                        setTimeout(function () {
                            $("#loanDetailsSubTabProgressBar").hide();
                            $("#conditionsSubSection").show();
                        }, 300);
                    }
                });
            }
        };
        $scope.SetConditionSorting = function (categoryName, borrower) {
            var index = '';

            if (categoryName == "Assets")
                index = "3";
            if (categoryName == "Collateral")
                index = borrower ? "5" : "4";
            if (categoryName == "Credit")
                index = borrower ? "1" : "5";
            if (categoryName == "Identity")
                index = borrower ? "4" : "6";
            if (categoryName == "Income")
                index = borrower ? "2" : "7";
            if (categoryName == "Escrow")
                index = borrower ? "6" : "2";
            if (categoryName == "Property")
                index = borrower ? "7" : "1";

            return index + categoryName;
        }
        $scope.getData = function (data, checkIsOpen) {
            $scope.ConditionsMainViewModel = data;
            $scope.groupedConditions = _.groupByMulti($scope.ConditionsMainViewModel.ConditionsSub.Conditions, ['OwnerNames', 'CategoryDescription']);
            $scope.groupedDocuments = _.groupBy($scope.ConditionsMainViewModel.ConditionsDocuments, 'CategorySortName');
            $scope.lockHistoryPopup = '<div><table> <thead><th><tr><td class="condition-lock-history-td boldText">Locked On</td><td class="condition-lock-history-td boldText">Period</td><td class="condition-lock-history-td boldText">Expires On</td><td class="condition-lock-history-td boldText">Locked By</td></tr></th><thead><tbody>';
            angular.forEach(data.LoanSummary.LoanLockHistoryData, function (history) {
                $scope.lockHistoryPopup += '<tr><td class="condition-lock-history-td">' + history.LockedOn + '</td><td class="condition-lock-history-td">' + history.Period + ' Days</td><td class="condition-lock-history-td">' + history.ExpiresOn + '</td><td class="condition-lock-history-td">' + history.ModifyBy + '</td></tr>'
            })
            $scope.lockHistoryPopup += '</tbody></table></div>';
            if (checkIsOpen == true) {
                $scope.expandCategoriesAndItems($scope.groupedConditions);
                $scope.ConditionsDueFilterId = "";
            }
            $scope.InitializeDeliveryVault();
            $scope.$apply();
        };


        // Use this object for saving previous states of any model.
        $scope.previous = {};
        $scope.previous.item = {};

        $scope.getNotesIcon = function (notes) {

            if (notes == null || notes.length == 0)
                return "blank";

            var readCount = 0;
            var addNoteToFileCount = 0;
            angular.forEach(notes, function (note) {
                if (!note.MarkAsUnread)
                    readCount++;

                if (note.AddNoteToFile)
                    addNoteToFileCount++;
            });

            if (addNoteToFileCount > 0 && readCount == notes.length)
                return "attached";

            if (readCount == notes.length)
                return "read";

            return "unread";
        };

        $scope.deleteConditionDisabled = function (condition) {
            var ausSource = ["DU", "LP", "GUS"];
            var conditionSourceCode = condition != null && condition.ConditionSource != null && condition.ConditionSource.Code != null ? condition.ConditionSource.Code : "";

            var decisionStatusApproved = ($scope.ConditionsMainViewModel != null && $scope.ConditionsMainViewModel.LoanSummary != null &&
             $scope.ConditionsMainViewModel.LoanSummary.DecisionStatus != null && $scope.ConditionsMainViewModel.LoanSummary.DecisionStatus == '48');

            return _.contains(ausSource, conditionSourceCode) || decisionStatusApproved;

        }

        $scope.docVaultCategoryVisible = function (categoryName) {
            categoryName = categoryName.replace("01", "").replace("02", "").replace("03", "");
            return categoryName == null ? false : categoryName.toLowerCase() == 'unclassified' || categoryName.toLowerCase() == 'unassigned';
        }

        $scope.docVaultIsUnclassifiedCategory = function (categoryName) {
            categoryName = categoryName.replace("01", "").replace("02", "").replace("03", "");
            return categoryName == null ? false : categoryName.toLowerCase() == 'unclassified';
        }

        $scope.iconColors = { active: "#1fb25a", expired: "#E73302", add: "#208DDC", del: "#DD3131", disabled: "#797979" };

        $scope.getIconColor = function (number) {
            if (number >= 0)
                return $scope.iconColors.active;
            else {

                return $scope.iconColors.expired;
            }
        };

        $scope.conditionDueFilters = [
              { code: "", selectedcode: "" },
              { code: "PriorToApproval", selectedcode: "PriorToApproval" },
              { code: "PriorToApproval", selectedcode: "PriorToDocuments" },
              { code: "PriorToDocuments", selectedcode: "PriorToDocuments" },
              { code: "PriorToApproval", selectedcode: "PriorToFunding" },
              { code: "PriorToDocuments", selectedcode: "PriorToFunding" },
              { code: "PriorToFunding", selectedcode: "PriorToFunding" },
              { code: "AfterFunding", selectedcode: "AfterFunding" }
        ];

        $scope.conditionsDueFilter = function (condition, filterId) {
            // var filterId = $scope.ConditionsDueFilterId;
            if (filterId == null || filterId == "") {
                return true;
            }

            var visible = false;
            angular.forEach($scope.conditionDueFilters, function (itemValue, itemKey) {
                if (itemValue.selectedcode == filterId && (condition.Due == null || itemValue.code == condition.Due.Code)) {
                    visible = true;
                    return false;
                }
            });

            return visible;
        }

        $scope.isDescriptionTextExpired = function (number) {
            if (number > 0)
                return false;
            else
                return true;
        };

        $scope.isDateTextExpired = function (number) {
            if (number >= 0)
                return false;
            else
                return true;
        };

        $scope.isOwnerOccupied = function (isOwnerOccupied) {
            return isOwnerOccupied ? "- Owner Occupied" : "- Non-Owner Occupied";
        };
        $scope.showCount = function (categoryGroups) {
            var show = false;
            angular.forEach(categoryGroups, function (condition) {
                if (!condition.IsRemoved) {
                    show = true;
                }
            });
            return show;
        }
        $scope.getCategoryOpenItemsCount = function (categoryGroups) {
            var count = 0;
            angular.forEach(categoryGroups, function (condition) {
                count += $scope.getConditionOpenItemsCount(condition);
            });
            return count;
        };

        $scope.getCategoryReadyForReviewItemsCount = function (categoryGroups) {
            var count = 0;
            angular.forEach(categoryGroups, function (condition) {
                count += $scope.getConditionReadyForReviewItemsCount(condition);
            });
            return count;
        };

        $scope.getConditionOpenItemsCount = function (condition) {
            var count = 0;
            angular.forEach(condition.CurativeItems, function (item) {
                if (item.Status.Code != 'Waived' && item.Status.Code != 'Cleared' && item.IsRemoved != true) {
                    count += 1;
                }
            });
            condition.OpenitemsCount = count;
            return count;
        };

        $scope.getConditionReadyForReviewItemsCount = function (condition) {
            var count = 0;
            angular.forEach(condition.CurativeItems, function (item) {
                if (item.Status.Code == 'ReadyToReview' && item.IsRemoved != true) {
                    count += 1;
                }
            });
            condition.ReadyForReviewItemsCount = count;
            return count;
        };

        $scope.addNewCondition = function () {
            var newCondition = $modal.open({
                templateUrl: 'angular/stipsandconditions2.0/addnewcondition.html',
                controller: NewConditionCtrl,
                backdrop: 'static',
                resolve: {
                    ConditionsSub: function () {
                        return $scope.ConditionsMainViewModel.ConditionsSub;
                    },
                    NewCondition: function () {
                        return $scope.ConditionsMainViewModel.ConditionsSub.NewCondition;
                    }
                }
            });

            newCondition.result.then(function (NewConditionViewModel) {
                var newConditionItem = $modal.open({
                    templateUrl: 'angular/stipsandconditions2.0/addnewconditionitem.html',
                    controller: NewConditionItemCtrl,
                    backdrop: 'static',
                    resolve: {
                        NewConditionViewModel: function () {
                            return NewConditionViewModel;
                        },
                        ConditionsSub: function () {
                            return $scope.ConditionsMainViewModel.ConditionsSub;
                        },
                        DocumentsList: function () {
                            return $scope.ConditionsMainViewModel.ConditionsDocuments;
                        }
                    }
                });
                newConditionItem.result.then(function (NewConditionViewModel) {
                    $scope.AddNewConditionToList(NewConditionViewModel);

                });
            });
        };

        $scope.addNewCurativeItem = function (condition) {
            condition.CurativeItems.push({
                Description: null,
                Document: null,
                For: null,
                Item: null,
                Status: $scope.ConditionsMainViewModel.ConditionsSub.NewCondition.CurativeItems[0].Status,
                UpdatedBy: $scope.ConditionsMainViewModel.ConditionsSub.NewCondition.CurativeItems[0].UpdatedBy,
                UpdatedDate: new Date()
            });
            var newConditionItem = $modal.open({
                templateUrl: 'angular/stipsandconditions2.0/addnewconditionitem.html',
                controller: NewConditionItemCtrl,
                backdrop: 'static',
                resolve: {
                    NewConditionViewModel: function () {
                        return condition;
                    },
                    ConditionsSub: function () {
                        return $scope.ConditionsMainViewModel.ConditionsSub;
                    },
                    DocumentsList: function () {
                        return $scope.ConditionsMainViewModel.ConditionsDocuments;
                    }
                }
            });
            newConditionItem.result.then(function (NewConditionViewModel) {
                var items = angular.copy(NewConditionViewModel.CurativeItems);
                var newCondition = angular.copy(NewConditionViewModel);
                newCondition.CurativeItems = [];
                newCondition.NewCondition = true;

                var i = NewConditionViewModel.CurativeItems.length;
                while (i--) {
                    if (!NewConditionViewModel.CurativeItems[i].PreviouslyAdded) {
                        NewConditionViewModel.CurativeItems.splice(i, 1);
                    }
                }

                angular.forEach($scope.ConditionsMainViewModel.ConditionsSub.ForList, function (assigned) {

                    angular.forEach(items, function (item) {
                        if (item.PreviouslyAdded)
                            return true;

                        if (item.For.Value == assigned.Value) {
                            item.PreviouslyAdded = true;
                            // check if owner name is different from original condition
                            if (assigned.SectionName != NewConditionViewModel.OwnerNames) {
                                var alreadyExists = false;
                                // check if condition with same properties already exists
                                angular.forEach($scope.ConditionsMainViewModel.ConditionsSub.Conditions, function (existingCondition) {
                                    if (!existingCondition.IsRemoved && existingCondition.OwnerNames == assigned.SectionName && existingCondition.ConfigurationCode.Code == NewConditionViewModel.ConfigurationCode.Code && existingCondition.AssignedTo.RoleId == NewConditionViewModel.AssignedTo.RoleId
                                        && existingCondition.Due.Code == NewConditionViewModel.Due.Code && existingCondition.SignOff.RoleId == NewConditionViewModel.SignOff.RoleId) {
                                        alreadyExists = true;
                                        existingCondition.CurativeItems.push(item);
                                    }
                                });
                                if (alreadyExists == false) {
                                    newCondition.OwnerNames = assigned.SectionName;
                                    newCondition.CurativeItems.push(item);
                                }
                            }
                            else {
                                NewConditionViewModel.CurativeItems.push(item);
                            }
                        }
                    });
                    if (newCondition.CurativeItems.length > 0) {
                        newCondition.CategoryDescription = $scope.SetConditionSorting(newCondition.CategoryDescription.substr(1, newCondition.CategoryDescription.length), newCondition.OwnerNames != '')
                        $scope.ConditionsMainViewModel.ConditionsSub.Conditions.push(angular.copy(newCondition));
                        newCondition.CurativeItems = [];
                    }
                });

                $scope.groupedConditions = _.groupByMulti($scope.ConditionsMainViewModel.ConditionsSub.Conditions, ['OwnerNames', 'CategoryDescription']);

                // Update doc vault unassigned document list
                $scope.UpdateUnassignedDocList();
            });
        };

        $scope.AddNewConditionToList = function (NewConditionViewModel) {
            // add category values to condition
            angular.forEach($scope.ConditionsMainViewModel.ConditionsSub.CategoryList, function (category) {
                if (category.EnumerationValueId == NewConditionViewModel.ConfigurationCode.CategoryCdId) {
                    NewConditionViewModel.CategoryDescription = category.Description;
                    NewConditionViewModel.CategorId = category.EnumerationValueId;
                }
            });
            var childConditions = [];
            // display condition under right section
            angular.forEach($scope.ConditionsMainViewModel.ConditionsSub.ForList, function (assigned) {
                var newCondition = angular.copy(NewConditionViewModel);
                newCondition.CurativeItems = [];
                newCondition.OwnerNames = assigned.SectionName;
                angular.forEach(NewConditionViewModel.CurativeItems, function (item) {
                    if (item.For.Value == assigned.Value) {
                        item.PreviouslyAdded = true;
                        newCondition.CurativeItems.push(item);
                    }
                });
                if (newCondition.CurativeItems.length > 0) {
                    var conditionAlreadyExists = false;
                    // if child condition is already added, add new items to existing condition
                    angular.forEach(childConditions, function (condition) {
                        if (condition.OwnerNames == newCondition.OwnerNames) {
                            angular.forEach(newCondition.CurativeItems, function (item) {
                                condition.CurativeItems.push(item);
                            });

                            conditionAlreadyExists = true;
                            return false;
                        }
                    });
                    if (conditionAlreadyExists == false) {
                        newCondition.CategoryDescription = $scope.SetConditionSorting(newCondition.CategoryDescription, newCondition.OwnerNames != '')
                        childConditions.push(newCondition);
                    }
                }

            });
            // add new conditions to scope
            angular.forEach(childConditions, function (condition) {
                $scope.ConditionsMainViewModel.ConditionsSub.Conditions.push(condition);
            });
            $scope.groupedConditions = _.groupByMulti($scope.ConditionsMainViewModel.ConditionsSub.Conditions, ['OwnerNames', 'CategoryDescription']);

            // Update doc vault unassigned document list
            $scope.UpdateUnassignedDocList();
        };

        $scope.UpdateUnassignedDocList = function () {
            var listOfAssignedDocuments = [];
            angular.forEach($scope.ConditionsMainViewModel.ConditionsSub.Conditions, function (condition) {
                if (condition.IsRemoved)
                    return;

                angular.forEach(condition.CurativeItems, function (curativeItem) {
                    if (!curativeItem.IsRemoved && curativeItem.Document != null && curativeItem.Document.RepositoryId != null && curativeItem.Document.RepositoryId != "")
                        listOfAssignedDocuments.push(curativeItem.Document.RepositoryId);
                });
            });

            angular.forEach($scope.ConditionsMainViewModel.ConditionsDocuments, function (document) {
                if (document.Category.toLowerCase() == 'unclassified' || document.Category.toLowerCase() == 'rejected')
                    return;

                if (listOfAssignedDocuments.indexOf(document.RepositoryId) >= 0) {
                    document.Category = document.OriginalCategory;
                    document.CategorySortName = document.OriginalCategory;
                }
                else {
                    document.Category = 'UNASSIGNED';
                    document.CategorySortName = '02UNASSIGNED';
                }
            });

            $scope.groupedDocuments = _.groupBy($scope.ConditionsMainViewModel.ConditionsDocuments, 'CategorySortName');

            $scope.InitializeDeliveryVault();
        };

        $scope.conditionRemoved = function (condition) {
            condition.IsRemoved = true;

            // Update doc vault unassigned document list
            $scope.UpdateUnassignedDocList();
        };

        $scope.curativeItemRemoved = function (item, condition) {
            item.IsRemoved = true;
            var removeCondition = true;
            angular.forEach(condition.CurativeItems, function (item) {
                if (!item.IsRemoved) {
                    removeCondition = false;
                }
            })
            if (removeCondition) {
                condition.IsRemoved = true;
            }
            // Update doc vault unassigned document list
            $scope.UpdateUnassignedDocList();
        };

        $scope.openCommentHistoryPopUp = function (condition) {
            $.getJSON('Conditions/GetConditionHistoryItems?conditionId=' + condition.ConditionId, function (data) {
                $modal.open({
                    templateUrl: 'angular/stipsandconditions2.0/conditioncommenthistory.html',
                    controller: ConditionCommentHistoryCtrl,
                    backdrop: 'static',
                    resolve: {
                        Code: function () {
                            return condition.ConfigurationCode.Code;
                        },
                        ConditionCommentHistoryViewModel: function () {
                            return data;
                        },
                        Description: function () {
                            return condition.ConfigurationCode.Title;
                        }
                    }
                });
            });
        };

        $scope.openItemHistoryPopUp = function (item) {
            $.getJSON('Conditions/GetItemHistory?itemId=' + item.CurativeItemId, function (data) {
                $modal.open({
                    templateUrl: 'angular/stipsandconditions2.0/itemhistory.html',
                    controller: ItemHistoryCtrl,
                    backdrop: 'static',
                    resolve: {
                        ItemHistoryViewModel: function () {
                            return data;
                        },
                        Description: function () {
                            return item.Item.Code + ' ' + (item.Description == null ? '' : item.Description);
                        }
                    }
                });
            });
        };

        $scope.openDecisionHistoryPopup = function (loanId) {
            $.getJSON('Conditions/GetDecisionStatusHistory?loanid=' + loanId, function (data) {
                $modal.open({
                    templateUrl: 'angular/stipsandconditions2.0/decisionhistory.html',
                    controller: DecisionHistoryCtrl,
                    backdrop: 'static',
                    resolve: {
                        DecisionHistoryViewModel: function () {
                            return data;
                        }
                    }
                });
            });
        };

        $scope.openAddItemNotePopUp = function (notes, description, currentUser, isConditionSignedOff) {
            var itemNotes = $modal.open({
                templateUrl: 'angular/stipsandconditions2.0/additemnote.html',
                controller: ConditionItemNotesCtrl,
                backdrop: 'static',
                resolve: {
                    CurativeItemNotesViewModel: function () {
                        return {
                            Notes: [],
                            CurrentNotes: notes,
                            Description: description,
                            CurrentUser: currentUser,
                            SignedOff: isConditionSignedOff
                        };
                    }
                }
            });

            itemNotes.result.then(function (CurativeItemNotesViewModel) {
                angular.copy(CurativeItemNotesViewModel.Notes, notes);
            });
        };

        $scope.openErrorPopup = function (message) {

            var modalInstance = $modal.open({
                templateUrl: 'angular/stipsandconditions2.0/errorpopup.html',
                controller: ErrorPopupCtrl,
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    message: function () {
                        return message;
                    }
                }
            });
        };

        $scope.openDocumentClassificationPopup = function (document) {
            var modalInstance = $modal.open({
                templateUrl: 'angular/stipsandconditions2.0/documentClassificationPopup.html',
                controller: DocumentClassificationCtrl,
                size: 'sm',
                backdrop: 'static',
                resolve: {
                    Document: function () { return document; },
                    DocumentTypes: function () { return $scope.ConditionsMainViewModel.ConditionsSub.ItemsList; },
                    BorrowerNames: function () {
                        var result = [];
                        $scope.ConditionsMainViewModel.ConditionsSub.ForList.forEach(function (item) {
                            if (item.Section == "Borrowers") {
                                result.push(item.Value);
                            }
                        });

                        return result;
                    }
                }
            });
        };

        $scope.InitializeDeliveryVault = function () {
            var deliveryVaultExcludedCategories = ['UNCLASSIFIED', 'UNASSIGNED', 'REJECTED'];
            var groupedByCategory = _.groupBy($scope.ConditionsMainViewModel.ConditionsDocuments, 'Category');
            $scope.deliveryVaultDocuments = _.omit(groupedByCategory, deliveryVaultExcludedCategories);

            $scope.documentDownloadLink = function (repositoryId) {
                if (repositoryId == null || repositoryId == '') {
                    return '';
                }

                var encodedRepositoryId = encodeURIComponent(repositoryId);
                var url = '/Downloader.axd?documentType=repositoryItem&repositoryItemId=' + encodedRepositoryId;
                return url;
            };

            // Sort categories based on stacking order
            var sortingOrder = $scope.ConditionsMainViewModel.DeliveryVault.DeliveryVaultStackingOrder.StackingOrder;
            // Add any missing categories to sorting order list
            var allDocCategories = Object.keys($scope.deliveryVaultDocuments);
            allDocCategories = _.sortBy(allDocCategories, function (item) { return item; });
            allDocCategories.forEach(function (key) {
                if (sortingOrder.indexOf(key) == -1) {
                    sortingOrder.push(key);
                    $scope.ConditionsMainViewModel.DeliveryVault.StackingOrderChanged = true;
                }
            });

            var newlist = new Object();
            var i = 0;

            if (sortingOrder) {
                sortingOrder.forEach(function (key) {
                    if ($scope.deliveryVaultDocuments[key] == null || $scope.deliveryVaultDocuments[key] == undefined)
                        return;

                    var prefix = "";
                    if (i < 10)
                        prefix = "0" + i;
                    else
                        prefix = i.toString();

                    var newKey = prefix + "-" + key;
                    newlist[newKey] = $scope.deliveryVaultDocuments[key];
                    newlist[newKey] = _.sortBy(newlist[newKey], 'SortOrder');
                    newlist[newKey].SortOrder = i;
                    newlist[newKey].CategoryName = key;
                    i++;
                });
            }

            $scope.deliveryVaultDocuments = newlist;
        };

        $scope.syncOrder = function (elemPositions) {
            $scope.ConditionsMainViewModel.DeliveryVault.StackingOrderChanged = true;
            elemPositions.forEach(function (elemId, index) {
                if (elemId.indexOf("divDeliveryVaultCategorySortable") != -1) {
                    var id = elemId.replace(/divDeliveryVaultCategorySortable/, '');
                    var obj = $scope.deliveryVaultDocuments[id];
                    if (obj != undefined)
                        obj.SortOrder = index;
                }
                else {
                    var id = elemId.replace(/divDeliveryVaultDocumentsSortable/, '');
                    $scope.ConditionsMainViewModel.ConditionsDocuments.forEach(function (obj) {
                        if (id === obj.DocumentId)
                            obj.SortOrder = index;
                    });
                }
            });
        };

        $scope.conditions_save = function () {
            ShowProcessingInfo();
            $.ajax({
                url: 'Conditions/Save',
                data: JSON.stringify($scope.ConditionsMainViewModel),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    if (result.success == false) {
                        HideProcessingInfo();
                        $scope.openErrorPopup("An error occurred while saving data. Please try again.");
                        return;
                    }
                    $scope.getData(result, false);
                    HideProcessingInfo();
                    if (result.Error == true)
                        $scope.openErrorPopup("An error occurred while saving data. Please try again.");
                },
                error: function (e) {
                    HideProcessingInfo();
                    $scope.openErrorPopup("An error occurred while saving data. Please try again.");
                }
            });
        };

        $scope.conditions_cancel = function () {
            ShowProcessingInfo();
            $scope.refresh($scope.ConditionsMainViewModel.LoanId, true);
        };

        $scope.deliveryVault_SaveStackingOrder = function () {
            ShowProcessingInfo();
            var keys = Object.keys($scope.deliveryVaultDocuments);
            var sortingOrder = [];
            var sortingOrderDocument = [];
            keys.forEach(function (key) {
                var currentCategory = $scope.deliveryVaultDocuments[key];
                sortingOrder[currentCategory.SortOrder] = currentCategory.CategoryName;
                var categoryKey = currentCategory.CategoryName;
                currentCategory = _.sortBy(currentCategory, 'SortOrder');

                var docStackOrder = { CategoryName: categoryKey, StackingOrder: [] };
                currentCategory.forEach(function (doc) {
                    docStackOrder.StackingOrder.push(doc.DocumentId.toString());
                });

                sortingOrderDocument.push(docStackOrder);
            });

            $scope.ConditionsMainViewModel.DeliveryVault.DeliveryVaultStackingOrder.StackingOrder = sortingOrder;
            $scope.ConditionsMainViewModel.DeliveryVault.DeliveryVaultStackingOrder.DeliveryVaultDocumentsStackingOrder = sortingOrderDocument;

            $http({
                method: "post",
                url: "Conditions/DeliveryVault_SaveStackingOrder",
                data: $scope.ConditionsMainViewModel.DeliveryVault.DeliveryVaultStackingOrder
            }).
            success(function (data) {
                if (data.success == false) {
                    HideProcessingInfo();
                    $scope.openErrorPopup("An error occurred while saving stacking order. Please try again.");
                    return;
                }
                $scope.ConditionsMainViewModel.DeliveryVault.StackingOrderChanged = false;
                HideProcessingInfo();
            }).
            error(function () { HideProcessingInfo(); $scope.openErrorPopup("An error occurred while saving stacking order. Please try again."); });
        };


        $scope.showSignOffPopUp = function (condition, conditionItem, previousItem) {
            var signOffPopUp = $modal.open({
                templateUrl: 'angular/stipsandconditions2.0/signOffConditionPopUp.html',
                controller: SignOffPopUpCtrl,
                backdrop: 'static',
                resolve: {
                    Code: function () {
                        return condition != null && condition.ConfigurationCode != null && condition.ConfigurationCode.Code != null
                            ? condition.ConfigurationCode.Code : null;
                    },
                    Condition: function () {
                        return condition;
                    },
                    ConditionItem: function () {
                        return conditionItem;
                    },
                    PreviousItem: function () {
                        return previousItem;
                    },
                    ConditionsMainViewModelParam: function () {
                        return $scope.ConditionsMainViewModel;
                    }
                }
            });

            signOffPopUp.result.then(
            function (signedOffcondition) {
                condition = signedOffcondition;
            });
        };

        $scope.disableStatusesForRoles = function (condition, item) {
            var shouldBreak = false;

            if (item.Status.Code == 'Cleared' || item.Status.Code == 'Waived')
                angular.forEach($scope.ConditionsMainViewModel.CurrentUserRoles, function (role) {
                    if (!shouldBreak) {
                        if (role.RoleId == condition.AssignedTo.RoleId) {
                            var resolve = {
                                curativeItem: function () {
                                    return item;
                                },
                                previousItem: function () {
                                    return $scope.previous.item;
                                },
                                condition: function () {
                                    return condition;
                                },
                            };

                            var popup = $scope.showPopup(disableStatusController, 'angular/stipsandconditions2.0/errorpopup.html', resolve);

                            popup.result.then(
                                    function (revertedCondition) {
                                        condition = revertedCondition;
                                    });

                            shouldBreak = true;
                            return;
                        }
                    }
                });
            return shouldBreak;
        };

        $scope.showPopup = function (controller, templateUrl, resolve) {
            var popup = $modal.open({
                templateUrl: templateUrl,
                controller: controller,
                backdrop: 'static',
                resolve: resolve
            });

            return popup;
        };


        $scope.conditionItemStatusChanged = function (condition, conditionItem) {

            if (conditionItem == null) {
                return;
            }

            if ($scope.disableStatusesForRoles(condition, conditionItem))
                return;

            if ($scope.ConditionsMainViewModel != null && $scope.ConditionsMainViewModel.CurrentUser != null
            && $scope.ConditionsMainViewModel.CurrentUser.UserName != null) {
                conditionItem.UpdatedBy = $scope.ConditionsMainViewModel.CurrentUser;
            }
            else {
                //throw 'Cant retrieve current user info!';
            }
            conditionItem.UpdatedDate = new Date();

            // if user doesn't have privilege for Deleting/SigningOff then do not proceed
            if ($scope.ConditionsMainViewModel == null || $scope.ConditionsMainViewModel.Privileges == null ||
             $scope.ConditionsMainViewModel.Privileges.Delete == null || $scope.ConditionsMainViewModel.Privileges.Delete == false) {
                return;
            }

            var curativeItems = condition != null && condition.CurativeItems != null ? condition.CurativeItems : null;

            if (curativeItems == null || curativeItems.length == 0) {
                return;
            }

            for (var i = 0; i < curativeItems.length; i++) {
                if (curativeItems[i] == null || curativeItems[i].Status == null || curativeItems[i].Status.Code == null ||
                      (curativeItems[i].Status.Code != "Waived" && curativeItems[i].Status.Code != "Cleared")) {
                    return;
                }
            }

            $scope.showSignOffPopUp(condition, conditionItem, $scope.previous.item);
        };

        $scope.expandCategoriesAndItems = function (groupedConditions) {

            if (groupedConditions != null) {

                angular.forEach(groupedConditions, function (categoryGroups, key) {
                    angular.forEach(categoryGroups, function (category) {
                        var isVisible = $filter('getByProperty')('CurativeItemsVisible', true, category) != null;

                        if (isVisible && category != null) {
                            category.DetailsVisible = true;
                            angular.forEach(category, function (value, key) {
                                if (category[key].Status.Code == "PastDue") {
                                    category[key].CurativeItemsVisible = true;
                                }
                            });

                        }
                    });

                });
            }

        },
        $scope.CategoryGroupsExpand = function (categoryGroups) {

            var isVisible = false;
            if (categoryGroups != null) {
                angular.forEach(categoryGroups, function (value, key) {

                    if (categoryGroups[key].CurativeItems != null && categoryGroups[key].CurativeItems[0].Status != null && categoryGroups[key].CurativeItems[0].Status.Code == "PastDue") {
                        isVisible = true;
                        categoryGroups[key].CurativeItemsVisible = true;
                    }
                    else {
                        categoryGroups[key].CurativeItemsVisible = false;
                    }

                });

                if (!isVisible) {
                    categoryGroups.DetailsVisible = !categoryGroups.DetailsVisible;
                }
                else {
                    categoryGroups.DetailsVisible = true;
                }
            }
        },
        $scope.ConditionExpand = function (condition) {
            var isVisible = condition.CurativeItems != null && condition.CurativeItems[0].Status != null && condition.CurativeItems[0].Status.Code === "PastDue";
            if (isVisible === true) {
                condition.CurativeItemsVisible = true;
            }
            else {
                condition.CurativeItemsVisible = !condition.CurativeItemsVisible
            }
        }
    });


    // ****** controllers ****** //

    var NewConditionCtrl = function ($scope, $modalInstance, ConditionsSub, NewCondition) {
        $scope.NewConditionViewModel = angular.copy(NewCondition);
        $scope.AssignedToList = ConditionsSub.AssignedToList;
        $scope.SignedOffList = ConditionsSub.SignedOffList;
        $scope.CodesList = ConditionsSub.CodesList;
        $scope.DueList = ConditionsSub.DueList;
        $scope.CategoryList = ConditionsSub.CategoryList;

        $scope.conditions_addnewcondition_addItem = function () {
            $modalInstance.close($scope.NewConditionViewModel);
        };

        $scope.conditions_addnewcondition_cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.configurationcodechanged = function (code) {
            $scope.NewConditionViewModel.ConfigurationCode = code;
            angular.forEach($scope.AssignedToList, function (assignedTo) {
                if (assignedTo.RoleId == code.CurativeRoleCdId) {
                    $scope.NewConditionViewModel.AssignedTo = assignedTo;
                    return false;
                }
            });
            angular.forEach($scope.DueList, function (due) {
                if (due.EnumerationValueId == code.GateCdId) {
                    $scope.NewConditionViewModel.Due = due;
                    return false;
                }
            });

            $scope.NewConditionViewModel.InternalOnly = code.ExternallyVisible;
        };

    };

    var NewConditionItemCtrl = function ($scope, $modalInstance, NewConditionViewModel, ConditionsSub, DocumentsList) {
        $scope.NewConditionViewModel = NewConditionViewModel;
        $scope.ItemsList = ConditionsSub.ItemsList;
        $scope.ForList = ConditionsSub.ForList;
        $scope.DocumentList = DocumentsList;
        $scope.Status = ConditionsSub.NewCondition.CurativeItems[0].Status;
        $scope.UpdatedBy = ConditionsSub.NewCondition.CurativeItems[0].UpdatedBy;
        $scope.UpdatedDate = new Date();
        $scope.search = [];
        $scope.docTypeFilter = function (item) {
            var show = false;
            angular.forEach($scope.NewConditionViewModel.ConfigurationCode.ItemConfigurations, function (itemConfiguration) {
                if (itemConfiguration.DocTypeId == item.EnumerationValueId) {
                    show = true;
                }
            });
            return show;
        };
        var selectedCategory = $scope.NewConditionViewModel.ConfigurationCode.CategoryCdId;
        $scope.IsPropertyCondition = false;
        angular.forEach(ConditionsSub.PropertyConditionList, function (propertyItem) {
            if (propertyItem == selectedCategory) {
                $scope.IsPropertyCondition = true;
            }
        });
        $scope.filterForMenu = function (item) {

            if (($scope.IsPropertyCondition && item.Section == "Property") || (!$scope.IsPropertyCondition && item.Section != "Property"))
                return true;
            else return false;
        }

        $scope.conditions_addnewconditionitem_save = function () {
            $modalInstance.close($scope.NewConditionViewModel);
        };

        $scope.conditions_addnewconditionitem_cancel = function () {
            // remove added items for existing condition
            angular.forEach(NewConditionViewModel.CurativeItems, function (item) {
                if (item.PreviouslyAdded) {
                    return true;
                }
                else {
                    item.IsRemoved = true;
                }
            });
            $modalInstance.dismiss('cancel');
        };

        $scope.conditions_addnewconditionitem_addNewItem = function () {
            $scope.NewConditionViewModel.CurativeItems.push({ Description: null, Document: null, For: null, Item: null, Status: $scope.Status, UpdatedBy: $scope.UpdatedBy, UpdatedDate: new Date() });
        };
    };

    var ConditionCommentHistoryCtrl = function ($scope, $modalInstance, ConditionCommentHistoryViewModel, Description, Code) {

        $scope.ConditionCommentHistoryViewModel = ConditionCommentHistoryViewModel;
        $scope.Code = Code;
        $scope.Description = Description;
        $scope.ok = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    var ErrorPopupCtrl = function ($scope, $modalInstance, message) {

        $scope.message = message;
        $scope.header = "Error";
        $scope.ok = function () {
            $modalInstance.dismiss('cancel');
        };
    };
    var ItemHistoryCtrl = function ($scope, $modalInstance, ItemHistoryViewModel, Description) {

        $scope.ItemHistoryViewModel = ItemHistoryViewModel;
        $scope.Description = Description;
        $scope.ok = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    var SignOffPopUpCtrl = function ($scope, $modal, $modalInstance, Code, Condition, ConditionItem, PreviousItem, ConditionsMainViewModelParam) {

        $scope.Code = Code;

        $scope.conditions_signoffpopup_cancel = function () {
            ConditionItem.Status = PreviousItem.Status;
            ConditionItem.UpdatedDate = PreviousItem.UpdatedDate;
            ConditionItem.UpdatedBy = PreviousItem.UpdatedBy;
            $modalInstance.close(Condition);
        };

        $scope.conditions_signoffpopup_addNewItem = function () {
            var newConditionViewModel = angular.copy(ConditionsMainViewModelParam.ConditionsSub.NewCondition);
            var newConditionItem = $modal.open({
                templateUrl: 'angular/stipsandconditions2.0/addnewconditionitem.html',
                controller: NewConditionItemCtrl,
                backdrop: 'static',
                resolve: {
                    NewConditionViewModel: function () {
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

        $scope.conditions_signoffpopup_signOff = function () {
            Condition.IsSignedOff = true;
            Condition.SignOffDate = new Date();
            Condition.UserSignedOff = ConditionItem.UpdatedBy;
            $modalInstance.close(Condition);
        };
    };

    var disableStatusController = function ($scope, $modalInstance, condition, curativeItem, previousItem) {
        $scope.message = "You do not have the permission to set this status.";
        $scope.header = "Permission";

        $scope.ok = function () {
            curativeItem.Status = previousItem.Status;
            curativeItem.UpdatedDate = previousItem.UpdatedDate;
            curativeItem.UpdatedBy = previousItem.UpdatedBy;
            $modalInstance.close(condition);
        };
    };

    var ConditionItemNotesCtrl = function ($scope, $modalInstance, CurativeItemNotesViewModel) {

        $scope.CurativeItemNotesViewModel = CurativeItemNotesViewModel;

        angular.copy($scope.CurativeItemNotesViewModel.CurrentNotes, $scope.CurativeItemNotesViewModel.Notes);

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.save = function () {
            $modalInstance.close($scope.CurativeItemNotesViewModel);
        };

        $scope.addNote = function () {
            $scope.CurativeItemNotesViewModel.Notes.push({ Content: $scope.CurativeItemNotesViewModel.Content, UserAccountCreatedId: $scope.CurativeItemNotesViewModel.CurrentUser.UserAccountId, UserAccountCreatedUserName: $scope.CurativeItemNotesViewModel.CurrentUser.UserName, DateCreated: new Date(), AddNoteToFile: false, MarkAsUnread: true });
            $scope.CurativeItemNotesViewModel.Content = '';
        };

    };

    var DecisionHistoryCtrl = function ($scope, $modalInstance, DecisionHistoryViewModel) {


        $scope.model = DecisionHistoryViewModel;


        $scope.ok = function () {
            $modalInstance.dismiss('cancel');
        };

    };

    var BrowseDocVaultCtrl = function ($scope, $modalInstance, Item, Documents) {

        $scope.documents = Documents;

        $scope.model = {
            selectedDocument: $scope.documents[0]
        };

        $scope.save = function () {
            Item.Document = $scope.model.selectedDocument;
            Item.RepositoryId = $scope.model.selectedDocument.RepositoryId;

            $modalInstance.dismiss('save');
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    };


    angular.module('stipsandconditionsOld').controller('ItemController', function ($scope, $modal) {

        $scope.pdfMenu = "pdfMenu";
        $scope.docVaultMenu = "docVaultMenu";

        $scope.filteredDocuments = $scope.ConditionsMainViewModel.ConditionsDocuments.filter(function (doc) {
            return doc.DocumentTypeId === $scope.$parent.$parent.condition.ConfigurationCode.ItemConfigurations[0].DocTypeId;
        });

        $scope.assignDocument = function (doc) {
            console.log(doc.Name);
        };


        // download document (right click pdf icon -> download copy OR double-click pdf icon)
        $scope.downloadDocument = function (event) {
            var downloadLink;
            if ($scope.$parent.item.Document.RepositoryId) {
                downloadLink = (function (repositoryId) {
                    if (repositoryId == null || repositoryId == '') {
                        return '';
                    }

                    var encodedRepositoryId = encodeURIComponent(repositoryId);
                    var url = '/Downloader.axd?documentType=repositoryItem&repositoryItemId=' + encodedRepositoryId;
                    return url;
                })($scope.$parent.item.Document.RepositoryId);
            }
            console.log("Download a copy on this link: " + downloadLink);
            window.open(downloadLink, '_blank', '');
        };

        // unassing document from item 
        $scope.unassignFromItem = function () {
            $scope.$parent.item.Document = null;
            $scope.$parent.item.RepositoryId = null;
        };

        // reject document
        $scope.rejectDocument = function (event) {
            // pending requirements
        };

        // delete from docVault
        $scope.deleteFromDocVault = function () {
            // pending requirements
        };

        $scope.browseDocVault = function () {
            $modal.open({
                templateUrl: 'angular/stipsandconditions2.0/browseDocVault.html',
                controller: BrowseDocVaultCtrl,
                resolve: {
                    Item: function () {
                        return $scope.$parent.item;
                    },
                    Documents: function () {
                        return $scope.filteredDocuments;
                    }
                }
            });
        };

        $scope.preserveCurrentState = function () {
            angular.copy($scope.item, $scope.previous.item);
        };

    });

    angular.module('stipsandconditionsOld').controller('DocVaultController', function ($scope) {
        $scope.documentclassificationMenu = "documentclassificationMenu";

        $scope.classifyDocument = function (document) {
            $scope.openDocumentClassificationPopup(document);
        };

        $scope.rejectDocument = function (document) {
            document.Rejected = true;
        };

        $scope.deleteFromDocVault = function () {
            console.log("Delete from DocVault");
        };

        $scope.downloadDocument = function (fileDownloadUrl) {
            window.open(fileDownloadUrl, "_blank");
        };
    });

    var DocumentClassificationCtrl = function ($scope, $http, $modal, $modalInstance, Document, DocumentTypes, BorrowerNames) {

        $scope.Document = Document;
        $scope.DocumentTypes = DocumentTypes;
        $scope.BorrowerNames = BorrowerNames;
        $scope.PreviousDocumentState = {};

        angular.copy($scope.Document, $scope.PreviousDocumentState);

        $scope.documentClassificationPopup_cancel = function () {
            angular.copy($scope.PreviousDocumentState, $scope.Document);
            $modalInstance.dismiss('cancel');
        };

        $scope.documentClassificationPopup_save = function () {
            $scope.Document.Processing = true;
            $http({
                method: "post",
                url: "Conditions/BuildVaultDocumentName",
                data: $scope.Document
            }).
            success(function (data) {
                if (data.success == false) {
                    $scope.openErrorPopup(data.message);
                    return;
                }
                $scope.Document.Name = data.documentName;
                $scope.Document.Processing = false;
                HideProcessingInfo();
            }).
            error(function () { $scope.openErrorPopup(data.message); $scope.Document.Processing = false; });
            $modalInstance.dismiss('cancel');
        };
    };
})();