var buttondirectives;
(function (buttondirectives) {
    var addbutton;
    (function (addbutton) {
        var AddButtonController = (function () {
            function AddButtonController() {
            }
            return AddButtonController;
        })();
        function impAddButton() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    buttonText: '=buttonText',
                    eventHandler: '='
                },
                template: '<div ng-click="eventHandler()" class="imp-add-button"><imp-circle size="xsmall" color="#208DDC" is-plus="true"></imp-circle><div class="button-text">{{buttonText}}</div></div>',
                link: function (scope, element, attributes) {
                }
            };
        }
        angular.module('impButtonDirectives').directive('impAddButton', impAddButton);
    })(addbutton = buttondirectives.addbutton || (buttondirectives.addbutton = {}));
})(buttondirectives || (buttondirectives = {}));
//# sourceMappingURL=impaddbutton.directive.js.map