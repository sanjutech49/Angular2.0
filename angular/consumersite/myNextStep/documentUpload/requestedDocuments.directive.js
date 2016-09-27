/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var consumersite;
(function (consumersite) {
    var RequestedDocumentsController = (function () {
        function RequestedDocumentsController($scope, loan, loanAppPageContext, consumerLoanService, $filter, applicationData) {
            var _this = this;
            this.$scope = $scope;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.consumerLoanService = consumerLoanService;
            this.$filter = $filter;
            this.applicationData = applicationData;
            this.loadLoan = function (loanId) {
                _this.consumerLoanService.loadLoan(loanId, _this.successLoadLoan, _this.errorLoadLoan);
            };
            this.successLoadLoan = function (loan) {
                // var wrappedLoan = new lib.referenceWrapper(new cls.LoanViewModel(loan, $filter, applicationData.currentUser.isWholesale));  Just for guidance
                var loanCls = new cls.LoanViewModel(loan, _this.$filter, false);
                _this.loan = new consumersite.vm.Loan(_this.applicationData, loanCls);
                _this.loan.loanApp.documents;
            };
            this.errorLoadLoan = function (notLoan) {
            };
            this._requestedDocuments = [];
            this.loadLoan('9E282079-112E-4865-BC1F-DE37CC11C274');
        }
        Object.defineProperty(RequestedDocumentsController.prototype, "title", {
            get: function () {
                return "Review My List of Requested Documents";
            },
            set: function (value) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        RequestedDocumentsController.className = 'requestedDocumentsController';
        RequestedDocumentsController.$inject = ['$scope', 'loan', 'loanAppPageContext', 'consumerLoanService', '$filter', 'applicationData'];
        return RequestedDocumentsController;
    })();
    consumersite.RequestedDocumentsController = RequestedDocumentsController;
    var RequestedDocumentsDirective = (function () {
        function RequestedDocumentsDirective() {
            this.controller = 'requestedDocumentsController';
            this.controllerAs = 'requestedDocumentsCntrl';
            this.transclude = true;
            this.restrict = 'EA';
            this.bindToController = false;
            this.scope = {
                toShow: '='
            };
            this.templateUrl = "/angular/consumersite/myNextStep/documentUpload/requestedDocuments.template.html";
        }
        RequestedDocumentsDirective.createNew = function (args) {
            return new RequestedDocumentsDirective();
        };
        RequestedDocumentsDirective.className = 'requestedDocuments';
        RequestedDocumentsDirective.$inject = [];
        return RequestedDocumentsDirective;
    })();
    consumersite.RequestedDocumentsDirective = RequestedDocumentsDirective;
    moduleRegistration.registerController(consumersite.moduleName, RequestedDocumentsController);
    moduleRegistration.registerDirective(consumersite.moduleName, RequestedDocumentsDirective);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=requestedDocuments.directive.js.map