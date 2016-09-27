module consumersite {

    export interface IESigningPreparation {
        continueButtonText: string;
        isSigningRoomReady: boolean;
        signingRoomErrorMsg: string;
    }

    export class ESigningService {

        static className = 'eSigningService';

        public static $inject = ['$resource', 'apiRoot', '$http', '$q', '$timeout', '$log'];

        private authViewModel: cls.SecureLinkAuthenticationViewModel;

        constructor(
            private $resource: ng.resource.IResourceService,
            private apiRoot: string,
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private $timeout: ng.ITimeoutService,
            private $log: ng.ILogService) {

        }

        


        public post = <T>(url: string, data: any): ng.IPromise<T> => {
            var q = this.$q.defer();

            var fullUrl = this.apiRoot + url;
            this.$http.post(fullUrl, data).success(function (response: any) {
                console.log(response);
                if (response.ErrMsg == null) {
                    q.resolve(response);
                } else {
                    q.reject(response);
                }
            }.bind(this)).error(function (error) {
                console.log("Error");
                console.log(error);
                q.reject(error);
            }.bind(this));

            return q.promise;
        }

        public getMockAuthViewModel = (loan: vm.Loan): cls.SecureLinkAuthenticationViewModel => {
            return {
                borrower: this.getMockBorrowerViewModel(loan.loanApp.borrower),
                coBorrower: null,
                isBorrowerContinueWithout: true,
                hasCoBorrower: false,
                isCoBorrowerContinueWithout: false,
                isContinueWithoutLogin: true,

                loanApplicationId: loan.loanApp.loanApplicationId,
                //loanApplicationId: "b3771a36-1193-4ec4-b4c8-5223620841a9",
                ////@TODO SET THIS PROPERLY
                //loanId: "b3771a36-1193-4ec4-b4c8-5223620841a9",
                loanId: loan.getLoan().loanId,

                loEmail: "LoanOfficer@email.mail",
                token: ""
            }
        }

        private getMockBorrowerViewModel(val: vm.Borrower): cls.SecureLinkBorrowerViewModel {
            return {
                borrowerId: val.borrowerId,
                continueWithoutText: "Are you serious right now?",
                email: val.email,
                fullName: val.fullName,
                inputPIN: "0000",
                isAuthenticated: true,
                showContinueWithoutLink: false,
                //@TODO SET THIS PROPERLY
                // userAccountId: 82313
                userAccountId: val.userAccountId,
            }
        }
    }

    moduleRegistration.registerService(consumersite.moduleName, ESigningService);
}
