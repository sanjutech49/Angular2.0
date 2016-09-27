(function () {
    'use strict';

    angular.module('docVault').factory('docVaultSvc', docVaultSvc);

    docVaultSvc.$inject = ['$log', '$resource', 'apiRoot', 'modalPopoverFactory', '$modal', 'enums', '$q', '$controller'];

    function docVaultSvc($log, $resource, ApiRoot, modalPopoverFactory, $modal, enums, $q, $controller) {
        var docVaultApiPath = ApiRoot + 'DocVault/';
        var docVaultServiceApiPath = ApiRoot + 'DocVaultService/';

        var docVaultButtonSelected = 0;

        var vm = this;
        var documentCtrl = angular.extend(this, $controller('DocumentCtrl', { $scope: vm }));

        function setDocVaultButtonSelected(value) {
            docVaultButtonSelected = value;
        }

        function getDocVaultButtonSelected() {
            return docVaultButtonSelected;
        }

        function openDocVaultMenu(event, wrappedLoan, document, groupedDocuments) {
            vm.wrappedLoan = wrappedLoan;
            vm.groupedDocuments = groupedDocuments;

            var menuPopup = modalPopoverFactory.openModalPopover('angular/documents/docvault/docvaultmenu.html', this, document, event);
        }

        function openDocVaultFlyoutMenu(event, document) {
            return modalPopoverFactory.openModalPopover('angular/documents/docvault/docvaultflyoutmenu.html', this, document, event);
        }

        function groupDocuments(documents, isFlyout) {

            var extDocuments = [];

            if (documents != null) {
                for (var i = 0; i < documents.length; i++)
                    extDocuments.push(new cls.DocVaultDocumentViewModel(documents[i]));
            }

            var groupedDocuments = new lib.referenceWrapper(_.groupBy(_.where(extDocuments, { deleted: false }), 'categorySortName'));

            if (_.size(groupedDocuments.ref) && !isFlyout) {
                groupedDocuments.ref[Object.keys(groupedDocuments.ref).sort()[0]].isExpanded = true;
            }

            if ("01Unclassified" in groupedDocuments.ref) {
                groupedDocuments.ref["01Unclassified"].isUnclassified = true;
            }

            return groupedDocuments;
        }

        function showDocuments(docVaultDocuments) {
            vm.groupedDocuments.ref = _.groupBy(_.where(docVaultDocuments, { deleted: false }), 'categorySortName');

            if (_.size(vm.groupedDocuments.ref)) {
                vm.groupedDocuments.ref[Object.keys(vm.groupedDocuments.ref).sort()[0]].isExpanded = true;
            }
            else {
            }

            if ("01Unclassified" in vm.groupedDocuments.ref) {
                vm.groupedDocuments.ref["01Unclassified"].isUnclassified = true;
            }

            return vm.groupedDocuments;
        }

        function classifyDocument(event, document) {
            showDocumentClassificationPopup(document, event).then(function (data) {
                showDocuments(vm.wrappedLoan.ref.documents.docVaultDocuments);
            }, function (error) {
                
            });
        }

        function showDocumentClassificationPopup(document, event) {
            var documentTypes;
            var q = $q.defer();

            DocumentsServices.GetDocTypeFields().$promise.then(
                function (data) {
                    documentTypes = data.documentTypes;

                    var classifyPopup = $modal.open({
                        templateUrl: 'angular/documents/docvault/docvaultclassify.html',
                        controller: 'docVaultClassifyController as controller',
                        windowClass: 'imp-center-modal docvault-classifydocument-popup',
                        backdrop: 'static',
                        resolve: {
                            documentTypes: function () {
                                return documentTypes
                            },
                            wrappedLoan: function () {
                                return vm.wrappedLoan;
                            },
                            document: function () {
                                return document;
                            }
                        }
                    });

                    classifyPopup.result.then(function (classifiedDocument) {
                        for (var i = 0; i < vm.wrappedLoan.ref.documents.docVaultDocuments.length; i++) {
                            if (vm.wrappedLoan.ref.documents.docVaultDocuments[i].uploadedFileId == classifiedDocument.uploadedFileId) {
                                //Documents
                                vm.wrappedLoan.ref.documents.docVaultDocuments[i] = classifiedDocument;
                                q.resolve(vm.wrappedLoan);
                            }
                        }
                    },
                    function (error) {
                        if (error != 'cancel')
                            $log.error('Failure in Document Classification', error);
                        q.reject(error);
                    });
                },
                function (error) {
                    $log.error('Failure in Document Type retrieval', error);
                });
            return q.promise;
        }

        function rejectDocument(document) {
            if (vm.wrappedLoan.ref.documents.docVaultDocuments == null) {
                return null;
            }

            for (var i = 0; i < vm.wrappedLoan.ref.documents.docVaultDocuments.length; i++) {
                if (vm.wrappedLoan.ref.documents.docVaultDocuments[i].uploadedFileId == document.uploadedFileId) {
                    //Documents
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].status = enums.uploadedFileStatus.rejected;
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].modified = true;
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].classified = true;
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].categorySortName = "04Rejected";
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].rejectReasonEdit = true;
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].rejected = true;
                    showDocuments(vm.wrappedLoan.ref.documents.docVaultDocuments);
                }
            }
        }

        function documentStatusChanged(wrappedLoan, groupedDocuments, document, category) {
            vm.wrappedLoan = wrappedLoan;
            vm.groupedDocuments = groupedDocuments;

            for (var i = 0; i < vm.wrappedLoan.ref.documents.docVaultDocuments.length; i++) {
                if (vm.wrappedLoan.ref.documents.docVaultDocuments[i].uploadedFileId == document.uploadedFileId) {
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].modified = true;
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].rejected = false;
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].rejectReason = '';
                    vm.wrappedLoan.ref.documents.docVaultDocuments[i].status = document.status;
                    if (document.status == enums.uploadedFileStatus.inReview)
                        vm.wrappedLoan.ref.documents.docVaultDocuments[i].submitToEdgeMac = false;
                    if (document.status == enums.uploadedFileStatus.rejected)
                        rejectDocument(document);
                    else if (document.categorySortName == "04Rejected") {
                        document.categorySortName = documentSortName(document.category);
                    }
                }
            }
        }

        function documentSelectedChanged(category, groupedDocuments) {

            groupedDocuments.ref[category].classifyEnabled = groupedDocuments.ref[category].some(function (e) { return e.submitToEdgeMac == true });
            groupedDocuments.ref[category].importEnabled = groupedDocuments.ref[category].some(function (e) { return e.shouldImport == true })
            groupedDocuments.ref[category].selectedAll = isSelectedAll(groupedDocuments, category);
        }

        function downloadDocument(repositoryId) {
            documentCtrl.DownloadDocument(repositoryId);
        }

        function openDocument(repositoryId, inBrowser, inTab) {
            documentCtrl.OpenDocument(repositoryId, inBrowser, inTab);
        }

        function browserSupported(contentType) {
            if (contentType == "pdf")
                return true;

            return false;
        }

        function isSelectedAll(groupedDocuments, category) {
            return !groupedDocuments.ref[category].some(function (e) { return e.submitToEdgeMac == false && !selectDisabled(e) })
        }

        function selectDisabled(document) {
            if (document.status == enums.uploadedFileStatus.inReview || !edgeMacSupported(document.contentType))
                return true;

            return false;
        }

        function edgeMacSupported(contentType) {
            if (contentType == "pdf" || contentType == "doc" || contentType == "docx" || contentType == "tif")
                return true;

            return false;
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

        function formatCategoryName(categoryName) {
            if (common.string.isNullOrWhiteSpace(categoryName)) {
                return categoryName;
            }
            return categoryName.replace("01", "").replace("02", "").replace("03", "").replace("04", "");
        }

        function toggleGrid(isExpanded, documentsRef) {
            for (var key in documentsRef) {
                if (documentsRef.hasOwnProperty(key))
                    documentsRef[key].isExpanded = isExpanded;
            }
        }

        function importDocs(groupedDocuments, loanId, borrowerId, userAccountId) {
            if (groupedDocuments == null)
                return;

            var importDocuments = [];

            for (var key in groupedDocuments.ref) {
                for (var i = 0; i < groupedDocuments.ref[key].length; i++) {
                    if (groupedDocuments.ref[key][i].shouldImport) {
                        importDocuments.push(groupedDocuments.ref[key][i]);
                    }
                }
            }

            var docVaultViewModel = { DocVaultDocuments: importDocuments };
            return DocumentsServices.ImportDocuments({ userAccountId: userAccountId, loanId: loanId, borrowerId: borrowerId }, docVaultViewModel);
        }

        var DocumentsServices = $resource(docVaultApiPath + ':path', { path: '@path' }, {
            GetDocVaultData: { method: 'GET', params: { loanId: 'loanId', userAccountId: 'userAccountId' } },
            SaveDocVaultData: { method: 'POST', params: { userAccountId: 'userAccountId' } },
            GetDocTypeFields: { method: 'GET', params: {} },
            ImportDocuments: { method: 'POST', params: { userAccountId: 'userAccountId', loanId: 'loanId', borrowerId: 'borrowerId' }, url: docVaultApiPath + 'ImportDocuments' }
        });

        var DocVaultServices = $resource(docVaultServiceApiPath + ':path', { path: '@path' }, {
            FilterByLoanNumber: { method: 'GET', params: { loanNumber: 'loanNumber', counter: 'counter', currentUserId: 'currentUserId' } }
        });

        var documentsService =
        {
            DocumentsServices: DocumentsServices,
            DocVaultServices: DocVaultServices,
            classifyDocument: classifyDocument,
            rejectDocument: rejectDocument,
            showDocuments: showDocuments,
            openDocVaultMenu: openDocVaultMenu,
            openDocVaultFlyoutMenu: openDocVaultFlyoutMenu,
            documentStatusChanged: documentStatusChanged,
            documentSelectedChanged: documentSelectedChanged,
            selectDisabled: selectDisabled,
            downloadDocument: downloadDocument,
            browserSupported: browserSupported,
            openDocument: openDocument,
            isSelectedAll: isSelectedAll,
            formatCategoryName: formatCategoryName,
            groupDocuments: groupDocuments,
            toggleGrid: toggleGrid,
            importDocs: importDocs,
            setDocVaultButtonSelected: setDocVaultButtonSelected,
            getDocVaultButtonSelected: getDocVaultButtonSelected
        };


        return documentsService;
    };

})();


