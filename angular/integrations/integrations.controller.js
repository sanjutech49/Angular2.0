/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../ts/lib/referenceWrapper.ts" />
/// <reference path="integrations.service.ts" />
var integrationsServices;
(function (integrationsServices) {
    var controller;
    (function (controller) {
        'use strict';
        var IntegrationsController = (function () {
            function IntegrationsController(wrappedLoan, $state, navigationService, applicationData, enums, docVaultSvc, integrationsService) {
                var _this = this;
                this.wrappedLoan = wrappedLoan;
                this.$state = $state;
                this.navigationService = navigationService;
                this.applicationData = applicationData;
                this.enums = enums;
                this.docVaultSvc = docVaultSvc;
                this.integrationsService = integrationsService;
                this.showLoader = false;
                this.showErrorContainer = false;
                this.downloadDocument = function (document) {
                    if (document.documents != null) {
                        for (var key in document.documents)
                            _this.docVaultSvc.downloadDocument(key);
                    }
                };
                this.groupItems = function (items) {
                    _this.groupedEvents = new lib.referenceWrapper(_.groupBy(items, 'folderName'));
                };
                this.formatName = function (folderName, name) {
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
                    }
                    else if (folderName == srv.folderName.BiDirectionalEncompass || folderName == srv.folderName.AppraisalLenderX) {
                        nameWithoutDate = splittedFolderName[0];
                    }
                    else {
                        nameWithoutDate = name;
                    }
                    return nameWithoutDate;
                };
                this.shouldIconBeVisible = function (document, repositoryId, isEvent) {
                    if (isEvent) {
                        if (document.folderName == srv.folderName.LOSEncompass || document.folderName == srv.folderName.FeesClosingCorp || document.folderName == srv.folderName.PricingOptimalBlue || document.folderName == srv.folderName.SigningeOriginal || document.folderName == srv.folderName.BiDirectionalEncompass || document.folderName == srv.folderName.CRMLead360 || document.folderName == srv.folderName.AppraisalLenderX) {
                            return !common.string.isNullOrWhiteSpace(document.eventId);
                        }
                        else if (document.folderName == srv.folderName.DisclosuresApplicationDocument || document.folderName == srv.folderName.DisclosuresWetSignature) {
                            !_this.isConfirmedOrCompleted(document);
                        }
                        return !common.string.isNullOrWhiteSpace(document.contentXml);
                    }
                    else {
                        return !common.string.isEmptyGuidOrNull(repositoryId);
                    }
                };
                this.shouldPdfIconBeVisible = function (document) {
                    var index = document.name.indexOf("ServiceCompleted");
                    if (angular.isDefined(document.folderName) && !common.string.isNullOrWhiteSpace(document.folderName)) {
                        return ((document.folderName == srv.folderName.Credit || document.folderName == srv.folderName.Audit) && index != -1);
                    }
                    else {
                        return false;
                    }
                };
                //xml icon should not be shown for the disclosure events -  completed and confirmation
                this.isConfirmedOrCompleted = function (document) {
                    var splittedFolderName = name.split("_");
                    var indexCompleted = document.name.indexOf("ServiceCompleted");
                    var indexComfirmation = document.name.indexOf("Confirmation");
                    if ((document.folderName == srv.folderName.DisclosuresApplicationDocument || document.folderName == srv.folderName.DisclosuresWetSignature) && (indexComfirmation != -1 || indexCompleted != -1)) {
                        return true;
                    }
                    return false;
                };
                this.downloadXmlDocument = function (document, isResponse, isEvent) {
                    var downloadLink = _this.getDocumentUrl(document, isResponse, isEvent);
                    if (downloadLink != '') {
                        window.open(downloadLink, '_blank', '');
                    }
                };
                this.getDocumentUrl = function (document, isResponse, isEvent) {
                    if (document == null || document == '' || !angular.isDefined(document)) {
                        return '';
                    }
                    var encodedEventId = encodeURIComponent(document.eventId);
                    var encodedLoanId = encodeURIComponent(_this.wrappedLoan.ref.loanId);
                    var encodedLoanNumber = encodeURIComponent(_this.wrappedLoan.ref.loanNumber);
                    var encodedLogId = encodeURIComponent(document.id);
                    var encodedEventId = encodeURIComponent(document.eventId);
                    var encodedUserId = encodeURIComponent(_this.applicationData.currentUserId);
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
                    }
                    else {
                        url = '/Downloader.axd?documentType=LoanServiceContentXml&eventType=' + document.eventType + "&eventId=" + encodedEventId;
                    }
                    return url;
                };
                var vm = this;
                navigationService.contextualType = enums.ContextualTypes.Integrations;
                vm.showLoader = true;
                vm.showErrorContainer = false;
                vm.integrationsService.getIntegrationData(this.wrappedLoan.ref.loanId, this.applicationData.currentUserId).$promise.then(function (success) {
                    vm.groupItems(success.response.items);
                    vm.showLoader = false;
                }, function (error) {
                    console.error('Error on integrations - getIntegrationData. Error: ' + String(error));
                });
            }
            IntegrationsController.$inject = ['wrappedLoan', '$state', 'NavigationSvc', 'applicationData', 'enums', 'docVaultSvc', 'integrationsService'];
            return IntegrationsController;
        })();
        angular.module('integrations').controller('integrationsController', IntegrationsController);
    })(controller = integrationsServices.controller || (integrationsServices.controller = {}));
})(integrationsServices || (integrationsServices = {}));
//# sourceMappingURL=integrations.controller.js.map