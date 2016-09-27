/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var RequestedDocumentsController = (function () {
        function RequestedDocumentsController($scope) {
            this.$scope = $scope;
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
        RequestedDocumentsController.$inject = ['$scope'];
        return RequestedDocumentsController;
    })();
    directive.RequestedDocumentsController = RequestedDocumentsController;
    var RequestedDocumentsDirective = (function () {
        function RequestedDocumentsDirective() {
            this.controller = 'requestedDocumentsController';
            this.controllerAs = 'requestedDocumentsCntrl';
            this.transclude = true;
            this.restrict = 'EA';
            this.bindToController = false;
            this.scope = {
                form: '='
            };
            this.templateUrl = "/angular/consumersite/loanApp/documentUpload/requestedDocuments.template.html";
        }
        RequestedDocumentsDirective.createNew = function (args) {
            return new RequestedDocumentsDirective();
        };
        RequestedDocumentsDirective.className = 'requestedDocuments';
        RequestedDocumentsDirective.$inject = [];
        return RequestedDocumentsDirective;
    })();
    directive.RequestedDocumentsDirective = RequestedDocumentsDirective;
    moduleRegistration.registerController(consumersite.moduleName, RequestedDocumentsController);
    moduleRegistration.registerDirective(consumersite.moduleName, RequestedDocumentsDirective);
})(directive || (directive = {}));
//# sourceMappingURL=requestedDocuments.directive.js.map