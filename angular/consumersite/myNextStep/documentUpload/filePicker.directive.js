/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var FilePickerDirective = (function () {
        function FilePickerDirective() {
            this.controller = 'filePickerController';
            this.controllerAs = 'filePickerCntrl';
            this.transclude = true;
            this.restrict = 'E';
            //template = "<button class='{{pickerclass}}' ng-click='pickFiles()'>Choose Files</button>";
            this.bindToController = false;
            this.scope = {};
        }
        FilePickerDirective.createNew = function (args) {
            return new FilePickerDirective();
        };
        FilePickerDirective.className = 'filePicker';
        FilePickerDirective.$inject = [];
        return FilePickerDirective;
    })();
    directive.FilePickerDirective = FilePickerDirective;
    moduleRegistration.registerDirective(consumersite.moduleName, FilePickerDirective);
})(directive || (directive = {}));
//# sourceMappingURL=filePicker.directive.js.map