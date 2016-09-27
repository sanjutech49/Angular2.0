/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var DocumentUploadController = (function () {
        function DocumentUploadController(loan, loanAppPageContext, consumerLoanService, $filter, applicationData, $modal, uploadFilesSvc, $log, enums, $state, uiBlockWithSpinner, docLoadService, $q) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.consumerLoanService = consumerLoanService;
            this.$filter = $filter;
            this.applicationData = applicationData;
            this.$modal = $modal;
            this.uploadFilesSvc = uploadFilesSvc;
            this.$log = $log;
            this.enums = enums;
            this.$state = $state;
            this.uiBlockWithSpinner = uiBlockWithSpinner;
            this.docLoadService = docLoadService;
            this.$q = $q;
            this._currentUserId = 82313;
            this.controllerAsName = "documentUploadCntrl";
            this.showRequestedDocuments = function () {
                return true;
            };
            this.downloadRequestedDocs = function () {
                var that = _this;
                //angular.forEach(this.filerRequestedDocuments(this.requestedDocuments), function (value, key) {
                //    if (value.documentId) {
                //        var downloadLink = that.getDocumentUrl(value.documentId);
                //        if (downloadLink != '') {
                //            window.open(downloadLink, '_blank', '');
                //        }
                //    };
                //});
            };
            this.toggleModal = function () {
                var filePickerModal = _this.$modal.open({
                    templateUrl: "/angular/consumersite/myNextStep/documentUpload/filePicker.template.html",
                    controller: function () {
                        return new consumersite.FilePickerController(_this.enums, filePickerModal);
                    },
                    controllerAs: 'filePickerCtrl',
                    backdrop: true,
                    backdropClass: 'noBackdrop',
                    windowClass: 'file-picker-flyout'
                });
                filePickerModal.result.then(
                //success
                function (newFiles) {
                    if (newFiles) {
                        //
                        var loanId = '9E282079-112E-4865-BC1F-DE37CC11C274';
                        //
                        //var loanId = this.loan.loanApp.loanApplicationId; // loanApplicationId == loanId
                        //13 == VariousDocuments
                        var docCategory = _this.applicationData.documentCategories.find(function (documentCategory) {
                            return documentCategory.documentClassId == 13 && documentCategory.name == 'Others';
                        });
                        _this.uploadFilesSvc.uploadFiles(loanId, _this._currentUserId, _this.loan.loanApp.borrower.borrowerId, docCategory.categoryId, newFiles).then(function (data) {
                            _this.$state.reload();
                            //this.uploadedDocuments.push(newFiles); Cannot be done because the new files are of type file, whereas the uploaded files are of type srv.IUploadedFileViewModel 
                        }).catch(function (err) {
                            _this.$log.error('Document save error.');
                            alert('Your documents could not be uploaded. Please try again.');
                        });
                    }
                    ;
                }, 
                //cancel
                function () {
                });
            };
            this.loadLoan = function (loanId) {
                if (loanId != '') {
                    _this.uiBlockWithSpinner.call(function () { return _this.consumerLoanService.loadLoanII(loanId).$promise; }, 'Getting Documents. Please Wait.', function (loan) {
                        var loanCls = new cls.LoanViewModel(loan, _this.$filter, false);
                        var currentLoan = new consumersite.vm.Loan(_this.applicationData, loanCls);
                        _this.getDocVaultDocuments(currentLoan.getLoan().getLoanApplications()).then(function (data) {
                            _this.requestedDocuments = data;
                        });
                    });
                }
                else {
                    _this.requestedDocuments = _this.getDocVaultDocuments(_this.loan.getLoan().getLoanApplications());
                }
            };
            this.getDocVaultDocuments = function (loanApplications) {
                var docVaultDocumentViewModels = [];
                var promises = [];
                var loanApplicationIds = [];
                angular.forEach(loanApplications, function (loan) {
                    loanApplicationIds.push(loan.loanApplicationId);
                });
                angular.forEach(loanApplicationIds, function (loanApplicationId) {
                    promises.push(_this.docLoadService.getDocVaultData(loanApplicationId, _this._currentUserId));
                });
                return _this.$q.all(promises).then(function (data) {
                    angular.forEach(data, function (object) {
                        docVaultDocumentViewModels = docVaultDocumentViewModels.concat(object);
                    });
                    return docVaultDocumentViewModels;
                }, function (error) {
                    return null;
                });
            };
            this.filerRequestedDocuments = function (requestedDocs) {
                return _.filter(requestedDocs, function (doc) {
                    return !(_.isNull(doc.description) || _.isEmpty(doc.description));
                });
            };
            this.getUploadedDocuments = function (documents) {
                var uploadedDocs = [];
                var incompleteDocs = [];
                var that = _this;
                angular.forEach(documents, function (value, key) {
                    if (value.uploadedFiles.length > 0) {
                        angular.forEach(value.uploadedFiles, function (value, key) {
                            uploadedDocs.push(value);
                            if (value.status == that.enums.uploadedFileStatus.rejected)
                                incompleteDocs.push(value);
                        });
                    }
                    ;
                });
                that.uploadedDocuments = uploadedDocs;
                that.incompleteDocuments = incompleteDocs;
            };
            this.getDocumentUrl = function (repositoryId) {
                if (repositoryId == null || repositoryId == '') {
                    return '';
                }
                //var encodedRepositoryId = encodeURIComponent(repositoryId);
                var encodedRepositoryId = encodeURIComponent('A21AD1B5-D4C6-E511-80E2-00155DC85F02');
                var url = '/Downloader.axd?documentType=repositoryItem&repositoryItemId=' + encodedRepositoryId;
                url = url + '&browser=false';
                return url;
            };
            this._uploadedDocuments = [];
            this._incompleteDocuments = [];
            this._modalShown = false;
            ///TODO remove later
            //if (!!loan) {
            //    this.loadLoan(loan.getLoan().loanId);                
            //}
            this.loadLoan('9E282079-112E-4865-BC1F-DE37CC11C274'); //this.loadLoan('FE6B5510-C134-4939-9100-D83EC0214D3F')
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(DocumentUploadController.prototype, "titleRequestedDocuments", {
            get: function () {
                return "Review My List of Requested Documents";
            },
            set: function (value) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentUploadController.prototype, "titleChooseFilesToSend", {
            get: function () {
                return "Choose Files to Send";
            },
            set: function (value) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentUploadController.prototype, "titleIncompleteDocuments", {
            get: function () {
                return "Incomplete Documents";
            },
            set: function (value) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentUploadController.prototype, "titleUploadHistory", {
            get: function () {
                return "Upload History";
            },
            set: function (value) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentUploadController.prototype, "groupedDocuments", {
            get: function () {
                return this._groupedDocuments;
            },
            set: function (value) {
                this._groupedDocuments = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentUploadController.prototype, "requestedDocuments", {
            get: function () {
                return this._requestedDocuments;
            },
            set: function (value) {
                this._requestedDocuments = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentUploadController.prototype, "uploadedDocuments", {
            get: function () {
                return this._uploadedDocuments;
            },
            set: function (value) {
                this._uploadedDocuments = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentUploadController.prototype, "incompleteDocuments", {
            get: function () {
                return this._incompleteDocuments;
            },
            set: function (value) {
                this._incompleteDocuments = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentUploadController.prototype, "modalShown", {
            get: function () {
                return this._modalShown;
            },
            set: function (value) {
                this._modalShown = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DocumentUploadController.prototype, "dataLoaded", {
            get: function () {
                return this._dataLoaded;
            },
            set: function (value) {
                this._dataLoaded = value;
            },
            enumerable: true,
            configurable: true
        });
        DocumentUploadController.className = "documentUploadController";
        DocumentUploadController.$inject = ['loan', 'loanAppPageContext', 'consumerLoanService', '$filter', 'applicationData', '$modal', 'uploadFilesSvc', '$log', 'enums', '$state', 'uiBlockWithSpinner', 'docLoadService', '$q'];
        return DocumentUploadController;
    })();
    consumersite.DocumentUploadController = DocumentUploadController;
    moduleRegistration.registerController(consumersite.moduleName, DocumentUploadController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=documentUpload.controller.js.map