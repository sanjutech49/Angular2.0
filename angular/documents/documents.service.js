var documents;
(function (_documents) {
    var DocumentsService = (function () {
        function DocumentsService($http, apiRoot, docVaultSvc, $log) {
            var _this = this;
            this.$http = $http;
            this.apiRoot = apiRoot;
            this.docVaultSvc = docVaultSvc;
            this.$log = $log;
            this.fillDocVaultTypes = function (data, loanAppList, docVaultDocuments, applicationData) {
                _this.docVaultTypes = _.filter(data.documentTypes, function (item) {
                    return item.borrowerProvides == true;
                });
                _this.recheckToBeCompletedNeedsList(applicationData, loanAppList, docVaultDocuments);
            };
            this.recheckToBeCompletedNeedsList = function (applicationData, loanAppList, docVaultDocuments) {
                for (var i = 0; i < loanAppList.length; i++) {
                    if (!!loanAppList[i].documents) {
                        for (var j = 0; j < loanAppList[i].documents.length; j++) {
                            for (var z = 0; z < docVaultDocuments.length; z++) {
                                var documentCategoryIds = _this.getDocumentCategoryIdFromMapping(applicationData, _this.getDocumentTypeIdByTypeId(docVaultDocuments[z].documentTypeId));
                                if (documentCategoryIds != null && _.some(documentCategoryIds, function (x) {
                                    return x.documentCategoryId == loanAppList[i].documents[j].documentCategoryId;
                                }) && docVaultDocuments[z].status != 6 && docVaultDocuments[z].uploadedBy == 1) {
                                    loanAppList[i].documents[j].isCompleted = true;
                                    loanAppList[i].documents[j].received = new Date(docVaultDocuments[z].lastUpdated);
                                    break;
                                }
                                else {
                                    loanAppList[i].documents[j].isCompleted = false;
                                }
                            }
                        }
                    }
                }
            };
            this.getDocumentCategoryIdFromMapping = function (applicationData, documentTypeId) {
                var documentMapping = _.filter(applicationData.documentMappings, function (documentMapping) {
                    return documentMapping.documentTypeId == documentTypeId;
                });
                if (documentMapping != null)
                    return documentMapping;
                return null;
            };
            this.getDocumentTypeIdFromMapping = function (applicationData, documentCategoryId) {
                if (documentCategoryId == -1)
                    return -1;
                var documentMapping = _.filter(applicationData.documentMappings, function (documentMapping) {
                    return documentMapping.documentCategoryId == documentCategoryId;
                })[0];
                if (documentMapping != null)
                    return documentMapping.documentTypeId;
                return null;
            };
            this.downloadDocument = function (documentId) {
                var downloadLink = _this.getDocumentUrl(documentId, null);
                if (downloadLink != '') {
                    window.open(downloadLink, '_blank', '');
                }
            };
            this.openDocument = function (documentId, inBrowser, inTab) {
                var downloadLink = _this.getDocumentUrl(documentId, inBrowser);
                if (!common.string.isNullOrWhiteSpace(downloadLink) && !common.string.isEmptyGuid(downloadLink)) {
                    if (inTab)
                        window.open(downloadLink, '_blank', '');
                    else
                        window.open(downloadLink, '_blank', 'location=0');
                }
            };
            this.getDocumentTypeIdByTypeId = function (typeId) {
                if (typeId == null)
                    return null;
                var docVaultType = _.filter(_this.docVaultTypes, function (docVaultType) {
                    return docVaultType.typeId == typeId;
                })[0];
                if (!!docVaultType)
                    return docVaultType.documentTypeId;
                return null;
            };
            this.getDocumentUrl = function (documentId, inBrowser) {
                if (!documentId)
                    return '';
                var encodedRepositoryId = encodeURIComponent(documentId);
                var url = '/Downloader.axd?documentType=repositoryItem&repositoryItemId=' + encodedRepositoryId;
                if (inBrowser != null && inBrowser)
                    url = url + '&browser=true';
                return url;
            };
            this.filterDocumentList = function (documents, applicationData) {
                var self = _this;
                var list = [];
                if (!!documents) {
                    for (var i = 0; i < documents.length; i++) {
                        if (documents[i].isUserEntry) {
                            list.push(documents[i]);
                            continue;
                        }
                        if (documents[i].isDeleted || documents[i].isCompleted) {
                            continue;
                        }
                        for (var j = 0; j < applicationData.documentMappings.length; j++) {
                            for (var z = 0; z < _this.docVaultTypes.length; z++) {
                                if (documents[i].documentCategoryId == applicationData.documentMappings[j].documentCategoryId && applicationData.documentMappings[j].documentTypeId == _this.docVaultTypes[z].documentTypeId && !!_this.docVaultTypes[z].borrowerProvides) {
                                    list.push(documents[i]);
                                }
                            }
                        }
                    }
                    //sorting retrieved document on their DocVaultType full description
                    if (list && list.length > 1)
                        list.sort(function (x, y) {
                            //get DocVaultType of documents being compared, based on documentCategoryId 
                            var a = lib.filter(self.DocVaultTypes, function (t) { return t.documentTypeId == self.getDocumentTypeIdFromMapping(applicationData, x.documentCategoryId); });
                            var b = lib.filter(self.DocVaultTypes, function (t) { return t.documentTypeId == self.getDocumentTypeIdFromMapping(applicationData, y.documentCategoryId); });
                            //do the sorting if such DocVaultTypes exist
                            if (a.length != 0 && b.length != 0) {
                                if (a[0].fullDescription > b[0].fullDescription)
                                    return 1;
                                else
                                    return -1;
                            }
                            return 0;
                        });
                }
                return list;
            };
            this.isThereActiveDocuments = function (documents, applicationData) {
                if (!!documents)
                    return _this.filterDocumentList(documents, applicationData).filter(function (item) {
                        return !item.isDeleted;
                    }).length > 0;
                return false;
            };
            this.docVaultTypes = [];
        }
        Object.defineProperty(DocumentsService.prototype, "DocVaultTypes", {
            get: function () {
                return this.docVaultTypes;
            },
            enumerable: true,
            configurable: true
        });
        DocumentsService.$inject = ['$http', 'apiRoot', 'docVaultSvc', '$log'];
        DocumentsService.className = 'DocumentsService';
        return DocumentsService;
    })();
    _documents.DocumentsService = DocumentsService;
    moduleRegistration.registerService('documents', DocumentsService);
})(documents || (documents = {}));
//# sourceMappingURL=documents.service.js.map