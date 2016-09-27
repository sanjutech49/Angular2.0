var mailroom;
(function (mailroom) {
    var mailroomController = (function () {
        function mailroomController($log, wrappedLoan, applicationData, $state, $rootScope, enums, $controller, modalPopoverFactory, docVaultSvc, NavigationSvc, $stateParams, simpleModalWindowFactory, mailroomService, $q, $scope, $modalStack) {
            var _this = this;
            this.$log = $log;
            this.wrappedLoan = wrappedLoan;
            this.applicationData = applicationData;
            this.$state = $state;
            this.$rootScope = $rootScope;
            this.enums = enums;
            this.$controller = $controller;
            this.modalPopoverFactory = modalPopoverFactory;
            this.docVaultSvc = docVaultSvc;
            this.NavigationSvc = NavigationSvc;
            this.$stateParams = $stateParams;
            this.simpleModalWindowFactory = simpleModalWindowFactory;
            this.mailroomService = mailroomService;
            this.$q = $q;
            this.$scope = $scope;
            this.$modalStack = $modalStack;
            this.enableSaveAndNext = true;
            this.enableSnooze = true;
            this.snoozedApplications = new Array();
            /*
           * @desc Gets sending methods from lookup
           */
            this.getSendingMethods = function () {
                return (angular.isDefined(_this.applicationData.lookup.sendingMethods) ? _this.applicationData.lookup.sendingMethods : "Select One");
            };
            this.openLink = function (linkName, state) {
                _this.$scope.loanItemOpen = false;
                _this.$scope.loanItemHover = false;
                _this.$modalStack.dismissAll('cancel');
                _this.NavigationSvc.openLink(linkName, state, _this.wrappedLoan, _this.applicationData);
            };
            this.checkDocumentId = function (value, index) {
                return value.repositoryId && _this.showDocumentInList(value.repositoryId, value.status, value.documentTypeId, value.classId);
            };
            this.showDocumentInList = function (repositoryItemId, status, documentTypeId, classId) {
                var currentLoanApplication = _this.wrappedLoan.ref.active;
                var borrowerId = _this.wrappedLoan.ref.active.getBorrower().borrowerId;
                var coBorrowerId = _this.wrappedLoan.ref.active.getCoBorrower() ? _this.wrappedLoan.ref.active.getCoBorrower().borrowerId : null;
                if (status == _this.enums.uploadedFileStatus.delivered || status == _this.enums.uploadedFileStatus.sent) {
                    for (var i = 0; i < currentLoanApplication.documents.length; i++) {
                        if (currentLoanApplication.documents[i].borrowerId == borrowerId || currentLoanApplication.documents[i].borrowerId == coBorrowerId) {
                            for (var j = 0; j < currentLoanApplication.documents[i].uploadedFiles.length; j++) {
                                if ((classId == "19" || documentTypeId == "8005") && currentLoanApplication.documents[i].uploadedFiles[j].repositoryItemId == repositoryItemId) {
                                    if (status == _this.enums.uploadedFileStatus.delivered) {
                                        _this.enableSaveAndNext = false;
                                    }
                                    if (status == _this.enums.uploadedFileStatus.sent) {
                                        _this.enableSnooze = false;
                                    }
                                    _this.enableSaveAndNext = (status == _this.enums.uploadedFileStatus.sent && _this.enableSaveAndNext);
                                    _this.enableSnooze = (status == _this.enums.uploadedFileStatus.delivered && _this.enableSnooze);
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            };
            this.openDocVaultMenu = function (event, document) {
                _this.docVaultSvc.openDocVaultMenu(event, _this.wrappedLoan, document, _this.groupedDocuments);
            };
            this.documentStatusChanged = function (document) {
                _this.enableSaveAndNext = true;
                _this.enableSnooze = true;
                _this.docVaultSvc.documentStatusChanged(_this.wrappedLoan, _this.groupedDocuments, document, document.category);
            };
            this.downloadDocument = function (repositoryId) {
                _this.docVaultSvc.downloadDocument(repositoryId);
            };
            this.filterStatuses = function (status) {
                return status.text == 'Sent' || status.text == 'Delivered';
            };
            this.saveAndNext = function () {
                var loanAppId = _this.wrappedLoan.ref.active.loanApplicationId;
                var savingDataInProgress = true;
                var self = _this;
                _this.NavigationSvc.SaveAndUpdateWrappedLoan(_this.applicationData.currentUser.userAccountId, _this.wrappedLoan, function (wrappedLoan) {
                    savingDataInProgress = false;
                    self.loadNewLoan(loanAppId);
                }, function (error) {
                    self.$log.error(error);
                    self.simpleModalWindowFactory.trigger('ERROR_SAVE_MODAL');
                    savingDataInProgress = false;
                });
            };
            this.loadNewLoan = function (activeLoanAppId) {
                var self = _this;
                var next1003 = _this.retrieveNext1003(activeLoanAppId, _this.wrappedLoan.ref.status, _this.wrappedLoan.ref.getLoanApplications(), false);
                if (next1003) {
                    //after save set active loan application to be other 1003 loan application
                    _this.wrappedLoan.ref.switchActiveLoanApplication(next1003);
                    var d = self.$q.defer();
                    var documents;
                    var promises = [];
                    angular.forEach(self.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                        promises.push(self.docVaultSvc.DocumentsServices.GetDocVaultData({ loanId: loanApplication.loanApplicationId, userAccountId: self.applicationData.currentUserId }).$promise);
                    });
                    return self.$q.all(promises).then(function (data) {
                        angular.forEach(data, function (object) {
                            self.wrappedLoan.ref.documents.docVaultDocuments = self.wrappedLoan.ref.documents.docVaultDocuments.concat(object.docVaultDocuments);
                        });
                        self.wrappedLoan.ref.documents.documentsLoaded = true;
                        return d.resolve(self.wrappedLoan);
                    });
                }
                else {
                    _this.NavigationSvc.openFirstLoanInMailRoomQueue(_this.applicationData.currentUser.userAccountId);
                }
            };
            this.retrieveNext1003 = function (activeLoanAppId, loanStatus, loanApplications, loanCurrentApp) {
                var next1003 = null;
                var isSnoozed = false;
                angular.forEach(loanApplications, function (loanApplication) {
                    // set flag isSnoozed and don't load the same app
                    lib.forEach(_this.snoozedApplications, function (loanApp) {
                        if (loanApplication.loanApplicationId == loanApp)
                            isSnoozed = true;
                    });
                    //if loanApp is not active (searching through loan apps that are not loaded currently) and loan app is in mailRoom queue
                    if (((loanApplication.loanApplicationId != activeLoanAppId && !loanCurrentApp) || (loanApplication.loanApplicationId == activeLoanAppId && loanCurrentApp)) && (loanStatus == 2 || loanStatus == 4) && (loanApplication.disclosureStatusDetails.disclosureStatus == 5 /* DisclosuresCreated */) && (loanApplication.docDelivery == 0 /* Mail */) && !isSnoozed) {
                        // get next loan application
                        next1003 = loanApplication;
                    }
                });
                return next1003;
            };
            this.snoozeLoan = function () {
                _this.wrappedLoan.ref.active.incrementSnoozeOrder();
                _this.snoozedApplications.push(_this.wrappedLoan.ref.active.loanApplicationId);
                _this.saveAndNext();
            };
            NavigationSvc.contextualType = enums.ContextualTypes.MailRoomWorkbench;
            var vm = this;
            vm.wrappedLoan = wrappedLoan;
            vm.dueDate = $stateParams.disclosureDueDate;
            this.groupedDocuments = _.groupBy(_.where(this.wrappedLoan.ref.documents.docVaultDocuments, { deleted: false }), 'categorySortName');
            var next1003 = this.retrieveNext1003($stateParams.loanId, this.wrappedLoan.ref.status, this.wrappedLoan.ref.getLoanApplications(), true);
            if (next1003)
                this.wrappedLoan.ref.switchActiveLoanApplication(next1003);
        }
        mailroomController.prototype.openFirstLoanFromMailList = function () {
            this.NavigationSvc.openFirstLoanInMailRoomQueue(this.$rootScope.userAccountId);
        };
        mailroomController.$inject = ['$log', 'wrappedLoan', 'applicationData', '$state', '$rootScope', 'enums', '$controller', 'modalPopoverFactory', 'docVaultSvc', 'NavigationSvc', '$stateParams', 'simpleModalWindowFactory', 'mailroomService', '$q', '$scope', '$modalStack'];
        return mailroomController;
    })();
    mailroom.mailroomController = mailroomController;
    angular.module('mailroom').controller('mailroomController', mailroomController);
})(mailroom || (mailroom = {}));
//# sourceMappingURL=mailroom.controller.js.map