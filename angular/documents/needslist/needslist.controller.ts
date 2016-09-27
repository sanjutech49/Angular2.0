module documents {

    export class needslistController {

        public static $inject = [
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

        private selectedBorrowerFromSendList: any;
        private receivedFromBorrower: any;
        private loanApplicationDocuments: any; // we need this private

        constructor(private wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, private applicationData: any,
            private $modal: any, private NavigationSvc: any, private $state: any, private docVaultSvc, private $log, private guidService,
            private enums, private $timeout, private needsListService: documents.INeedsListService, private DocumentsService:any, private commonModalWindowFactory, private modalWindowType) {


            var self = this;
            docVaultSvc.DocumentsServices.GetDocTypeFields().$promise.then(
                (function (data) {
                    self.DocumentsService.fillDocVaultTypes(data, self.wrappedLoan.ref.getLoanApplications(), self.wrappedLoan.ref.documents.docVaultDocuments, self.applicationData);
                }).bind(self),
                function (error) {
                    $log.error('Failure in Document Type retrieval', error);
                    });

            var listOfCategoryIds = [];
            this.wrappedLoan.ref.getLoanApplications().forEach(loanApp => {
                loanApp.documents.forEach((document: any) => {
                    document.description = this.getDescription(document);
                    if (!document.isDeleted)
                        listOfCategoryIds.push(document.documentCategoryId);
                });
            });

            self.receivedFromBorrower = _.filter(self.wrappedLoan.ref.documents.docVaultDocuments, function (item) {
                return item && item.category != "Unclassified" && item.uploadedBy == 1 && !!_.some(self.getDocVaultTypes(),(docVaultType: any) => { return docVaultType.typeId == item.documentTypeId; })
                    && _.some(listOfCategoryIds,(categoryId: any) => { return item.categoryId === categoryId; });
                });
        }

        /**
         * Methods
         */
        setPropertyAddresses = (loanApplication: srv.ILoanApplicationViewModel): srv.IList<srv.ILookupItem> => {

            var dropDownAddress: srv.IList<srv.ILookupItem> = [];

            loanApplication.getUniqueProperties().forEach(property => {
                if (property)
                    dropDownAddress.push(new cls.LookupItem(property.fullAddressString, property.propertyId));
            });

            return dropDownAddress;
        }

        downloadDocument = (repositoryId) => {
            this.docVaultSvc.downloadDocument(repositoryId);
                        }

        getDocVaultTypes = () : srv.IList<srv.IVaultDocumentType> => {
            return this.DocumentsService.DocVaultTypes;
        }


        getDocumentTypeIdByTypeId = (typeId?: string): number => {
            return this.DocumentsService.getDocumentTypeIdByTypeId(this.applicationData, typeId);
        }

        getDocumentCategoryIdFromMapping = (documentTypeId?: number): number => {
            if (documentTypeId == null) return null;
            return this.DocumentsService.getDocumentCategoryIdFromMapping(this.applicationData, documentTypeId);
        }

        updateDocumentCategoryIdFromMapping = (item: cls.DocumentsViewModel, documentTypeId?: number) => {
            if (documentTypeId == null) return null;
            var documentMapping: srv.IDocumentMappingViewModel = _.filter(this.applicationData.documentMappings,(documentMapping: any) => {
                return documentMapping.documentTypeId == documentTypeId;
            })[0];

            if (documentMapping != null)
                item.documentCategoryId = documentMapping.documentCategoryId;
            }
                
        getDocumentTypeIdFromMapping = (documentCategoryId?: number): number => {
            return this.DocumentsService.getDocumentTypeIdFromMapping(this.applicationData, documentCategoryId);
        }

        getDescription = (item: any): string => {
            if (item.description == null || item.description === '') {
            var documentCategory: any = _.filter(this.applicationData.documentCategories,(documentCategory: any) => {
                    return item.documentCategoryId == documentCategory.categoryId;
            })[0];

                if (documentCategory != null) {
                    item.description = documentCategory.description;
                }
            }

            return item.description;
        }

        /*
         * Send List Button 
         */
        populateSendList = (loanApplication): any => {
            var sendList: any = [];

            sendList.push({
                name: 'Email to ' + loanApplication.getBorrower().fullName,
                disabled: this.needsListService.isEmailValid(loanApplication.getBorrower().userAccount.username) ? false : true,
                email: loanApplication.getBorrower().userAccount.username,
                selected: true
            });

            // case coborrower & joint acc
            if (loanApplication.isSpouseOnTheLoan) {
                sendList.push({
                    name: 'Email to ' + loanApplication.getCoBorrower().fullName,
                    disabled: this.needsListService.isEmailValid( loanApplication.getCoBorrower().userAccount.username) ? false : true,
                    email: loanApplication.getCoBorrower().userAccount.username,
                    selected: false
                });

                sendList.push({
                    name: 'Email to ' + loanApplication.getBorrower().firstName + ', ' + loanApplication.getCoBorrower().firstName,
                    disabled: (!this.needsListService.isEmailValid(loanApplication.getBorrower().userAccount.username) || !this.needsListService.isEmailValid(loanApplication.getCoBorrower().userAccount.username)) ? true : false,
                    email: loanApplication.getBorrower().userAccount.username ? loanApplication.getBorrower().userAccount.username + ';' + loanApplication.getCoBorrower().userAccount.username : '',
                    selected: false
                });
            }

            // default, select first !disabled borrower
            this.selectedBorrowerFromSendList = sendList[0];

            return sendList;
        }

        chooseBorrowerFromSendList = (item, collection, loanApplication) => {
            if (!collection || !item) {
                this.$log.error('Collection or item is undenfined in Send button list');
                return;
            }

            // deselect all elements
            for (var i = collection.length - 1; i >= 0; i--) {
                collection[i].selected = false;
            }

            item.selected = true;
            this.selectedBorrowerFromSendList = item;
            this.sendList(item, loanApplication);
        }

        disableSendListButton = (sendList): any => {
            if (!sendList) {
                this.$log.error('Send list is undenfined');
                return;
            }

            // disable button if no one has a email address
            for (var i = 0, length = sendList.length; i < length; i++) {
                if (this.needsListService.isEmailValid(sendList[i].email)) return false;
            }

            return true;
        }

        createNeedsListButton = (loanApplication: srv.ILoanApplicationViewModel) => {

            var self = this;
            self.wrappedLoan.ref.createDocumentsBorrowerNeeds = true;

            self.NavigationSvc.SaveAndUpdateWrappedLoan(self.applicationData.currentUserId, self.wrappedLoan,(wrappedLoan) => {
                self.commonModalWindowFactory.open({ type: self.modalWindowType.success, message: "Borrower Needs List Has Been Created" });
                self.refresh();
            },
                null, "Saving loan and creating Borrowers Needs List");
        }


        triggerSendListButton = (loanApplication: srv.ILoanApplicationViewModel) => {
            var email: string;
            var self = this;

            var sendList = this.populateSendList(loanApplication);

            if(sendList != null)
                self.sendList(sendList[0], loanApplication);
        }

        toggleEditMode = (item: any) => {
            item.isInEditMode = !item.isInEditMode;

            if (item.isInEditMode)
                item.isItemClicked = false;
            else
                this.DocumentsService.recheckToBeCompletedNeedsList(this.applicationData, this.wrappedLoan.ref.getLoanApplications(), this.wrappedLoan.ref.documents.docVaultDocuments);

            if (item.isAdded === true) item.isAdded = false; // to turn off the add item mode

        }
        
        // CHENGED WITH NG-IF SO THE DIGEST CIRCLE WONT CALL THIS TO MANY TIMES
        //getBorrowerNeedsList = (documents: cls.DocumentsViewModel[], isCompleted: boolean) => {
        //    //return documents.filter(function (item) {
        //    //    return item.status == isCompleted;
        //    //});
        //    if (!isCompleted)
        //        return documents;
        //}

        //removes documents that are not supposed to be shown to user
        filterDocumentList = (documents: any) => {
            return this.DocumentsService.filterDocumentList(documents, this.applicationData);
        }

        isThereActiveDocuments = (documents: srv.IDocumentsViewModel[]): boolean => {
            return this.DocumentsService.isThereActiveDocuments(documents, this.applicationData);
        }
        
        toggleSections = (object: any, value: boolean) => {
            for (var item in object) {
                if (object.hasOwnProperty(item)) object[item] = value;
            }
        }

        openContactFlyout = () => {
            var self = this;

            var modalInstance = this.$modal.open({
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
        }

        setRowClicked = (documents: cls.DocumentsViewModel[], item: cls.DocumentsViewModel) => {
            for (var i = 0; i < documents.length; i++) {
                documents[i].isItemClicked = false;
            }
            if (!item.isInEditMode)
                item.isItemClicked = true;
        }
            
        pupulateBorrowerList = (loanApplication: any) => {
            var tempBorrowerList = loanApplication.borrowerList(true);
            return tempBorrowerList;
        }

        refresh = () => {
            this.$state.go('loanCenter.loan.refresh', { page: 'loanCenter.loan.documents.needslist' });
        }

        saveAll = () => {
            var self = this;
            this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan, function (wrappedLoan) {
                self.refresh();
            }, function (error) {
                    this.$log.error(error);
                });
        }

        cancelChanges = () => {
             // @todo: check if cancel changes needs to relad whole state, or just cancel needs list changes
            this.NavigationSvc.cancelChanges(this.wrappedLoan.ref.loanId);
        }

        deleteItem = (loanApplication: any, item: cls.DocumentsViewModel) => {
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
        }


        addItem = (loanApplication: srv.ILoanApplicationViewModel) => {
            var document = new cls.DocumentsViewModel();

            if (!loanApplication.documents) loanApplication.documents = [];

            this.guidService.getNewGuid().then(response => {
                document.documentId = response.data;
            });

            document.loanId = this.wrappedLoan.ref.loanId;
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

            this.$timeout(function () { 
            loanApplication.documents.push(document);
            }, 0);
        }

        getBatchIdFromMetadata = (metadata) => {
            var batchObject = metadata.filter(function (item) {
                return item.key === 'Batch ID'
            })[0];

            return batchObject ? batchObject.value : '';
        }

        enableAddressField = (documentTypeId?: number): boolean => {
            if (documentTypeId == null) return false;

            var docVaultType: srv.IVaultDocumentType = _.filter(this.getDocVaultTypes(), function (item) { return item && item.documentTypeId == documentTypeId; })[0];

            if (docVaultType == null || docVaultType.metadata == null)
                return false;

            for (var i = 0; i < docVaultType.metadata.length; i++) {
                if (docVaultType.metadata[i].type === "REOAddressList") {
                    return true;
                }
            }

            return false;
        }

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

        getBatchIdForBorrowerUploadedSection = (repositoryItemId) => {
            var docValut = this.wrappedLoan.ref.documents.docVaultDocuments,
                docValutMetadata;

            for (var i = 0, length = docValut.length; i < length; i++) {
                if (docValut[i].repositoryId === repositoryItemId) {
                    docValutMetadata = docValut[i].metadata;
                }
            }

            return docValutMetadata ? this.getBatchIdFromMetadata(docValutMetadata) : '';
        }

        getStatusByValue = (status) => {
            for (var key in this.enums.uploadedFileStatus) {
                if (this.enums.uploadedFileStatus.hasOwnProperty(key)) {
                    if (this.enums.uploadedFileStatus[key] === status)
                        return key.charAt(0).toUpperCase() + key.slice(1);
                }
            }
        }

        previewList = (loanId: string) => {
            var self = this;

                self.commonModalWindowFactory.open({ type: self.modalWindowType.loader, message: "Generating preview list" });

            this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan, function (wrappedLoan) {

                self.needsListService.getCoverLetterId(loanId, srv.DocumentClassType.BorrowersNeedsListToBeCompleted, self.applicationData.currentUser.userAccountId).then(function (data) {
                self.DocumentsService.openDocument(data, true, true)
                self.commonModalWindowFactory.close();
            });
            }, function (error) {
                self.$log.error(error);
                }, null, false);
        }

        sendList = (item: any, loanApplication: srv.ILoanApplicationViewModel): void => {
            var self = this;

            self.commonModalWindowFactory.open({ type: self.modalWindowType.loader, message: "Sending an e-mail" });

            this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan, function (wrappedLoan) {
                self.needsListService.getCoverLetterId(loanApplication.loanApplicationId, srv.DocumentClassType.BorrowersNeedsListToBeCompleted, self.applicationData.currentUser.userAccountId).then(
                function (data) {
                    if (item.email) {
                            self.needsListService.sendCoverLetter(loanApplication.loanApplicationId, data, item.email).then(
                            function (data) {
                                self.commonModalWindowFactory.close();
                            },
                            function (error) {
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
        }
    }



    angular.module('documents').controller('needslistController', needslistController);
}
