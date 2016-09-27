module mailroom {

    export class mailroomController {

        public static $inject = ['$log', 'wrappedLoan', 'applicationData', '$state', '$rootScope', 'enums', '$controller',
            'modalPopoverFactory', 'docVaultSvc', 'NavigationSvc', '$stateParams', 'simpleModalWindowFactory', 'mailroomService', '$q', '$scope',
            '$modalStack'];

        private groupedDocuments: any;
        private dueDate: any;       
        private documents: any;
        private currentLoanApplicationId: string;
        private currentLoanApplication: any;
        private enableSaveAndNext: boolean = true;
        private enableSnooze: boolean = true;
        private snoozedApplications: Array<string> = new Array<string>();

        constructor(private $log, private wrappedLoan, private applicationData, private $state, private $rootScope, private enums, private $controller,
            private modalPopoverFactory, private docVaultSvc, private NavigationSvc, private $stateParams, private simpleModalWindowFactory, private mailroomService,
            private $q, private $scope, private $modalStack) {
            
            NavigationSvc.contextualType = enums.ContextualTypes.MailRoomWorkbench;

            var vm = this;
            vm.wrappedLoan = wrappedLoan;
            vm.dueDate = $stateParams.disclosureDueDate;
                
            this.groupedDocuments = _.groupBy(_.where(this.wrappedLoan.ref.documents.docVaultDocuments, { deleted: false }), 'categorySortName');          
           
            var next1003 = this.retrieveNext1003($stateParams.loanId, this.wrappedLoan.ref.status, this.wrappedLoan.ref.getLoanApplications(), true);

            if (next1003)
                this.wrappedLoan.ref.switchActiveLoanApplication(next1003);   
          
        }

        /*
       * @desc Gets sending methods from lookup
       */
        getSendingMethods = (): any => {
            return (angular.isDefined(this.applicationData.lookup.sendingMethods) ? this.applicationData.lookup.sendingMethods : "Select One");
        }

        openLink = (linkName, state) => {
            this.$scope.loanItemOpen = false;
            this.$scope.loanItemHover = false;
            this.$modalStack.dismissAll('cancel');         

            this.NavigationSvc.openLink(linkName, state, this.wrappedLoan, this.applicationData);
        }

        checkDocumentId = (value, index) => {
            return value.repositoryId && this.showDocumentInList(value.repositoryId, value.status, value.documentTypeId, value.classId);
            }
        showDocumentInList = (repositoryItemId: any, status: number, documentTypeId: string, classId: string): boolean => {
            var currentLoanApplication = this.wrappedLoan.ref.active;

            var borrowerId = this.wrappedLoan.ref.active.getBorrower().borrowerId;
            var coBorrowerId = this.wrappedLoan.ref.active.getCoBorrower() ? this.wrappedLoan.ref.active.getCoBorrower().borrowerId : null;

            if (status == this.enums.uploadedFileStatus.delivered || status == this.enums.uploadedFileStatus.sent) {
                for (var i = 0; i < currentLoanApplication.documents.length; i++) {

                    if (currentLoanApplication.documents[i].borrowerId == borrowerId || currentLoanApplication.documents[i].borrowerId == coBorrowerId) {
                        for (var j = 0; j < currentLoanApplication.documents[i].uploadedFiles.length; j++) {
                            if ((classId == "19" || documentTypeId == "8005") &&
                                currentLoanApplication.documents[i].uploadedFiles[j].repositoryItemId == repositoryItemId) {

                                if (status == this.enums.uploadedFileStatus.delivered) {
                                    this.enableSaveAndNext = false;
        }

                                if (status == this.enums.uploadedFileStatus.sent) {
                                    this.enableSnooze = false;
                                }

                                this.enableSaveAndNext = (status == this.enums.uploadedFileStatus.sent && this.enableSaveAndNext);                                                          
                                this.enableSnooze = (status == this.enums.uploadedFileStatus.delivered && this.enableSnooze);

                                return true;
                        }
                }
            }
                }
            }           

            return false;
        }
        openFirstLoanFromMailList() {
            this.NavigationSvc.openFirstLoanInMailRoomQueue(this.$rootScope.userAccountId);
        }

        openDocVaultMenu = (event: any, document: any) => {
            this.docVaultSvc.openDocVaultMenu(event, this.wrappedLoan, document, this.groupedDocuments);
        }

        documentStatusChanged = (document: any) => {
            this.enableSaveAndNext = true;
            this.enableSnooze = true;
            this.docVaultSvc.documentStatusChanged(this.wrappedLoan, this.groupedDocuments, document, document.category);
        }

        downloadDocument = (repositoryId: any) => {
            this.docVaultSvc.downloadDocument(repositoryId);
        }
        filterStatuses = (status) => {
            return status.text == 'Sent' || status.text == 'Delivered';
        }

        saveAndNext = () => {
            var loanAppId = this.wrappedLoan.ref.active.loanApplicationId;
            var savingDataInProgress = true;
            var self = this;
            this.NavigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUser.userAccountId, this.wrappedLoan, function (wrappedLoan) {
                savingDataInProgress = false;
                self.loadNewLoan(loanAppId);               
            },
                function (error) {
                    self.$log.error(error);
                    self.simpleModalWindowFactory.trigger('ERROR_SAVE_MODAL');
                    savingDataInProgress = false;
                });
        }

        public loadNewLoan = (activeLoanAppId: any) => {
            
            var self = this;
            
            var next1003 = this.retrieveNext1003(activeLoanAppId, this.wrappedLoan.ref.status, this.wrappedLoan.ref.getLoanApplications(), false);

            if (next1003) {
                //after save set active loan application to be other 1003 loan application
                this.wrappedLoan.ref.switchActiveLoanApplication(next1003);   

                var d = self.$q.defer();     

                var documents: srv.IDocVaultViewModel;
                var promises = [];

                angular.forEach(self.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                    promises.push(self.docVaultSvc.DocumentsServices.GetDocVaultData({ loanId: loanApplication.loanApplicationId, userAccountId: self.applicationData.currentUserId }).$promise);
                });

                return self.$q.all(promises).then(function (data) {
                    angular.forEach(data, function (object: srv.IDocVaultViewModel) {
                        self.wrappedLoan.ref.documents.docVaultDocuments = self.wrappedLoan.ref.documents.docVaultDocuments.concat(object.docVaultDocuments);
                    })

                    self.wrappedLoan.ref.documents.documentsLoaded = true;

                    return d.resolve(self.wrappedLoan);
                });            
            }
            else {
                this.NavigationSvc.openFirstLoanInMailRoomQueue(this.applicationData.currentUser.userAccountId);
            }
        }

        public retrieveNext1003 = (activeLoanAppId: any, loanStatus: any, loanApplications: srv.ICollection<srv.ILoanApplicationViewModel>, loanCurrentApp: boolean) => {
            var next1003 = null;
            var isSnoozed = false;
           
            angular.forEach(loanApplications,(loanApplication) => {
                // set flag isSnoozed and don't load the same app
                lib.forEach(this.snoozedApplications,(loanApp) => {
                    if (loanApplication.loanApplicationId == loanApp)
                        isSnoozed = true;
                });
                //if loanApp is not active (searching through loan apps that are not loaded currently) and loan app is in mailRoom queue
                if (((loanApplication.loanApplicationId != activeLoanAppId && !loanCurrentApp) || (loanApplication.loanApplicationId == activeLoanAppId && loanCurrentApp))
                    //TODO: MERGE ISSUE (ENUMS):  && (loanStatus == srv.LoanStatus.InProgress || loanStatus == srv.LoanStatus.Reopened)
                    && (loanStatus == 2 || loanStatus == 4) //TODO: MERGE FIX - REMOVE!
                    && (loanApplication.disclosureStatusDetails.disclosureStatus == srv.DisclosureStatusEnum.DisclosuresCreated)
                    && (loanApplication.docDelivery == srv.docDeliveryTypeEnum.Mail) && !isSnoozed) {
                                            
                    // get next loan application
                    next1003 = loanApplication;
                }
            });

            return next1003;
        }

        public snoozeLoan = () => {
            this.wrappedLoan.ref.active.incrementSnoozeOrder();
            this.snoozedApplications.push(this.wrappedLoan.ref.active.loanApplicationId);
            this.saveAndNext();
        }
    }

    angular.module('mailroom').controller('mailroomController', mailroomController);
}
