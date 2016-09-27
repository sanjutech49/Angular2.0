/// <reference path='../../Scripts/typings/angularjs/angular.d.ts'/>
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../ts/lib/referenceWrapper.ts" />
	

module docusign
{
    export interface ILoanResolver {
        resolveLoan(docusignSVC: IDocusignService, httpUIStatusService: any, $q: ng.IQService): cls.LoanViewModel | ng.IPromise<cls.LoanViewModel>;
    }
 
    class LoanResolver implements ILoanResolver {
        private wrappedLoan: cls.LoanViewModel;

        resolveLoan = (docusignSVC: IDocusignService, HttpUIStatusService: any, $q: ng.IQService): cls.LoanViewModel | ng.IPromise<cls.LoanViewModel> => {

            return HttpUIStatusService.load('Loading Loan...', function (happyPath, unhappyPath) {
                return docusignSVC.loan().get({
                    loanId:        docusignSVC.authenticationContext.loanId, 
                    userAccountId: docusignSVC.authenticationContext.borrower.userAccountId
                }).$promise.then(happyPath, unhappyPath);
            }, function (loan) {
                    var wrappedLoan: lib.referenceWrapper<cls.LoanViewModel> = new lib.referenceWrapper<cls.LoanViewModel>(loan);

                    this.docusignSVC.log('loan successfully created = ' + (docusignSVC.authenticationContext.loanId));
                    
                    //Setting the loanViewModel within the service
                    docusignSVC.wrappedLoan = wrappedLoan;
                    this.docusignSVC.log(docusignSVC.wrappedLoan.ref);

                    return wrappedLoan;
                }, function (error) {
                    $q.reject(error);
                    this.docusignSVC.log('loan load failure: ' + docusignSVC.authenticationContext.loanId + ' ' + error, 'error');
            }, docusignSVC.authenticationContext.loanId != null);        }
    }

    angular.module("docusign").service("loanResolver", LoanResolver);
}