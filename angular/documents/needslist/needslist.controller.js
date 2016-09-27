var documents;
(function (_documents) {
    var needslistController = (function () {
        function needslistController(wrappedLoan, applicationData, $modal, NavigationSvc, $state, docVaultSvc, $log, guidService, enums, $timeout, needsListService, DocumentsService, commonModalWindowFactory, modalWindowType) {
            var _this = this;
            this.wrappedLoan = wrappedLoan;
            this.applicationData = applicationData;
            this.$modal = $modal;
            this.NavigationSvc = NavigationSvc;
            this.$state = $state;
            this.docVaultSvc = docVaultSvc;
            this.$log = $log;
            this.guidService = guidService;
            this.enums = enums;
            this.$timeout = $timeout;
            this.needsListService = needsListService;
            this.DocumentsService = DocumentsService;
            this.commonModalWindowFactory = commonModalWindowFactory;
            this.modalWindowType = modalWindowType;
            /**
             * Methods
             */
            this.setPropertyAddresses = function (loanApplication) {
                var dropDownAddress = [];
                loanApplication.getUniqueProperties().forEach(function (property) {
                    if (property)
                        dropDownAddress.push(new cls.LookupItem(property.fullAddressString, property.propertyId));
                });
                return dropDownAddress;
            };
            this.downloadDocument = function (repositoryId) {
                _this.docVaultSvc.downloadDocument(repositoryId);
            };
            this.getDocVaultTypes = function () {
                return _this.DocumentsService.DocVaultTypes;
            };
            this.getDocumentTypeIdByTypeId = function (typeId) {
                return _this.DocumentsService.getDocumentTypeIdByTypeId(_this.applicationData, typeId);
            };
            this.getDocumentCategoryIdFromMapping = function (documentTypeId) {
                if (documentTypeId == null)
                    return null;
                return _this.DocumentsService.getDocumentCategoryIdFromMapping(_this.applicationData, documentTypeId);
            };
            this.updateDocumentCategoryIdFromMapping = function (item, documentTypeId) {
                if (documentTypeId == null)
                    return null;
                var documentMapping = _.filter(_this.applicationData.documentMappings, function (documentMapping) {
                    return documentMapping.documentTypeId == documentTypeId;
                })[0];
                if (documentMapping != null)
                    item.documentCategoryId = documentMapping.documentCategoryId;
            };
            this.getDocumentTypeIdFromMapping = function (documentCategoryId) {
                return _this.DocumentsService.getDocumentTypeIdFromMapping(_this.applicationData, documentCategoryId);
            };
            this.getDescription = function (item) {
                if (item.description == null || item.description === '') {
                    var documentCategory = _.filter(_this.applicationData.documentCategories, function (documentCategory) {
                        return item.documentCategoryId == documentCategory.categoryId;
                    })[0];
                    if (documentCategory != null) {
                        item.description = documentCategory.description;
                    }
                }
                return item.description;
            };
            /*
             * Send List Button
             */
            this.populateSendList = function (loanApplication) {
                var sendList = [];
                sendList.push({
                    name: 'Email to ' + loanApplication.getBorrower().fullName,
                    disabled: _this.needsListService.isEmailValid(loanApplication.getBorrower().userAccount.username) ? false : true,
                    email: loanApplication.getBorrower().userAccount.username,
                    selected: true
                });
                // case coborrower & joint acc
                if (loanApplication.isSpouseOnTheLoan) {
                    sendList.push({
                        name: 'Email to ' + loanApplication.getCoBorrower().fullName,
                        disabled: _this.needsListService.isEmailValid(loanApplication.getCoBorrower().userAccount.username) ? false : true,
                        email: loanApplication.getCoBorrower().userAccount.username,
                        selected: false
                    });
                    sendList.push({
                        name: 'Email to ' + loanApplication.getBorrower().firstName + ', ' + loanApplication.getCoBorrower().firstName,
                        disabled: (!_this.needsListService.isEmailValid(loanApplication.getBorrower().userAccount.username) || !_this.needsListService.isEmailValid(loanApplication.getCoBorrower().userAccount.username)) ? true : false,
                        email: loanApplication.getBorrower().userAccount.username ? loanApplication.getBorrower().userAccount.username + ';' + loanApplication.getCoBorrower().userAccount.username : '',
                        selected: false
                    });
                }
                // default, select first !disabled borrower
                _this.selectedBorrowerFromSendList = sendList[0];
                return sendList;
            };
            this.chooseBorrowerFromSendList = function (item, collection, loanApplication) {
                if (!collection || !item) {
                    _this.$log.error('Collection or item is undenfined in Send button list');
                    return;
                }
                for (var i = collection.length - 1; i >= 0; i--) {
                    collection[i].selected = false;
                }
                item.selected = true;
                _this.selectedBorrowerFromSendList = item;
                _this.sendList(item, loanApplication);
            };
            this.disableSendListButton = function (sendList) {
                if (!sendList) {
                    _this.$log.error('Send list is undenfined');
                    return;
                }
                for (var i = 0, length = sendList.length; i < length; i++) {
                    if (_this.needsListService.isEmailValid(sendList[i].email))
                        return false;
                }
                return true;
            };
            this.createNeedsListButton = function (loanApplication) {
                var self = _this;
                self.wrappedLoan.ref.createDocumentsBorrowerNeeds = true;
                self.NavigationSvc.SaveAndUpdateWrappedLoan(self.applicationData.currentUserId, self.wrappedLoan, function (wrappedLoan) {
                    self.commonModalWindowFactory.open({ type: self.modalWindowType.success, message: "Borrower Needs List Has Been Created" });
                    self.refresh();
                }, null, "Saving loan and creating Borrowers Needs List");
            };
            this.triggerSendListButton = function (loanApplication) {
                var email;
                var self = _this;
                var sendList = _this.populateSendList(loanApplication);
                if (sendList != null)
                    self.sendList(sendList[0], loanApplication);
            };
            this.toggleEditMode = function (item) {
                item.isInEditMode = !item.isInEditMode;
                if (item.isInEditMode)
                    item.isItemClicked = false;
                else
                    _this.DocumentsService.recheckToBeCompletedNeedsList(_this.applicationData, _this.wrappedLoan.ref.getLoanApplications(), _this.wrappedLoan.ref.documents.docVaultDocuments);
                if (item.isAdded === true)
                    item.isAdded = false; // to turn off the add item mode
            };
            // CHENGED WITH NG-IF SO THE DIGEST CIRCLE WONT CALL THIS TO MANY TIMES
            //getBorrowerNeedsList = (documents: cls.DocumentsViewModel[], isCompleted: boolean) => {
            //    //return documents.filter(function (item) {
            //    //    return item.status == isCompleted;
            //    //});
            //    if (!isCompleted)
            //        return documents;
            //}
            //removes documents that are not supposed to be shown to user
            this.filterDocumentList = function (documents) {
                return _this.DocumentsService.filterDocumentList(documents, _this.applicationData);
            };
            this.isThereActiveDocuments = function (documents) {
                return _this.DocumentsService.isThereActiveDocuments(documents, _this.applicationData);
            };
            this.toggleSections = function (object, value) {
                for (var item in object) {
                    if (object.hasOwnProperty(item))
                        object[item] = value;
                }
            };
            this.openContactFlyout = function () {
                var self = _this;
                var modalInstance = _this.$modal.open({
                    templateUrl: 'angular/loanparticipants/loanparticipants.html',
                    backdrop: 'static',
                    windowClass: 'imp-modal flyout imp-modal-agents-parties',
                    controller: 'LoanParticipantsModal',
                    controllerAs: 'modalCtrl',
                    resolve: {
                        wrappedLoan: function () {
                            return self.wrappedLoan;
                        },
                        applicationData: function () {
                            return self.applicationData;
                        }
                    }
                });
            };
            this.setRowClicked = function (documents, item) {
                for (var i = 0; i < documents.length; i++) {
                    documents[i].isItemClicked = false;
                }
                if (!item.isInEditMode)
                    item.isItemClicked = true;
            };
            this.pupulateBorrowerList = function (loanApplication) {
                var tempBorrowerList = loanApplication.borrowerList(true);
                return tempBorrowerList;
            };
            this.refresh = function () {
                _this.$state.go('loanCenter.loan.refresh', { page: 'loanCenter.loan.documents.needslist' });
            };
            this.saveAll = function () {
                var self = _this;
                _this.NavigationSvc.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan, function (wrappedLoan) {
                    self.refresh();
                }, function (error) {
                    this.$log.error(error);
                });
            };
            this.cancelChanges = function () {
                // @todo: check if cancel changes needs to relad whole state, or just cancel needs list changes
                _this.NavigationSvc.cancelChanges(_this.wrappedLoan.ref.loanId);
            };
            this.deleteItem = function (loanApplication, item) {
                var index = loanApplication.documents.indexOf(item);
                if (index === -1) {
                    console.error("Borrower needs list, item is not contained in array ", item);
                    return;
                }
                if (loanApplication.documents[index].isUserEntry)
                    loanApplication.documents.splice(index, 1);
                else
                    loanApplication.documents[index].isDeleted = true;
                // IF DIGEST IS TO SLOW CHANGE FILTER WITH CLASIC LOOP, DON?T DELETETHIS UNTIL ALL PBI ARE DONE
                //for (var i = 0, length = loanApplication.documents.length; i < length; i++) {
                //    if (!loanApplication.documents[i].isDeleted) {
                //    }
                //}
                // alternative to filter in UI because filter would be trigerred in every digest circle
                // THIS APPROACH IS NOT GOOD FOR OUR CASE BECAUSE DELETE SHOULD ONLY ADD FLAG IF ITEM IS SAVED
                //this.$timeout(function () { 
                //    needsListDocuments = needsListDocuments.documents.filter(function (item) { return !item.isDeleted; });
                //}, 0);
            };
            this.addItem = function (loanApplication) {
                var document = new cls.DocumentsViewModel();
                if (!loanApplication.documents)
                    loanApplication.documents = [];
                _this.guidService.getNewGuid().then(function (response) {
                    document.documentId = response.data;
                });
                document.loanId = _this.wrappedLoan.ref.loanId;
                document.isUserEntry = true;
                document.dateCreated = new Date();
                document.isInEditMode = true;
                document.isDeleted = false;
                document.isAdded = true; // to trigger the add mode
                document.documentCategoryId = 0;
                document.isCompleted = false;
                document.documentCategoryId = 0;
                document.status = 1;
                document.documentNotification = '';
                _this.$timeout(function () {
                    loanApplication.documents.push(document);
                }, 0);
            };
            this.getBatchIdFromMetadata = function (metadata) {
                var batchObject = metadata.filter(function (item) {
                    return item.key === 'Batch ID';
                })[0];
                return batchObject ? batchObject.value : '';
            };
            this.enableAddressField = function (documentTypeId) {
                if (documentTypeId == null)
                    return false;
                var docVaultType = _.filter(_this.getDocVaultTypes(), function (item) {
                    return item && item.documentTypeId == documentTypeId;
                })[0];
                if (docVaultType == null || docVaultType.metadata == null)
                    return false;
                for (var i = 0; i < docVaultType.metadata.length; i++) {
                    if (docVaultType.metadata[i].type === "REOAddressList") {
                        return true;
                    }
                }
                return false;
            };
            // TODO find a better solution this will be triggered in every digest circle
            //filterDocuments = () => {
            //    return function (item) {
            //        return !item.isDeleted;
            //    }
            //}
            /**
              * Received from borrower
            **/
            /**
              * Borrower Uploaded
            **/
            this.getBatchIdForBorrowerUploadedSection = function (repositoryItemId) {
                var docValut = _this.wrappedLoan.ref.documents.docVaultDocuments, docValutMetadata;
                for (var i = 0, length = docValut.length; i < length; i++) {
                    if (docValut[i].repositoryId === repositoryItemId) {
                        docValutMetadata = docValut[i].metadata;
                    }
                }
                return docValutMetadata ? _this.getBatchIdFromMetadata(docValutMetadata) : '';
            };
            this.getStatusByValue = function (status) {
                for (var key in _this.enums.uploadedFileStatus) {
                    if (_this.enums.uploadedFileStatus.hasOwnProperty(key)) {
                        if (_this.enums.uploadedFileStatus[key] === status)
                            return key.charAt(0).toUpperCase() + key.slice(1);
                    }
                }
            };
            this.previewList = function (loanId) {
                var self = _this;
                self.commonModalWindowFactory.open({ type: self.modalWindowType.loader, message: "Generating preview list" });
                _this.NavigationSvc.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan, function (wrappedLoan) {
                    self.needsListService.getCoverLetterId(loanId, 21 /* BorrowersNeedsListToBeCompleted */, self.applicationData.currentUser.userAccountId).then(function (data) {
                        self.DocumentsService.openDocument(data, true, true);
                        self.commonModalWindowFactory.close();
                    });
                }, function (error) {
                    self.$log.error(error);
                }, null, false);
            };
            this.sendList = function (item, loanApplication) {
                var self = _this;
                self.commonModalWindowFactory.open({ type: self.modalWindowType.loader, message: "Sending an e-mail" });
                _this.NavigationSvc.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan, function (wrappedLoan) {
                    self.needsListService.getCoverLetterId(loanApplication.loanApplicationId, 21 /* BorrowersNeedsListToBeCompleted */, self.applicationData.currentUser.userAccountId).then(function (data) {
                        if (item.email) {
                            self.needsListService.sendCoverLetter(loanApplication.loanApplicationId, data, item.email).then(function (data) {
                                self.commonModalWindowFactory.close();
                            }, function (error) {
                                self.commonModalWindowFactory.open({ type: self.modalWindowType.error, message: "We could not send an e-mail at this time, please try again later. Thank you." });
                                self.commonModalWindowFactory.close();
                            });
                        }
                    }, function (error) {
                        self.$log.error(error);
                        self.commonModalWindowFactory.close();
                    });
                }, function (error) {
                    self.$log.error(error);
                }, null, false);
            };
            var self = this;
            docVaultSvc.DocumentsServices.GetDocTypeFields().$promise.then((function (data) {
                self.DocumentsService.fillDocVaultTypes(data, self.wrappedLoan.ref.getLoanApplications(), self.wrappedLoan.ref.documents.docVaultDocuments, self.applicationData);
            }).bind(self), function (error) {
                $log.error('Failure in Document Type retrieval', error);
            });
            var listOfCategoryIds = [];
            this.wrappedLoan.ref.getLoanApplications().forEach(function (loanApp) {
                loanApp.documents.forEach(function (document) {
                    document.description = _this.getDescription(document);
                    if (!document.isDeleted)
                        listOfCategoryIds.push(document.documentCategoryId);
                });
            });
            self.receivedFromBorrower = _.filter(self.wrappedLoan.ref.documents.docVaultDocuments, function (item) {
                return item && item.category != "Unclassified" && item.uploadedBy == 1 && !!_.some(self.getDocVaultTypes(), function (docVaultType) {
                    return docVaultType.typeId == item.documentTypeId;
                }) && _.some(listOfCategoryIds, function (categoryId) {
                    return item.categoryId === categoryId;
                });
            });
        }
        needslistController.$inject = [
            'wrappedLoan',
            'applicationData',
            '$modal',
            'NavigationSvc',
            '$state',
            'docVaultSvc',
            '$log',
            'guidService',
            'enums',
            '$timeout',
            'needsListService',
            'DocumentsService',
            'commonModalWindowFactory',
            'modalWindowType'
        ];
        return needslistController;
    })();
    _documents.needslistController = needslistController;
    angular.module('documents').controller('needslistController', needslistController);
})(documents || (documents = {}));
//# sourceMappingURL=needslist.controller.js.map