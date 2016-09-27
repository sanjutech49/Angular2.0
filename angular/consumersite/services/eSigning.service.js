var consumersite;
(function (consumersite) {
    var ESigningService = (function () {
        function ESigningService($resource, apiRoot, $http, $q, $timeout, $log) {
            var _this = this;
            this.$resource = $resource;
            this.apiRoot = apiRoot;
            this.$http = $http;
            this.$q = $q;
            this.$timeout = $timeout;
            this.$log = $log;
            this.post = function (url, data) {
                var q = _this.$q.defer();
                var fullUrl = _this.apiRoot + url;
                _this.$http.post(fullUrl, data).success(function (response) {
                    console.log(response);
                    if (response.ErrMsg == null) {
                        q.resolve(response);
                    }
                    else {
                        q.reject(response);
                    }
                }.bind(_this)).error(function (error) {
                    console.log("Error");
                    console.log(error);
                    q.reject(error);
                }.bind(_this));
                return q.promise;
            };
            this.getMockAuthViewModel = function (loan) {
                return {
                    borrower: _this.getMockBorrowerViewModel(loan.loanApp.borrower),
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
                };
            };
        }
        ESigningService.prototype.getMockBorrowerViewModel = function (val) {
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
            };
        };
        ESigningService.className = 'eSigningService';
        ESigningService.$inject = ['$resource', 'apiRoot', '$http', '$q', '$timeout', '$log'];
        return ESigningService;
    })();
    consumersite.ESigningService = ESigningService;
    moduleRegistration.registerService(consumersite.moduleName, ESigningService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=eSigning.service.js.map