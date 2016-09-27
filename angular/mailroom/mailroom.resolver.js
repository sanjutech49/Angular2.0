var mailroom;
(function (mailroom) {
    var mailroomResolver = (function () {
        function mailroomResolver() {
            var _this = this;
            this.$get = function () {
                return _this.resolver.bind(_this);
            };
            this.resolver = function (docVaultResolver, docVaultSvc, loanService, $stateParams, HttpUIStatusService, BroadcastSvc, applicationData, $filter, $q, mailroomService) {
                var d = $q.defer();
                console.log('loading loan: ' + $stateParams.loanId ? $stateParams.loanId : '(new)');
                HttpUIStatusService.load('Loading Loan...', function (happyPath, unhappyPath) {
                    var loanId;
                    if ($stateParams.parentLoanId)
                        loanId = $stateParams.parentLoanId;
                    else
                        loanId = $stateParams.loanId;
                    return loanService.loan().get({ loanId: loanId, userAccountId: applicationData.currentUserId }).$promise.then(happyPath, unhappyPath);
                }, function (loan) {
                    // we need to show here additional loader 
                    var wrappedLoan = new lib.referenceWrapper(new cls.LoanViewModel(loan, $filter, true)); //applicationData.currentUser.isWholesale
                    if (wrappedLoan.ref.documents.documentsLoaded)
                        return wrappedLoan;
                    var documents;
                    var promises = [];
                    angular.forEach(wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                        promises.push(docVaultSvc.DocumentsServices.GetDocVaultData({ loanId: loanApplication.loanApplicationId, userAccountId: applicationData.currentUserId }).$promise);
                    });
                    return $q.all(promises).then(function (data) {
                        angular.forEach(data, function (object) {
                            wrappedLoan.ref.documents.docVaultDocuments = wrappedLoan.ref.documents.docVaultDocuments.concat(object.docVaultDocuments);
                        });
                        //wrappedLoan.ref.documents = documents;
                        wrappedLoan.ref.documents.documentsLoaded = true;
                        return d.resolve(wrappedLoan);
                    });
                }, function (error) {
                    console.log('loan load failure: ' + $stateParams.loanId + ' ' + error);
                }, $stateParams.loanId != null);
                return d.promise;
            };
        }
        return mailroomResolver;
    })();
    mailroom.mailroomResolver = mailroomResolver;
    angular.module('mailroom').provider('mailroomResolver', mailroomResolver);
})(mailroom || (mailroom = {}));
//# sourceMappingURL=mailroom.resolver.js.map