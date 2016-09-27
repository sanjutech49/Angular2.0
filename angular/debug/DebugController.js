/// <reference path='../../Scripts/typings/angularjs/angular.d.ts' />
/// <reference path='../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts' />
var DebugController = (function () {
    function DebugController($modal) {
        this.$modal = $modal;
    }
    DebugController.prototype.showModuleData = function () {
        var allDIs;
        angular.module('loanCenter')['_invokeQueue'].forEach(function (value) {
            allDIs.push(value[1] + ": " + value[2][0]);
        });
        this.$modal.open({ template: 'viewAngularApp.html' });
    };
    DebugController.className = 'DebugController';
    DebugController.$inject = ['$modal'];
    return DebugController;
})();
//# sourceMappingURL=DebugController.js.map