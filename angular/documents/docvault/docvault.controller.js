/// <reference path="docvaultimportdocs.html" />
(function () {
    'use strict';
    angular.module('docVault')
        .controller('docVaultController', docVaultController);


    function docVaultController($log, $scope, $state, $modal, $controller, docVaultSvc, encompassSvc, NavigationSvc, enums, $interval, modalPopoverFactory, wrappedLoan, applicationData, simpleModalWindowFactory, $timeout, DocVaultService, $q, limitToFilter, commonModalWindowFactory, modalWindowType) {
        var vm = this;

        //extend controller
        
        vm.wrappedLoan = wrappedLoan;
        vm.applicationData = applicationData;
        vm.documentTypes = null;
        vm.classifyDocuments = classifyDocuments;
        vm.selectAll = selectAll;
        vm.unselectAll = unselectAll;
        vm.documentSelectedChanged = documentSelectedChanged;
        vm.showDocumentHistory = showDocumentHistory;
        vm.deleteDocument = deleteDocument;
        vm.save = save;
        vm.cancel = cancel;
        vm.toggleGrid = toggleGrid;
        vm.openUploadFiles = openUploadFiles;
        vm.browserSupported = browserSupported;
        vm.exportDocumentToEncompass = exportDocumentToEncompass;
        vm.openDocVaultMenu = openDocVaultMenu;
        vm.documentStatusChanged = documentStatusChanged;
        vm.downloadDocument = downloadDocument;
        vm.selectDisabled = selectDisabled;
        vm.formatCategoryName = formatCategoryName;
        NavigationSvc.contextualType = enums.ContextualTypes.DocVault;
        vm.changeDocVaultButtonOption = changeDocVaultButtonOption;
        vm.callDocVaultButtonOption = callDocVaultButtonOption;
        vm.openImportDocsFlyout = openImportDocsFlyout;

        vm.docVaultButtonOptions = [{ 'id': 0, 'text': 'Upload' }, { 'id': 1, 'text': 'Import from Loan' }];
        vm.docVaultButtonSelected = docVaultSvc.getDocVaultButtonSelected();

        var _searchCounter = 0;
        var _filterTextTimeout;

        if (applicationData.generalSettings)
            vm.enableExportDocumentToEncompass = _.find(applicationData.generalSettings, function (obj) { return obj.settingName == "Enable Export Document To Encompass" })

        vm.groupedDocuments = docVaultSvc.groupDocuments(vm.wrappedLoan.ref.documents.docVaultDocuments);

        function formatCategoryName(categoryName) {
           return  docVaultSvc.formatCategoryName(categoryName);
         }

        function save() {
            vm.savingDataInProgress = true;
            // SaveAndUpdateWrappedLoan does just this, save then updates the wrapped loan
            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function (wrappedLoan) {
                vm.savingDataInProgress = false;
                refresh();
            },
            function (error) {
                $log.error(error);
                simpleModalWindowFactory.trigger('ERROR_SAVE_MODAL');
                vm.savingDataInProgress = false;
            });
        }

        function addDocumentHistory(document, status) {
            document.documentHistory.push({ modifiedBy: applicationData.currentUser.firstName + ' ' + applicationData.currentUser.lastName, statusChange: status, modifiedDate: new Date().format("M/d/yyyy h:mm:ss tt") });
        }

        function exportDocumentToEncompass(document) {
            document.runningExportToEncompass = true;
            var counter = 1;
            var timeOut = 180;
            encompassSvc.encompassExportDocument(vm.wrappedLoan.ref.loanId, applicationData.currentUserId,
                document.repositoryId, document.uploadedFileId, document.documentCategory, document.category, document.name).then(
                function (result) {
                    var timer = $interval(function () {
                        encompassSvc.GetExportDocumentToEncompassRequestCompleted(result.data).then(
                            function (result) {
                                if (result.data == 2) {
                                    addDocumentHistory(document, "Exported");
                                    $interval.cancel(timer);
                                    document.exportDocumentToEncompassStatus = result.data
                                    document.runningExportToEncompass = false;
                                }
                                if (result.data == 3) {
                                    addDocumentHistory(document, "Export Failed");
                                    $interval.cancel(timer);
                                    document.exportDocumentToEncompassStatus = result.data
                                    document.runningExportToEncompass = false;
                                }
                                if (counter * 5 > timeOut) {
                                    $interval.cancel(timer);
                                    document.runningExportToEncompass = false;
                                    $log.error("GetExportDocumentToEncompassRequestCompleted:: Timeout occurred!");
                                }
                                counter++;
                            },
                            function (error) {
                                //handle error
                                addDocumentHistory(document, "Export Failed");
                                $interval.cancel(timer);
                                document.runningExportToEncompass = false;
                            });

                    }, 5000);
                },
            function (error) {
                $log.error('Failure exporting Document to Encompass', error);
                addDocumentHistory(document, "Export Failed");
            });
        }

        function documentStatusChanged(document, categoryName) {
            docVaultSvc.documentStatusChanged(vm.wrappedLoan, vm.groupedDocuments, document, categoryName);
        }

        function classifyDocuments() {
            for (var key in vm.groupedDocuments.ref) {
                for (var i = 0; i < vm.groupedDocuments.ref[key].length; i++) {
                    if (vm.groupedDocuments.ref[key][i].submitToEdgeMac && vm.groupedDocuments.ref[key][i].status != enums.uploadedFileStatus.inReview) {
                        var doc = lib.findFirst(vm.wrappedLoan.ref.documents.docVaultDocuments, function (x) { return x.repositoryId == vm.groupedDocuments.ref[key][i].repositoryId });
                        doc.submitToEdgeMac = true;
                        doc.status = enums.uploadedFileStatus.inReview;
                        doc.modified = true;
                    }
                }
            }

            save();
        }

        function selectDisabled(document) {
            return docVaultSvc.selectDisabled(document);
        }

        function downloadDocument(repositoryId) {
            docVaultSvc.downloadDocument(repositoryId);
        }

        function selectAll(category) {
            for (var i = 0; i < vm.groupedDocuments.ref[category].length; i++) {
                if (!docVaultSvc.selectDisabled(vm.groupedDocuments.ref[category][i]))
                    vm.groupedDocuments.ref[category][i].submitToEdgeMac = true;
            }

            if (vm.groupedDocuments.ref[category].some(function (e) { return e.submitToEdgeMac == true })) {
                vm.groupedDocuments.ref[category].classifyEnabled = true;
                vm.groupedDocuments.ref[category].selectedAll = true;
            }
        }

        function unselectAll(category) {
            for (var i = 0; i < vm.groupedDocuments.ref[category].length; i++) {
                vm.groupedDocuments.ref[category][i].submitToEdgeMac = false;
            }

            vm.groupedDocuments.ref[category].classifyEnabled = false;
            vm.groupedDocuments.ref[category].selectedAll = false;
        }

        function documentSelectedChanged(category) {
            docVaultSvc.documentSelectedChanged(category, vm.groupedDocuments);
        }

        function openDocVaultMenu(event, document) {
            docVaultSvc.openDocVaultMenu(event, vm.wrappedLoan, document, vm.groupedDocuments);
        }

        function showDocumentHistory($event, document) {
            var ctrl = {
                documentHistory: document.documentHistory,

            };
            var _docHistoryPopup = modalPopoverFactory.openModalPopover('angular/documents/docvault/docvaulthistory.html', ctrl, document.documentHistory, $event, {
                arrowRight: true, className: 'tooltip-arrow-right-dochistory', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.915/*0.8333*/
            });
            _docHistoryPopup.result.then(function (data) {
            });
        }


        function deleteDocument(document) {
            for (var i = 0; i < vm.wrappedLoan.ref.documents.docVaultDocuments.length; i++) {
                if (vm.wrappedLoan.ref.documents.docVaultDocuments[i] == document) {
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].removed = true;
                }
            }
        }

        function reloadLoan()  {
            cancel();
        }

        function cancel() {
            NavigationSvc.cancelChanges(wrappedLoan.ref.loanId);
        }

        function toggleGrid(isExpanded) {
            docVaultSvc.toggleGrid(isExpanded, vm.groupedDocuments.ref);
        }

        function openUploadFiles(event) {
                                                                                                                            //13 == VariousDocuments
            var docCategory = applicationData.documentCategories.find(function (documentCategory) { return documentCategory.documentClassId == 13 && documentCategory.name == 'Others' });

            var ctrl = {
                loanId: wrappedLoan.ref.loanId,
                borrowerId: wrappedLoan.ref.primary.getBorrower().borrowerId,
                userAccountId: applicationData.currentUser.userAccountId,
                documentCategoryId: docCategory.categoryId,
            }

            var menuPopup = modalPopoverFactory.openModalPopover('angular/common/uploadfiles/uploadfiles.html', ctrl, vm.wrappedLoan.ref.documents, event, { preventAutoClose: true });
            menuPopup.result.then(function (data) {
                menuPopup.close();
                save();
            });
        }

        function openImportDocsFlyout(context) {
            var self = this;
            commonModalWindowFactory.open({ type: modalWindowType.loader, message: "Opening documents for import..." });
            var modalInstance = $modal.open({
                templateUrl: 'angular/documents/docvault/importdocsflyout.html',
                windowClass: 'imp-modal flyout imp-modal-real-estate-information',
                controller: function (context, groupedDocuments, $modalInstance) {
                    commonModalWindowFactory.close();
                    this.loanNumber = context.loanNumber;
                    this.borrowerName = context.borrowerName;
                    this.borrowerId = context.borrowerId;
                    this.loanId = context.loanId;
                    this.groupedDocuments = groupedDocuments;
                    this.formatCategoryName = function (categoryName) {
                        return docVaultSvc.formatCategoryName(categoryName);
                    };
                    this.toggleGrid = function (shouldToggleFlag) {
                        return docVaultSvc.toggleGrid(shouldToggleFlag, groupedDocuments.ref);
                    };
                    this.selectAll = function (categoryName) {
                        toggleDocumentImport(true, groupedDocuments, self, categoryName);
                    };
                    this.unselectAll = function (categoryName) {
                        toggleDocumentImport(false, groupedDocuments, self, categoryName);
                    };
                    this.documentSelectedChanged = function(categoryName, document) {
                        if (document.shouldImport)
                            this.groupedDocuments.ref[categoryName].selectedAll = true;
                        else {
                            var toImportExist = this.groupedDocuments.ref[categoryName].some(function (doc) {
                                return doc.shouldImport == true;
                            });
                            
                            if (!toImportExist)
                            this.groupedDocuments.ref[categoryName].selectedAll = false;
                        }
                    }
                    this.downloadDocument = function (repositoryId) {
                        docVaultSvc.downloadDocument(repositoryId);
                    };
                    this.openDocVaultFlyoutMenu = function (event, document) {
                        docVaultSvc.openDocVaultFlyoutMenu(event, document);
                    };
                    this.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    this.importDocs = function () {
                        $modalInstance.dismiss('cancel');
                        commonModalWindowFactory.open({ type: modalWindowType.loader, message: "Importing Documents..." });
                        docVaultSvc.importDocs(groupedDocuments, vm.wrappedLoan.ref.loanId, vm.wrappedLoan.ref.primary.getBorrower().borrowerId, vm.applicationData.currentUserId)
                            .$promise.then(function (result) {
                                commonModalWindowFactory.close();
                                reloadLoan();
                            }, function (error) {
                                commonModalWindowFactory.open({ type: modalWindowType.error, message: "Erorr while importing documents!" });
                                commonModalWindowFactory.close();
                                $log.error('Error while importing documents!', error);
                            });
                    };
                    this.importDisabled = function () {
                        for (var key in groupedDocuments.ref) {
                            if (lib.findFirst(groupedDocuments.ref[key], function (item) { return item.shouldImport == true }))
                                return false;
                        }
                        return true;
                    }
                },
                controllerAs: 'importDocCtrl',
                resolve: {
                    context: function() {
                        return context;
                    },
                    groupedDocuments: function () {
                        
                        var documents = { docVaultDocuments: [] };
                        var promises = [];

                        angular.forEach(context.loanApplicationIds, function (loanApplicationId) {
                            promises.push(docVaultSvc.DocumentsServices.GetDocVaultData({ loanId: loanApplicationId, userAccountId: vm.applicationData.currentUserId }).$promise);
                        });

                        return $q.all(promises).then(function (data) {
                            angular.forEach(data, function (object) {
                                documents.docVaultDocuments = documents.docVaultDocuments.concat(object.docVaultDocuments);
                            });

                            return docVaultSvc.groupDocuments(documents.docVaultDocuments, true);
                        });
                    }
                }
            });
            
        }

        function toggleDocumentImport(flag, groupedDocuments, _this, categoryName) {
            groupedDocuments.ref[categoryName].forEach(function (document) {
                if (document.categoryId != 26) { // if document is not Credit report
                    document.shouldImport = flag;
                    document.importEnabled = flag;
                }
            });
            groupedDocuments.ref[categoryName].selectedAll = flag;
        }

        function browserSupported(contentType) {
            if (contentType == "pdf")
                return true;

            return false;
        }

        function refresh() {
            $state.go('loanCenter.loan.refresh', { page: 'loanCenter.loan.documents.docvault' });
        }

        function changeDocVaultButtonOption(optionId) {
            docVaultSvc.setDocVaultButtonSelected(optionId);
            vm.docVaultButtonSelected = optionId;
        }

        function callDocVaultButtonOption(optionId, event) {
            
            switch (optionId) {
                case 0: // call upload
                    openUploadFiles(event);
                    break;
                case 1: // call import
                    var ctrl = {
                        onLoanNumberFilterChanged: onLoanNumberFilterChanged,
                        onSelect: onSelect,
                        openImportDocsFlyout: openImportDocsFlyout
                    }

                    var importDocsPopup = modalPopoverFactory.openModalPopover('angular/documents/docvault/docvaultimportdocs.html', ctrl, vm.wrappedLoan.ref.documents, event);
                    break;
            }
        }

        function onLoanNumberFilterChanged(loanNumber) {
            if (loanNumber == null)
                return;

            var self = this;
            var deferred = $q.defer();

            if (_filterTextTimeout) {
                $timeout.cancel(_filterTextTimeout);
            }

            _filterTextTimeout = $timeout(function () {
                //_searchCounter = _searchCounter + 1;
                docVaultSvc.DocVaultServices.FilterByLoanNumber({ loanNumber: loanNumber, counter: _searchCounter, currentUserId: applicationData.currentUser.userAccountId })
                    .$promise.then(function (result) {
                        if (result != null && result.filterResults != null) {
                            deferred.resolve(limitToFilter(result.filterResults, 15));
                        }
                },
                function (error) {
                    $log.error('Error while filtering by loan number!', error);
                });
            }, 300); // delay 300 ms  

            return deferred.promise;
        }

        function onSelect($item, $model, $label, loanNumber) {
            loanNumber.$setValidity('parse', true);
            return $item;
        }
    };
})();