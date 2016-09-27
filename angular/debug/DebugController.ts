/// <reference path='../../Scripts/typings/angularjs/angular.d.ts' />
/// <reference path='../../Scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts' />

class DebugController {

    static className = 'DebugController';
    static $inject = ['$modal'];

    constructor(private $modal: angular.ui.bootstrap.IModalService) {
    }

    showModuleData() : void {

        var allDIs: string[];

        angular.module('loanCenter')['_invokeQueue'].forEach(function (value) {
            allDIs.push(value[1] + ": " + value[2][0]);
        });

        this.$modal.open({ template: 'viewAngularApp.html' } );

    }
}
