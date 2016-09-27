/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />


module directive {

    export class BackController {

        static className = 'backController';
        static $inject = ['navigationService'];

        constructor(private navigationService: consumersite.UINavigationService) {
        }

        goToPreviousState = (): void => {
            this.navigationService.back();
        }

        showBackButton = (): boolean => {
            return this.navigationService.canGoBack();
        }
    }

    export class BackDirective implements ng.IDirective {

        static className = 'backButton';
        static $inject = [];

        constructor() {
        }

         static createNew(args: any[]): BackDirective {
            return new BackDirective();
        }

        controller = 'backController';
        controllerAs = 'backCntrl';
        transclude = true;
        restrict = 'E';
        bindToController = false;
        templateUrl = "/angular/consumersite/directives/back/back.template.html";
    }

    moduleRegistration.registerController(consumersite.moduleName, BackController);
    moduleRegistration.registerDirective(consumersite.moduleName, BackDirective);
} 