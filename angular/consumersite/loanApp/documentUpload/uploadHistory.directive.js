/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var UploadHistoryController = (function () {
        function UploadHistoryController($scope) {
            this.$scope = $scope;
        }
        Object.defineProperty(UploadHistoryController.prototype, "title", {
            get: function () {
                return "Upload History";
            },
            set: function (value) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        UploadHistoryController.className = 'uploadHistoryController';
        UploadHistoryController.$inject = ['$scope'];
        return UploadHistoryController;
    })();
    directive.UploadHistoryController = UploadHistoryController;
    var UploadHistoryDirective = (function () {
        function UploadHistoryDirective() {
            this.controller = 'uploadHistoryController';
            this.controllerAs = 'uploadHistoryCntrl';
            this.transclude = true;
            this.restrict = 'EA';
            this.bindToController = false;
            this.scope = {
                form: '='
            };
            this.templateUrl = "/angular/consumersite/loanApp/documentUpload/uploadHistory.template.html";
        }
        UploadHistoryDirective.createNew = function (args) {
            return new UploadHistoryDirective();
        };
        UploadHistoryDirective.className = 'uploadHistory';
        UploadHistoryDirective.$inject = [];
        return UploadHistoryDirective;
    })();
    directive.UploadHistoryDirective = UploadHistoryDirective;
    moduleRegistration.registerController(consumersite.moduleName, UploadHistoryController);
    moduleRegistration.registerDirective(consumersite.moduleName, UploadHistoryDirective);
})(directive || (directive = {}));
//# sourceMappingURL=uploadHistory.directive.js.map