/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
module common.ui {

    export class ImpDdl implements ng.IDirective {

        static className = 'impDdl';
        static $inject = [];

        constructor() {
        }

        static createNew(args: any[]): ImpDdl {
            return new ImpDdl();
        }

        restrict = 'E';
        replace = false;
        scope = {
            ngModel: "=",
            items: "=",
            ngChange: "=",
            ngModelOptions: "=",
            ngClass: "="
        };
        templateUrl = "/angular/common/directives/templates/impddl.html";
    }

    moduleRegistration.registerDirective(moduleNames.common, ImpDdl);

    export class ImpInputCurrency implements ng.IDirective {

        static className = 'impInputCurrency';
        static $inject = [];

        constructor() {
        }

        static createNew(args: any[]): ImpInputCurrency {
            return new ImpInputCurrency();
        }

        restrict = 'E';
        replace = true;
        scope = false;
        templateUrl = "/angular/common/directives/templates/impinputcurrency.html";
    }

    moduleRegistration.registerDirective(moduleNames.common, ImpInputCurrency);

    export class ImpInput implements ng.IDirective {

        static className = 'impInput';
        static $inject = [];

        constructor() {
        }

        static createNew(args: any[]): ImpInput {
            return new ImpInput();
        }

        restrict = 'E';
        replace = true;
        scope = false;
        templateUrl = "/angular/common/directives/templates/impinput.html";
    }

    moduleRegistration.registerDirective(moduleNames.common, ImpInput);
} 