/// <reference path="../../common/impdirectives.settings.ts" />
var inputdirectives;
(function (inputdirectives) {
    var imptextbox;
    (function (imptextbox) {
        var IMPTextboxController = (function () {
            function IMPTextboxController(descriptionExists) {
                var _this = this;
                this.descriptionExists = descriptionExists;
                this.getActiveClassName = function () {
                    if (!_this.descriptionExists) {
                        return 'no-description';
                    }
                };
            }
            return IMPTextboxController;
        })();
        function impTextBox() {
            return {
                restrict: 'E',
                template: "<div class='imp-textbox-directive'><input type='text' ng-model='model' ng-class='getActiveClassName()'/><div ng-if='textboxSettings.textboxDescription'>{{textboxSettings.textboxDescription}}</div></div>",
                scope: {
                    model: '=ngModel',
                    textboxSettings: '=?'
                },
                link: function (scope, element, attributes) {
                    scope.textboxSettings = new impdirectives.settings.IMPTextboxSettings(scope.textboxSettings);
                    var controller = new IMPTextboxController(scope.textboxSettings.textboxDescription);
                    scope.getActiveClassName = controller.getActiveClassName;
                }
            };
        }
        angular.module('inputDirectives').directive('impTextbox', impTextBox);
    })(imptextbox = inputdirectives.imptextbox || (inputdirectives.imptextbox = {}));
})(inputdirectives || (inputdirectives = {}));
//# sourceMappingURL=imptextbox.directive.js.map