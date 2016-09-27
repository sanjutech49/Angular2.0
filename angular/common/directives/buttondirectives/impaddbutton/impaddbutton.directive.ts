module buttondirectives.addbutton {
    interface IAddButtonController { }

    interface IAddButtonScope extends ng.IScope { }

    class AddButtonController implements IAddButtonController {
        constructor() { }
    }

    function impAddButton(): ng.IDirective {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                buttonText: '=buttonText',
                eventHandler: '='
            },
            template: '<div ng-click="eventHandler()" class="imp-add-button"><imp-circle size="xsmall" color="#208DDC" is-plus="true"></imp-circle><div class="button-text">{{buttonText}}</div></div>',
            link: (scope: IAddButtonScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes): void => {
            }
        };
    }

    angular.module('impButtonDirectives').directive('impAddButton', impAddButton);
} 