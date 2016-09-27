/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path='providers/uiNavigation.provider.ts' />

module consumersite {

    export class ConsumerSiteController {

        public pageLoader: navigation.INavigationState[];

        static className = "consumerSiteController";

        public static $inject = ['$state', 'uiNavigation'];

        constructor(private $state: ng.ui.IStateService, private uiNavigation: () => navigation.INavigationState[]) {
            this.pageLoader = uiNavigation();
        }

        goToState = (stateName: string) => {
            return this.$state.href(stateName);
        }
    }
    moduleRegistration.registerController(moduleName, ConsumerSiteController);
} 