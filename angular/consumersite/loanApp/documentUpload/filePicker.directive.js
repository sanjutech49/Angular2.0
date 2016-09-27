/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var FilePickerController = (function () {
        function FilePickerController($scope) {
            this.$scope = $scope;
        }
        Object.defineProperty(FilePickerController.prototype, "title", {
            get: function () {
                return "Choose Files to Send";
            },
            set: function (value) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        FilePickerController.className = 'filePickerController';
        FilePickerController.$inject = ['$scope'];
        return FilePickerController;
    })();
    directive.FilePickerController = FilePickerController;
    var FilePickerDirective = (function () {
        function FilePickerDirective() {
            this.controller = 'filePickerController';
            this.controllerAs = 'filePickerCntrl';
            this.transclude = true;
            this.restrict = 'EA';
            this.bindToController = false;
            this.scope = {
                form: '='
            };
            this.templateUrl = "/angular/consumersite/loanApp/documentUpload/filePicker.template.html";
        }
        FilePickerDirective.createNew = function (args) {
            return new FilePickerDirective();
        };
        FilePickerDirective.className = 'filePicker';
        FilePickerDirective.$inject = [];
        return FilePickerDirective;
    })();
    directive.FilePickerDirective = FilePickerDirective;
    moduleRegistration.registerController(consumersite.moduleName, FilePickerController);
    moduleRegistration.registerDirective(consumersite.moduleName, FilePickerDirective);
})(directive || (directive = {}));
//# sourceMappingURL=filePicker.directive.js.map