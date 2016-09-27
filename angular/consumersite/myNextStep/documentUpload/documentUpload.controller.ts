/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class DocumentUploadController {

        private _groupedDocuments: srv.IDocVaultDocumentViewModel[];

        //private _requestedDocuments: srv.IDocumentsViewModel[];
        private _requestedDocuments: srv.IDocVaultDocumentViewModel[];

        private _uploadedDocuments: srv.IUploadedFileViewModel[];

        private _incompleteDocuments: srv.IUploadedFileViewModel[];

        private _modalShown: boolean;

        private _dataLoaded: boolean;

        private _currentUserId: number = 82313;

        public controllerAsName: string = "documentUploadCntrl";

        static className = "documentUploadController";

        public static $inject = ['loan', 'loanAppPageContext', 'consumerLoanService', '$filter', 'applicationData', '$modal', 'uploadFilesSvc', '$log', 'enums', '$state', 'uiBlockWithSpinner', 'docLoadService', '$q'];

        constructor(private loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private consumerLoanService: ConsumerLoanService, 
            private $filter: any, private applicationData: any, private $modal: ng.ui.bootstrap.IModalService, private uploadFilesSvc: any,
            private $log: ng.ILogService, private enums: any, private $state: ng.ui.IStateService, private uiBlockWithSpinner: UIBlockWithSpinner,
            private docLoadService: IDocLoadService, private $q: ng.IQService) {

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

        public get titleRequestedDocuments(): string {
            return "Review My List of Requested Documents";
        }

        public set titleRequestedDocuments(value: string) {
            /*Read-Only*/
        }

        public get titleChooseFilesToSend(): string {
            return "Choose Files to Send";
        }
        public set titleChooseFilesToSend(value: string) {
            /*Read-Only*/
        }

        public get titleIncompleteDocuments(): string {
            return "Incomplete Documents";
        }

        public set titleIncompleteDocuments(value: string) {
            /*Read-Only*/
        }

        public get titleUploadHistory(): string {
            return "Upload History";
        }

        public set titleUploadHistory(value: string) {
            /*Read-Only*/
        }

        public get groupedDocuments(): srv.IDocVaultDocumentViewModel[] {
            return this._groupedDocuments;
        }

        public set groupedDocuments(value: srv.IDocVaultDocumentViewModel[]) {
            this._groupedDocuments = value;
        }

        public get requestedDocuments(): srv.IDocVaultDocumentViewModel[] {
            return this._requestedDocuments;
        }

        public set requestedDocuments(value: srv.IDocVaultDocumentViewModel[]) {
            this._requestedDocuments = value;
        }

        public get uploadedDocuments(): srv.IUploadedFileViewModel[] {
            return this._uploadedDocuments;
        }

        public set uploadedDocuments(value: srv.IUploadedFileViewModel[]) {
            this._uploadedDocuments = value;
        }

        public get incompleteDocuments(): srv.IUploadedFileViewModel[] {
            return this._incompleteDocuments;
        }

        public set incompleteDocuments(value: srv.IUploadedFileViewModel[]) {
            this._incompleteDocuments = value;
        }

        public get modalShown(): boolean {
            return this._modalShown;
        }

        public set modalShown(value: boolean) {
            this._modalShown = value;
        }

        public get dataLoaded(): boolean {
            return this._dataLoaded;
        }

        public set dataLoaded(value: boolean) {
            this._dataLoaded = value;
        }

        public showRequestedDocuments = (): boolean => {
            return true;
        }

        public downloadRequestedDocs = (): void => {
            var that = this;
            //angular.forEach(this.filerRequestedDocuments(this.requestedDocuments), function (value, key) {
            //    if (value.documentId) {
            //        var downloadLink = that.getDocumentUrl(value.documentId);
            //        if (downloadLink != '') {
            //            window.open(downloadLink, '_blank', '');
            //        }
            //    };
            //});
        }

        public toggleModal = (): void => {
            var filePickerModal: angular.ui.bootstrap.IModalServiceInstance = this.$modal.open({
                templateUrl: "/angular/consumersite/myNextStep/documentUpload/filePicker.template.html",
                controller: () => {
                    return new FilePickerController(this.enums, filePickerModal);
                },
                controllerAs: 'filePickerCtrl',
                backdrop: true,
                backdropClass: 'noBackdrop',
                windowClass: 'file-picker-flyout'
            });

            filePickerModal.result.then(
                //success
                (newFiles) => {
                    if (newFiles) {

                        //
                        var loanId = '9E282079-112E-4865-BC1F-DE37CC11C274';

                        //
                        //var loanId = this.loan.loanApp.loanApplicationId; // loanApplicationId == loanId

                        //13 == VariousDocuments
                        var docCategory = this.applicationData.documentCategories.find(function (documentCategory) { return documentCategory.documentClassId == 13 && documentCategory.name == 'Others' });

                        this.uploadFilesSvc.uploadFiles(loanId, this._currentUserId, this.loan.loanApp.borrower.borrowerId, docCategory.categoryId, newFiles)
                            .then((data) => {
                                this.$state.reload();
                                //this.uploadedDocuments.push(newFiles); Cannot be done because the new files are of type file, whereas the uploaded files are of type srv.IUploadedFileViewModel 
                            })
                            .catch((err) => {
                                this.$log.error('Document save error.');
                                alert('Your documents could not be uploaded. Please try again.');
                            })
                    };
                    
                },
                //cancel
                () => {
                    
                });
        }

        private loadLoan = (loanId: string): void => {
            
            if (loanId != '') {
                this.uiBlockWithSpinner.call<srv.ILoanViewModel>(() => this.consumerLoanService.loadLoanII(loanId).$promise, 'Getting Documents. Please Wait.', loan => {
                    var loanCls = new cls.LoanViewModel(loan, this.$filter, false);
                    var currentLoan = new vm.Loan(this.applicationData, loanCls);
                    
                    this.getDocVaultDocuments(currentLoan.getLoan().getLoanApplications())
                        .then((data) => {
                            this.requestedDocuments = data;
                        });                                          
                });
            }
            else {
                this.requestedDocuments = this.getDocVaultDocuments(this.loan.getLoan().getLoanApplications());                              
            } 
        }

        private getDocVaultDocuments = (loanApplications: srv.ICollection<srv.ILoanApplicationViewModel>): any => {

            var docVaultDocumentViewModels: srv.IDocVaultDocumentViewModel[] = [];
            var promises = [];            

            var loanApplicationIds: string[] = [];

            angular.forEach(loanApplications, (loan) => {
                loanApplicationIds.push(loan.loanApplicationId);
            });

            angular.forEach(loanApplicationIds, (loanApplicationId) => {
                promises.push(this.docLoadService.getDocVaultData(loanApplicationId, this._currentUserId));
            });            

            return this.$q.all(promises)
                .then((data) => {
                    angular.forEach(data, (object) => {
                        docVaultDocumentViewModels = docVaultDocumentViewModels.concat(object);
                    });
                              
                    return docVaultDocumentViewModels;
                }, (error) => {
                    return null;
                });
            
        }

        private filerRequestedDocuments = (requestedDocs: srv.IDocumentsViewModel[]): srv.IDocumentsViewModel[] => {
            return _.filter(requestedDocs, function (doc) { return !(_.isNull(doc.description) || _.isEmpty(doc.description)) });
        }

        private getUploadedDocuments = (documents: srv.IDocumentsViewModel[]): void => {

            var uploadedDocs: srv.IUploadedFileViewModel[] = [];
            var incompleteDocs: srv.IUploadedFileViewModel[] = [];

            var that = this;
            angular.forEach(documents, function (value, key) {
                if (value.uploadedFiles.length > 0) {
                    angular.forEach(value.uploadedFiles, function (value, key) {
                        uploadedDocs.push(value);
                        if (value.status == that.enums.uploadedFileStatus.rejected)
                            incompleteDocs.push(value);
                    });
                };
            });

            that.uploadedDocuments = uploadedDocs;
            that.incompleteDocuments = incompleteDocs;
        }

        private getDocumentUrl = (repositoryId: string): string => {
            if (repositoryId == null || repositoryId == '') {
                return '';
            }
            //var encodedRepositoryId = encodeURIComponent(repositoryId);
            var encodedRepositoryId = encodeURIComponent('A21AD1B5-D4C6-E511-80E2-00155DC85F02');
            var url = '/Downloader.axd?documentType=repositoryItem&repositoryItemId=' + encodedRepositoryId;            
            url = url + '&browser=false';
            return url;
        };
    }
    moduleRegistration.registerController(consumersite.moduleName, DocumentUploadController);
}  