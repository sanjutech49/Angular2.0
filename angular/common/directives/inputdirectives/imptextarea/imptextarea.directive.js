/// <reference path="../../common/impdirectives.settings.ts" />
var inputdirectives;
(function (inputdirectives) {
    var imptextarea;
    (function (imptextarea) {
        'use strict';
        var IMPTextAreaController = (function () {
            function IMPTextAreaController(numberOfRows, numberOfCharactersPerRow, element, textValue) {
                var _this = this;
                this.numberOfRows = numberOfRows;
                this.numberOfCharactersPerRow = numberOfCharactersPerRow;
                this.element = element;
                this.textValue = textValue;
                /**
                * @desc: Function will set scrollHeight as a height of textarea on every keyup. This will help to expand height of textarea dynamically until limit is reached.
                */
                this.expandOnKeyUp = function (event) {
                    _this.calculateTextAreaHeight(event.target);
                };
                /**
                * @desc: Function will prevent entering new characters once limit is exceeded.
                */
                this.preventTextEnter = function (event) {
                    if (_this.getNumberOfCharactersInTextarea(event.target) == _this.numberOfCharactersPerRow && event.keyCode != 8 && event.keyCode != 46) {
                        $(event.target).parent().find('div#limitMessage').show();
                        event.preventDefault();
                    }
                    else {
                        $(event.target).parent().find('div#limitMessage').hide();
                    }
                };
                /**
                * @desc: Function that will trigger on click of directive and will bind adititonal events to it
                */
                this.bindEventsOnClick = function (event) {
                    $(event.target).bind('keyup', _this.expandOnKeyUp);
                    if (!!_this.numberOfCharactersPerRow) {
                        $(event.target).bind('keydown', _this.preventTextEnter);
                    }
                };
                this.getNumberOfCharactersInTextarea = function (element) {
                    return $(element).val().length;
                };
                this.getNumberOfRows = function (element) {
                    return parseInt((parseInt(element.scrollHeight) / parseInt($(element).css('lineHeight'), 10)).toFixed());
                };
                this.setInitialHeight(element, textValue);
            }
            IMPTextAreaController.prototype.setInitialHeight = function (element, textValue) {
                var textArea = element.children()[0];
                $(textArea).val(textValue);
                this.calculateTextAreaHeight(textArea);
            };
            IMPTextAreaController.prototype.calculateTextAreaHeight = function (element) {
                if (this.getNumberOfRows(element) > this.numberOfRows) {
                    $(element).height((this.numberOfRows * 20) + 5);
                    element.style.overflow = 'auto';
                }
                else {
                    $(element).height(24);
                    $(element).height(element.scrollHeight);
                    element.style.overflow = 'hidden';
                }
            };
            IMPTextAreaController.$inject = [];
            return IMPTextAreaController;
        })();
        /**
        * @desc: Body of the directive
        */
        function impTextArea() {
            return {
                restrict: 'E',
                require: 'ngModel',
                template: '<div><textarea class="imp-textarea" ng-model="model" ng-click="onClick($event)"></textarea><div id="limitMessage" style="display: none">{{textareaSettings.message}}</div></div>',
                replace: true,
                scope: {
                    textareaSettings: '=?',
                    model: '=ngModel'
                },
                link: function (scope, element, attributes) {
                    scope.textareaSettings = new impdirectives.settings.IMPTextareaSettings(scope.textareaSettings);
                    var controller = new IMPTextAreaController(scope.textareaSettings.numberOfRows, scope.textareaSettings.numberOfCharacters, element, scope.model);
                    scope.onClick = controller.bindEventsOnClick;
                }
            };
        }
        angular.module('inputDirectives').directive('impTextarea', impTextArea);
    })(imptextarea = inputdirectives.imptextarea || (inputdirectives.imptextarea = {}));
})(inputdirectives || (inputdirectives = {}));
//# sourceMappingURL=imptextarea.directive.js.map