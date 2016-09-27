/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../ts/lib/referenceWrapper.ts" />
/// <reference path="integrations.service.ts" />

module integrationsServices.controller {
    'use strict';

    class IntegrationsController {

        static $inject = ['wrappedLoan', '$state', 'NavigationSvc', 'applicationData', 'enums', 'docVaultSvc', 'integrationsService'];

        showLoader = false;
        showErrorContainer = false;
        groupedEvents: any;

        constructor(private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private $state: angular.ui.IStateService,
            private navigationService: any, public applicationData: any, private enums: any, private docVaultSvc, private integrationsService: integrationsServices.service.IIntegrationsService) {
            var vm = this;
            navigationService.contextualType = enums.ContextualTypes.Integrations;
            vm.showLoader = true;
            vm.showErrorContainer = false;
            vm.integrationsService.getIntegrationData(this.wrappedLoan.ref.loanId, this.applicationData.currentUserId).$promise.then(
                function (success) {
                    vm.groupItems(success.response.items);
                    vm.showLoader = false;
                },
                function (error) {
                    console.error('Error on integrations - getIntegrationData. Error: ' + String(error));
                }
                );
 
        }
        public downloadDocument = (document) => {
            if (document.documents != null) {
                for (var key in document.documents)
                    this.docVaultSvc.downloadDocument(key);
            }
        }

        public groupItems = (items) => {
            this.groupedEvents = new lib.referenceWrapper(_.groupBy(items, 'folderName'));
        }

        public formatName = (folderName, name) => {
            var splittedFolderName = name.split("-", 5);
            var nameWithoutDate;
            if (common.string.isNullOrWhiteSpace(name)) {
                return name;
            }
            if (folderName == srv.folderName.FeesClosingCorp) {
                nameWithoutDate = splittedFolderName[0] + "-" + splittedFolderName[1] + "-" + splittedFolderName[2];
            }
            else if (folderName == srv.folderName.LOSEncompass || folderName == srv.folderName.PricingOptimalBlue || folderName == srv.folderName.SigningeOriginal || folderName == srv.folderName.CRMLead360) {
                nameWithoutDate = splittedFolderName[0] + "-" + splittedFolderName[1];
            } else if (folderName == srv.folderName.BiDirectionalEncompass || folderName == srv.folderName.AppraisalLenderX) {
                nameWithoutDate = splittedFolderName[0];
            }
            else {
                nameWithoutDate = name;
            }

            return nameWithoutDate;
        }

        public shouldIconBeVisible = (document, repositoryId, isEvent) => {

            if (isEvent) {
                if (document.folderName == srv.folderName.LOSEncompass || document.folderName == srv.folderName.FeesClosingCorp || document.folderName == srv.folderName.PricingOptimalBlue || document.folderName == srv.folderName.SigningeOriginal || document.folderName == srv.folderName.BiDirectionalEncompass || document.folderName == srv.folderName.CRMLead360 || document.folderName == srv.folderName.AppraisalLenderX) {
                    return !common.string.isNullOrWhiteSpace(document.eventId);
                } else if ( document.folderName == srv.folderName.DisclosuresApplicationDocument || document.folderName == srv.folderName.DisclosuresWetSignature) {
                    !this.isConfirmedOrCompleted(document);
                }
                return !common.string.isNullOrWhiteSpace(document.contentXml);
            } else {
                return !common.string.isEmptyGuidOrNull(repositoryId);
            }
        }
        public shouldPdfIconBeVisible = (document) => {
            var index = document.name.indexOf("ServiceCompleted");
            if (angular.isDefined(document.folderName) && !common.string.isNullOrWhiteSpace(document.folderName)) {
                return ((document.folderName == srv.folderName.Credit || document.folderName == srv.folderName.Audit) && index!=-1);
            }
            else {
                return false;
            }
        }
        //xml icon should not be shown for the disclosure events -  completed and confirmation
        public isConfirmedOrCompleted = (document) => {
            var splittedFolderName = name.split("_");
            var indexCompleted = document.name.indexOf("ServiceCompleted");
            var indexComfirmation = document.name.indexOf("Confirmation");
            
            if ((document.folderName == srv.folderName.DisclosuresApplicationDocument || document.folderName == srv.folderName.DisclosuresWetSignature)  && (indexComfirmation!=-1 || indexCompleted!=-1)) {
                    return true;
                }
                return false;
        }
        public downloadXmlDocument = (document, isResponse, isEvent) => {
            var downloadLink = this.getDocumentUrl(document, isResponse, isEvent);
            if (downloadLink != '') {
                window.open(downloadLink, '_blank', '');
            }
        }
        public getDocumentUrl = (document, isResponse, isEvent) => {
            if (document == null || document == '' || !angular.isDefined(document)) {
                return '';
            }
            var encodedEventId = encodeURIComponent(document.eventId);
            var encodedLoanId = encodeURIComponent(this.wrappedLoan.ref.loanId);
            var encodedLoanNumber = encodeURIComponent(this.wrappedLoan.ref.loanNumber);
            var encodedLogId = encodeURIComponent(document.id);
            var encodedEventId = encodeURIComponent(document.eventId);
            var encodedUserId = encodeURIComponent(this.applicationData.currentUserId);

            var encodedRepositoryId = encodeURIComponent(document.requestRepositoryId);
            if (isResponse) {
                encodedRepositoryId = encodeURIComponent(document.responseRepositoryId);
            }
            var url = '';
            if (document.folderName == srv.folderName.LOSEncompass || document.folderName == srv.folderName.FeesClosingCorp || document.folderName == srv.folderName.PricingOptimalBlue || document.folderName == srv.folderName.SigningeOriginal || document.folderName == srv.folderName.BiDirectionalEncompass || document.folderName == srv.folderName.CRMLead360 || document.folderName == srv.folderName.AppraisalLenderX) {
                url = '/Downloader.axd?documentType=logItem&loanId=' + encodedLoanId + "&loanNumber=" + encodedLoanNumber + "&logId=" + encodedLogId + "&eventId=" + encodedEventId + "&userId=" + encodedUserId + "&name=" + document.name;
            }
            else if ((((document.folderName == srv.folderName.DisclosuresApplicationDocument || document.folderName == srv.folderName.DisclosuresWetSignature) && encodedRepositoryId != lib.getEmptyGuid()) || document.folderName == srv.folderName.AusDl || document.folderName == srv.folderName.AusLp) && !isEvent) {
                url = '/Downloader.axd?documentType=repositoryItem&repositoryItemId=' + encodedRepositoryId;
            } else {
                url = '/Downloader.axd?documentType=LoanServiceContentXml&eventType=' + document.eventType + "&eventId=" + encodedEventId;
            }
           
            return url;
        }
    }
    angular.module('integrations').controller('integrationsController', IntegrationsController);
}  