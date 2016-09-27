(function () {
    'use strict';
    angular.module('docVault')
        .controller('docVaultClassifyController', docVaultClassifyController);


    function docVaultClassifyController($log, $modalInstance, documentTypes, wrappedLoan, document, enums) {
        var vm = this;
        vm.documentTypes = documentTypes;
        vm.wrappedLoan = wrappedLoan;
        vm.document = document;
        vm.borrowerList = borrowerList();
        vm.borrowerJointList = borrowerJointList();
        vm.reoAddressList = reoAddressList();
        vm.documentTypeChange = documentTypeChange;
        vm.update = update;
        vm.cancel = cancel;
        vm.validateInput = validateInput;
        vm.isValid = isValid;
        vm.onBorrowerJointListChange = onBorrowerJointListChange;
        vm.selectedDocumentType = _.find(documentTypes, function (e) { return e.typeId == document.documentTypeId });

        vm.metadata = populateMetadata();

        vm.document.rejected = document.status == enums.uploadedFileStatus.rejected;

        function populateMetadata() {
            if (!vm.selectedDocumentType)
                return null;

            var meta = []
            angular.forEach(vm.selectedDocumentType.metadata, function (docTypeMetadata) {
                angular.forEach(document.metadata, function (documentMetadata) {
                    if (docTypeMetadata.name == documentMetadata.key) {
                        if (documentMetadata.value)
                            documentMetadata.visible = true;
                        documentMetadata.dependency = docTypeMetadata.dependency;
                        meta.push(documentMetadata);
                    }
                })
            })

            return meta;
        }

        function documentTypeChange() {
            vm.metadata = [];
            angular.forEach(vm.selectedDocumentType.metadata, function (docTypeMetadata) {
                if (docTypeMetadata.name == 'Co-Borrower Signed Date') {
                    if (_.some(vm.wrappedLoan.ref.getLoanApplications(), function (loanApp) { return loanApp.isSpouseOnTheLoan; }))
                        vm.metadata.push({ 'key': docTypeMetadata.name, 'value': '', 'dependency': docTypeMetadata.dependency, visible: 'true' });
                }
                else
                    vm.metadata.push({ 'key': docTypeMetadata.name, 'value': '', 'dependency': docTypeMetadata.dependency, visible: 'true' });
            })

        };

        function update() {

            if (vm.selectedDocumentType) {
                vm.validateForm = true;

                if (!vm.document.rejected && !isValid())
                    return;

                vm.document.classified = true;
                vm.document.modified = true;
                vm.document.category = vm.selectedDocumentType['class'];
                vm.document.categorySortName = vm.selectedDocumentType['class'];
                vm.document.documentTypeId = vm.selectedDocumentType.typeId;
                vm.document.description = vm.selectedDocumentType['description'];

                vm.document.metadata = vm.metadata;

                vm.document.name = vm.selectedDocumentType.description;
                angular.forEach(vm.selectedDocumentType.namingConvention.split(','), function (convention) {
                    angular.forEach(vm.metadata, function (meta) {
                        if (!meta.visible)
                            meta.value = '';
                        if (meta.value && meta.value != '' && convention.trim().toLowerCase() == meta.key.toLowerCase()) {
                            var value;
                            if (angular.isDate(meta.value)) {
                                value = meta.value.format('MM-dd-yyyy');
                                meta.value = meta.value.format('MM/dd/yyyy');
                            }
                            else {
                                if (typeof (meta.value) != "number") {
                                    value = meta.value.replace(/\//g, '-').replace(' ', '_');
                                }
                            }

                            vm.document.name = vm.document.name + '_' + value;
                        }
                    })
                })

                if (vm.document.description == "Intent to Proceed")
                    updateITPDates();
                vm.document.status = enums.uploadedFileStatus.received;

                vm.validateForm = false;
            }

            if (vm.document.rejected) {
                vm.document.status = enums.uploadedFileStatus.rejected;
                vm.document.categorySortName = "04Rejected";
                vm.document.rejectReasonEdit = true;
            }
            else {
                vm.document.categorySortName = documentSortName(document.category)
                vm.document.rejectReason = '';
            }

            $modalInstance.close(document);
        };

        function updateITPDates() {
            var selectedBorrowers = _.findWhere(vm.metadata, { key: "Borrower Name(s)" }).value;
            angular.forEach(selectedBorrowers.split(','), function (fullName) {
                angular.forEach(vm.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                    var borrower = loanApplication.getBorrower();
                    if (borrower.fullName == fullName.trim()) {
                        borrower.eApprovalConfirmation.isModified = true;
                        borrower.eApprovalConfirmation.timeStamp = _.findWhere(vm.metadata, { key: "Borrower Signed Date" }).value;
                    }
                        
                    var coBorrower = loanApplication.getCoBorrower();
                    if (coBorrower.fullName == fullName.trim()) {
                        coBorrower.eApprovalConfirmation.isModified = true;
                        coBorrower.eApprovalConfirmation.timeStamp = _.findWhere(vm.metadata, { key: "Co-Borrower Signed Date" }).value;
                    }
                       
                })
            })
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        };

        function borrowerList() {
            var borrowerList = [];
            angular.forEach(vm.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                borrowerList = borrowerList.concat(loanApplication.borrowerList())
            })

            return borrowerList;
        }

        function borrowerJointList() {
            var borrowerJointList = [];
            angular.forEach(vm.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                borrowerJointList = borrowerJointList.concat(loanApplication.borrowerJointList());
            })

            return borrowerJointList;
        }

        function reoAddressList() {
            var dropDownAddress = [];

            wrappedLoan.ref.active.getUniqueProperties(true).forEach(function(property) {
                if (property)
                    dropDownAddress.push(new cls.LookupItem(property.fullAddressString, property.propertyId));
            });

            return dropDownAddress;
        }

        function onBorrowerJointListChange() {
            var selectedValue = checkBorrowerJointListSelection(_.findWhere(vm.metadata, { key: "Borrower Name(s)" }).value);

            switch (selectedValue) {
                case "borrower":
                    if (_.findWhere(vm.metadata, { key: "Borrower Signed Date", dependency: "true" }))
                        _.findWhere(vm.metadata, { key: "Borrower Signed Date" }).visible = true;
                    if (_.findWhere(vm.metadata, { key: "Co-Borrower Signed Date", dependency: "true" }))
                        _.findWhere(vm.metadata, { key: "Co-Borrower Signed Date" }).visible = false;
                    break;
                case "coborrower":
                    if (_.findWhere(vm.metadata, { key: "Borrower Signed Date", dependency: "true" }))
                        _.findWhere(vm.metadata, { key: "Borrower Signed Date" }).visible = false;
                    if (_.findWhere(vm.metadata, { key: "Co-Borrower Signed Date", dependency: "true" }))
                        _.findWhere(vm.metadata, { key: "Co-Borrower Signed Date" }).visible = true;
                    break;
                case "borrowerAndCoborrower":
                    if (_.findWhere(vm.metadata, { key: "Borrower Signed Date", dependency: "true" }))
                        _.findWhere(vm.metadata, { key: "Borrower Signed Date" }).visible = true;
                    if (_.findWhere(vm.metadata, { key: "Co-Borrower Signed Date", dependency: "true" }))
                        _.findWhere(vm.metadata, { key: "Co-Borrower Signed Date" }).visible = true;
                    break;
            }
        }

        function checkBorrowerJointListSelection(fullName) {
            if (fullName) {
                var value = "borrowerAndCoborrower";
                angular.forEach(vm.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                    if (loanApplication.getBorrower()) {
                        if (loanApplication.getBorrower().fullName == fullName) {
                            value = "borrower";
                            return;
                        }
                    }

                    if (loanApplication.getCoBorrower()) {
                        if (loanApplication.getCoBorrower().fullName == fullName) {
                            value = "coborrower";
                            return
                        }
                    }
                })
                return value;
            }
        }

        function validateInput(value) {
            if (value && value != -1)
                return true;

            return false;
        }

        function selectDocumentType() {
            return
        }

        function documentSortName(category) {
            switch (category.toLowerCase()) {
                case "unclassified":
                    return "01" + category;
                case "unassigned":
                    return "02" + category;
                case "rejected":
                    return "04" + category;
                default:
                    return "03" + category;
            }
        }


        function isValid() {
            var valid = true;
            angular.forEach(vm.metadata, function (meta) {
                if (!validateInput(meta.value) && meta.visible)
                    valid = false;
            })

            return valid;
        }

    };
})();