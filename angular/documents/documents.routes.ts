((): void => {
    'use strict';

    angular.module('documents').config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider: any): void {
        $stateProvider
            .state('loanCenter.loan.documents', {
                url: '/documents',
                views: {
                    'documents': {
                        templateUrl: '/angular/documents/documents.html',
                        controller: 'documentsController as documentsCtrl'
                    }
                },
                resolve: { // todo (bcb) we need this to resolve before going to the target screen, but reassigned of the wrappedLoan,
                    // even if it is the same reference, is not the best pattern  
                    wrappedLoan: function (docVaultResolver, docVaultSvc, applicationData, wrappedLoan, commonModalWindowFactory, modalWindowType) {
                        return docVaultResolver(docVaultSvc, applicationData, wrappedLoan, commonModalWindowFactory, modalWindowType);
                    }
                }
            })
            .state('loanCenter.loan.documents.needslist', {
                url: '/needslist',
                views: {
                    'documentsContent': {
                        templateUrl: '/angular/documents/needslist/needslist.html',
                        controller: 'needslistController as needslistCtrl'
                    }
                },
                resolve: {
                }
            })
            .state('loanCenter.loan.documents.docvault', {
                url: '/docvault',
                views: {
                    'documentsContent': {
                        templateUrl: '/angular/documents/docvault/docvaultcontent.html',
                        controller: 'docVaultController as docVault'
                    }
                },
                resolve: {
                }
            })
    }
})();

