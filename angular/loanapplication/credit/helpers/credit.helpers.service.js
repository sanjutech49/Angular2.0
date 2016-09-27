(function () {
    'use strict';

    angular.module('loanApplication').factory('CreditHelpers', CreditHelpers);

    CreditHelpers.$inject = ['CreditSvc', 'enums', 'BroadcastSvc']; // wrappedLoan

    // @todo - refactor this class out of existance
    function CreditHelpers(CreditSvc, enums, BroadcastSvc) {

        var cloneEmptyRow = cloneEmptyRow;

        var service = {
            //MoveLiabilityToREO: MoveLiabilityToREO,
            //moveREOToLiability: moveREOToLiability,
            collectionsCommentChanged: collectionsCommentChanged,
            PublicRecordCommentChanged: PublicRecordCommentChanged,
            liabilitiesCommentChanged: liabilitiesCommentChanged,
            //deleteLiabilitiesRow: deleteLiabilitiesRow,
            deleteRealEstateRow: deleteRealEstateRow,
            processJointLiabilityRecords: processJointLiabilityRecords,
            addEmptyRow: addEmptyRow,
            removeRow: removeRow,
            getRunCreditItems: getRunCreditItems,
            CoBorrowerExists: CoBorrowerExists,
            ProcessRulesForLiabilityOwnershipType: ProcessRulesForLiabilityOwnershipType,
            setInvalidValidationFlag: setInvalidValidationFlag,
            resetInvalidValidationFlag: resetInvalidValidationFlag,
            setTouchedValidationFlag: setTouchedValidationFlag,
            resetTouchedValidationFlag: resetTouchedValidationFlag,
            getCompanyInfoData: getCompanyInfoData, 
            companyHasChanges: companyHasChanges
        };

        return service;

        /*
        * Method definitions
        */

        function collectionsCommentChanged(collections, collection) {
            CreditSvc.ProcessRulesForCollectionComment.save(collection,
                function (data) {
                    angular.extend(collection, data);
                },
                function (err) {
                    console.log("Error: ", err);
                });
        }

        function PublicRecordCommentChanged(publicRecordViewModel) {
            CreditSvc.ProcessRulesForPublicRecordComment.save(publicRecordViewModel,
                function (data) {
                    angular.extend(publicRecordViewModel, data);
                },
                function (err) {
                    console.log("Error: ", err);
                });
        }

        function liabilitiesCommentChanged(vm, liability) {
            // Process exclude indicators for debt 

            CreditSvc.ProcessRulesForLiabilityComment.save(liability,
                function (data) {

                    angular.extend(liability, data);
                    //groupAndSortLiabilities(vm);

                    // Process joint liability records (copy the new value to the related joint record)
                    processJointLiabilityRecords(vm, liability.LiabilityInfoId);
                },
                function (err) {
                    console.log("Error: ", err);
                });
                    }

        function deleteRealEstateRow(wrappedLoan, clientId) {
            removeRow(wrappedLoan.ref.active.realEstate.pledgedAssets, clientId);
        }

        //function deleteLiabilitiesRow(vm, clientId) {
        //    var originalDebtId = "";
        //    // Remove original debt and persist original debt Id
        //    angular.forEach(vm.CreditTabViewModel.LiabilitiesViewModel.Liabilities, function (debt) {
        //        if (debt.ClientId === clientId) {
        //            originalDebtId = debt.LiabilityInfoId;
        //            debt.IsRemoved = true;
        //            return false;
        //        }
        //    });

        //    DeleteSecondaryLiabilitiesRow(vm, originalDebtId);

        //    groupAndSortLiabilities(vm);
        //}

        function DeleteSecondaryLiabilitiesRow(vm, originalDebtId) {
            if (originalDebtId != "00000000-0000-0000-0000-000000000000" && originalDebtId != null) {
                // Remove related secondary records based on OriginalLiabilityInfoId
                angular.forEach(vm.wrappedLoan.ref.active.groupedLiabilities, function (debt) {
                    if (debt.OriginalLiabilityInfoId === originalDebtId) {
                        debt.IsRemoved = true;
                        return false;
                    }
                });
            }
        }

        function processJointLiabilityRecords(liabilities, liabilityInfoId) {
            var originalLiability = {};
            var jointLiability = null;

            if (liabilityInfoId === "00000000-0000-0000-0000-000000000000")
                return;

            angular.forEach(liabilities, function (item) {
                if (item.liabilityInfoId === liabilityInfoId) {
                    originalLiability = item;
                }
                else if (item.originalLiabilityInfoId === liabilityInfoId) {
                    jointLiability = {};
                    jointLiability = item;
                }
            });

            if (jointLiability == null)
                return;

            if (originalLiability.companyData != null) {
                if (jointLiability.companyData == null)
                    jointLiability.companyData = {};

                jointLiability.companyData.companyName = originalLiability.companyData.companyName;
                jointLiability.debtType = originalLiability.debtType;
                jointLiability.accountNumber = originalLiability.accountNumber;
                jointLiability.monthsLeft = originalLiability.monthsLeft;
                jointLiability.unpaidBalance = originalLiability.unpaidBalance;
                jointLiability.minPayment = originalLiability.minPayment;
                jointLiability.debtComment = originalLiability.debtComment;
            }
        }

        // Adds empty item to specified view model (for grid)
        function addEmptyRow(viewModel) {
            viewModel.push(cloneEmptyRow(viewModel));
        }

        function cloneEmptyRow(viewModel) {
            for (var i = 0; i < viewModel.length; i++) {
                if (viewModel[i].isRemoved && viewModel[i].isUserEntry) {
                    var result = angular.copy(viewModel[i]);
                    result.isRemoved = false;

                    return result;
                }
            }
        }

        // Removes debt from specified view model (for grid)
        function removeRow(viewModel, index) {
            if (viewModel[index].isUserEntry) {
                viewModel.splice(index, 1);
                angular.forEach(viewModel, function (vm, idx) {
                    vm.clientId = idx;
                });
            }
            else {
                viewModel[index].isRemoved = true;
            }
        }

        function getRunCreditItems(borrower, coBorrower, isSpouseOnTheLoan) {
            var RunCreditButtonItems =
                [
                    { id: '0', name: 'Run New Credit Report', Action: 'run', What: 'Credit Report', borrowerId: borrower.borrowerId }

                ];
            if (isSpouseOnTheLoan && coBorrower)
                RunCreditButtonItems.push(
                {
                    id: '1', name: 'Remove ' + borrower.fullName,
                    Action: 'remove', What: 'Credit Report', For: borrower.fullName,
                    borrowerId: borrower.borrowerId
                },               
                {
                    id: '2', name: 'Remove ' + coBorrower.fullName,
                    Action: 'remove', What: 'Credit Report', For: coBorrower.fullName,
                    coborrowerId: coBorrower.borrowerId
                });

            return RunCreditButtonItems;
        }

        function CoBorrowerExists(vm) {
            return vm != null && vm.CreditTabViewModel != null && vm.CreditTabViewModel.getCoBorrower() != null
                && vm.CreditTabViewModel.CoborrowerExists != null && vm.CreditTabViewModel.CoborrowerExists === true;
        }

        function ProcessRulesForLiabilityOwnershipType(model, vm) {
            var hasChanges = model.companyData.hasChanges;
            CreditSvc.ProcessRulesForLiabilityOwnershipType.save(model,
               function (data) {
                   angular.extend(model, data[0]);
                   
                   model.companyData.hasChanges = hasChanges;


                   var originalBorrowerId = model.borrowerId;
                   

                   if (model.DebtsAccountOwnershipType == enums.DebtsAccountOwnershipType.CoBorrower || model.DebtsAccountOwnershipType == enums.DebtsAccountOwnershipType.CoBorrowerWithOther) {
                       model.borrowerId = vm.wrappedLoan.ref.active.getCoBorrower().borrowerId;
                       //vm.wrappedLoan.ref.active.getCoBorrower().addLiability(new cls.LiabilityViewModel(model));
                   }
                   else {
                       model.borrowerId = vm.wrappedLoan.ref.active.getBorrower().borrowerId;
                   }

                   // If record is not joint or borrower was switched, delete previous secondary records
                   if (model.DebtsAccountOwnershipType != enums.DebtsAccountOwnershipType.Joint || originalBorrowerId != model.borrowerId)
                       DeleteSecondaryLiabilitiesRow(vm, model.LiabilityInfoId);
                   
                   // If two records were returned, add Secondary debt for second Borrower
                   if (data.length == 2) {

                       var newDebtSecondaryBorrower = data[1];

                       // @todo - migrate this to within the CreditStateService
                       if (model.borrowerId = vm.wrappedLoan.ref.active.getBorrower().borrowerId) {
                           newDebtSecondaryBorrower.borrowerId = vm.wrappedLoan.ref.active.getCoBorrower().borrowerId;

                           var collection = new cls.LiabilityViewModel(vm.wrappedLoan.ref.getTransactionInfoRef(), newDebtSecondaryBorrower);
                           collection.fullName = vm.wrappedLoan.ref.active.getCoBorrower().fullName;

                           vm.CreditStateService.addCollection(collection, true);


                           //vm.wrappedLoan.ref.active.getCoBorrower().addLiability(new cls.LiabilityViewModel( newDebtSecondaryBorrower ));
                       }
                       else {
                           newDebtSecondaryBorrower.borrowerId = vm.wrappedLoan.ref.active.getBorrower().borrowerId;
                           var collection = new cls.LiabilityViewModel(vm.wrappedLoan.ref.getTransactionInfoRef(), newDebtSecondaryBorrower);
                           collection.fullName = vm.wrappedLoan.ref.active.getCoBorrower().fullName;

                           vm.CreditStateService.addCollection(collection, false);

                           //vm.wrappedLoan.ref.active.getBorrower().addLiability(new cls.LiabilityViewModel(newDebtSecondaryBorrower));
                       }

                      
                   }
                   //vm.wrappedLoan.ref.active.refreshLiabilityLists();

                   //vm.wrappedLoan.ref.active.groupedLiabilities = vm.wrappedLoan.ref.active.getGroupedLiabilities();

               },
               function (err) {
                   console.log("Error: ", err);
               });
        }

        function setInvalidValidationFlag(formElement) {
            formElement.$touched = true;
            formElement.$invalid = true;

            var element = angular.element(document.querySelector('[name=' + formElement.$name + ']'));
            if (element != null && element.length > 0) {
                element.removeClass("ng-pristine").removeClass("ng-untouched").removeClass("ng-valid-parse").removeClass("ng-valid").removeClass("ng-valid-required");
                element.addClass("ng-touched ng-invalid ng-invalid-required");
            }
        }

        function resetInvalidValidationFlag(formElement) {
            formElement.$touched = false;
            formElement.$invalid = false;

            var element = angular.element(document.querySelector('[name=' + formElement.$name + ']'));
            if (element != null && element.length > 0)
                element.removeClass('ng-touched').removeClass('ng-dirty').removeClass('ng-invalid ng-invalid-required');
        }

        function setTouchedValidationFlag(formElement) {
            formElement.$touched = true;

            var element = angular.element(document.querySelector('[name=' + formElement.$name + ']'));
            if (element != null && element.length > 0)
                element.addClass('ng-touched');
        }

        function resetTouchedValidationFlag(formElement) {
            formElement.$touched = false;

            var element = angular.element(document.querySelector('[name=' + formElement.$name + ']'));
            if (element != null && element.length > 0)
                element.removeClass('ng-touched').removeClass('ng-dirty');
        }

        function getCompanyInfoData(model, isPublicRecord, liabilityTypes, debtAccountOwnershipTypes, isLiabilities, isSecondaryPartyRecord, disableFields, states) {

            if (isPublicRecord && (!model.companyData.liabillityFor || model.companyData.liabillityFor == 'Individual' ||
                (model.companyData.liabillityFor == 'Joint' && liabilityTypes.length == 1))) {
                model.companyData.liabillityFor = liabilityTypes[0].value;
            }

            if (!model.debtsAccountOwnershipType && debtAccountOwnershipTypes) {
                model.debtsAccountOwnershipType = debtAccountOwnershipTypes[0].value;
            }

            var data = {
                title: 'Company Information',
                isLiabilities: isLiabilities,
                unpaidBalance: isPublicRecord ? model.originalAmount : model.originalUnpaidBalance,
                minPayment: isPublicRecord ? 0 : model.minPayment,              
                debtsAccountOwnershipType: model.DebtsAccountOwnershipType,
                debtAccountOwnershipTypes: debtAccountOwnershipTypes,
                disableFields: disableFields || isSecondaryPartyRecord,
                liabilityTypes: isPublicRecord  ? liabilityTypes : null,
                states: states
            }

            return data;
        }

        //if something has been changed in the popup then icon should become blue
        function companyHasChanges(initialModel, model, result) {
            return model.companyData.hasChanges || !angular.equals(model.companyData, initialModel) || !angular.equals(model.companyData.addressViewModel, model.companyData.addressViewModel) ||
            model.debtsAccountOwnershipType != result.debtsAccountOwnershipType;   
        }
    }
})();
