/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var IncompleteDocumentsController = (function () {
        function IncompleteDocumentsController($scope) {
            this.$scope = $scope;
        }
        Object.defineProperty(IncompleteDocumentsController.prototype, "title", {
            get: function () {
                return "Incomplete Documents";
            },
            set: function (value) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        IncompleteDocumentsController.className = 'incompleteDocumentsController';
        IncompleteDocumentsController.$inject = ['$scope'];
        return IncompleteDocumentsController;
    })();
    directive.IncompleteDocumentsController = IncompleteDocumentsController;
    var IncompleteDocumentsDirective = (function () {
        function IncompleteDocumentsDirective() {
            this.controller = 'incompleteDocumentsController';
            this.controllerAs = 'incompleteDocumentsCntrl';
            this.transclude = true;
            this.restrict = 'EA';
            this.bindToController = false;
            this.scope = {
                form: '='
            };
            this.templateUrl = "/angular/consumersite/loanApp/documentUpload/incompleteDocuments.template.html";
        }
        IncompleteDocumentsDirective.createNew = function (args) {
            return new IncompleteDocumentsDirective();
        };
        IncompleteDocumentsDirective.className = 'incompleteDocuments';
        IncompleteDocumentsDirective.$inject = [];
        return IncompleteDocumentsDirective;
    })();
    directive.IncompleteDocumentsDirective = IncompleteDocumentsDirective;
    moduleRegistration.registerController(consumersite.moduleName, IncompleteDocumentsController);
    moduleRegistration.registerDirective(consumersite.moduleName, IncompleteDocumentsDirective);
})(directive || (directive = {}));
//# sourceMappingURL=incompleteDocuments.directive.js.map