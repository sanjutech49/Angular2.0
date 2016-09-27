(function () {
    'use strict';

    angular.module('docVault')
        .provider('docVaultResolver', docVaultResolver);

    function docVaultResolver() {
        this.$get = function ($q) {        
            this.q = $q;
            return resolver.bind(this);
        };

        function resolver(docVaultSvc, applicationData, wrappedLoan, commonModalWindowFactory, modalWindowType) {
            if (wrappedLoan.ref.documents.documentsLoaded)
                return wrappedLoan;

            commonModalWindowFactory.open({ type: modalWindowType.loader, message: "Loading Documents..." });
            
            var documents = { docVaultDocuments: [] };
            var promises = [];

            angular.forEach(wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                promises.push(docVaultSvc.DocumentsServices.GetDocVaultData({ loanId: loanApplication.loanApplicationId, userAccountId: applicationData.currentUserId }).$promise);
            });

            return this.q.all(promises).then(function (data) {
                angular.forEach(data, function (object) {
                    documents.docVaultDocuments = documents.docVaultDocuments.concat(object.docVaultDocuments);
                })

                wrappedLoan.ref.documents = documents;
                wrappedLoan.ref.documents.documentsLoaded = true;
                commonModalWindowFactory.close();
                return wrappedLoan;
            });
        }
    }
})();