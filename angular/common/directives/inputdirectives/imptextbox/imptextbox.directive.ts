/// <reference path="../../common/impdirectives.settings.ts" />

module inputdirectives.imptextbox{
    interface IIMPTextboxController {
        getActiveClassName(descriptionExists: boolean): string;
    }

    interface IIMPTextboxScope extends ng.IScope {
        model: any;
        textboxSettings: impdirectives.settings.IIMPTextboxSettings;
        getActiveClassName: () => string;
    }

    class IMPTextboxController implements IIMPTextboxController {
        constructor(public descriptionExists: string) { }

        public getActiveClassName = (): string => {
            if (!this.descriptionExists) {
                return 'no-description';
            }
        }
    }

    function impTextBox(): ng.IDirective {
        return {
            restrict: 'E',
            template: "<div class='imp-textbox-directive'><input type='text' ng-model='model' ng-class='getActiveClassName()'/><div ng-if='textboxSettings.textboxDescription'>{{textboxSettings.textboxDescription}}</div></div>",
            scope: {
                model: '=ngModel',
                textboxSettings: '=?'
            },
            link: (scope: IIMPTextboxScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes): void => {
                scope.textboxSettings = new impdirectives.settings.IMPTextboxSettings(scope.textboxSettings);
                var controller = new IMPTextboxController(scope.textboxSettings.textboxDescription);
                scope.getActiveClassName = controller.getActiveClassName;
            }
        };
    }

    angular.module('inputDirectives').directive('impTextbox', impTextBox);
}