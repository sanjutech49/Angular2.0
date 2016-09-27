/// <reference path="../../common/impdirectives.settings.ts" />

module inputdirectives.imptextarea {
    'use strict';

    interface IIMPTextAreaController {
        expandOnKeyUp(event: any): void;
        preventTextEnter(event: any): void;
        numberOfRows: number;
        numberOfCharactersPerRow: number;
    }

    class IMPTextAreaController implements IIMPTextAreaController {
        static $inject = [];

        constructor(public numberOfRows: number, public numberOfCharactersPerRow: number, public element: ng.IAugmentedJQuery, public textValue: string) {
            this.setInitialHeight(element, textValue);
        }

        /**
        * @desc: Function will set scrollHeight as a height of textarea on every keyup. This will help to expand height of textarea dynamically until limit is reached.
        */
        public expandOnKeyUp = (event: any): void => {
            this.calculateTextAreaHeight(event.target);
        }

        /**
        * @desc: Function will prevent entering new characters once limit is exceeded.
        */
        public preventTextEnter = (event: any): void => {
            if (this.getNumberOfCharactersInTextarea(event.target) == this.numberOfCharactersPerRow && event.keyCode != 8 && event.keyCode != 46) {
                $(event.target).parent().find('div#limitMessage').show();
                event.preventDefault();
            }
            else {
                $(event.target).parent().find('div#limitMessage').hide();
            }
        }

        /**
        * @desc: Function that will trigger on click of directive and will bind adititonal events to it
        */
        public bindEventsOnClick = (event: any): void  => {
            $(event.target).bind('keyup', this.expandOnKeyUp);
            if (!!this.numberOfCharactersPerRow) {
                $(event.target).bind('keydown', this.preventTextEnter);
            }
        }

        private getNumberOfCharactersInTextarea = (element: any): number => {
            return $(element).val().length;
        }

        private getNumberOfRows = (element: any): number => {
            return parseInt((parseInt(element.scrollHeight) / parseInt($(element).css('lineHeight'), 10)).toFixed());
        }

        private setInitialHeight(element: any, textValue: string) {
            var textArea = element.children()[0];
            $(textArea).val(textValue);
            this.calculateTextAreaHeight(textArea);
        }
        private calculateTextAreaHeight(element: any) {
            if (this.getNumberOfRows(element) > this.numberOfRows) {
                $(element).height((this.numberOfRows * 20) + 5);
                element.style.overflow = 'auto';
            } else {
                $(element).height(24);
                $(element).height(element.scrollHeight);
                element.style.overflow = 'hidden';
            }
        }
    }

    /**
    * @desc: Custom scope object that extends ng.IScope
    */
    interface IIMPTextareaScope extends ng.IScope {
        textareaSettings: impdirectives.settings.IIMPTextareaSettings;
        model: any;
        onClick: (event: any) => void;
    }

    /**
    * @desc: Body of the directive
    */
    function impTextArea(): ng.IDirective {
        return {
            restrict: 'E',
            require: 'ngModel',
            template: '<div><textarea class="imp-textarea" ng-model="model" ng-click="onClick($event)"></textarea><div id="limitMessage" style="display: none">{{textareaSettings.message}}</div></div>',
            replace: true,
            scope: {
                textareaSettings: '=?',
                model: '=ngModel'
            },
            link: (scope: IIMPTextareaScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes): void => {
                scope.textareaSettings = new impdirectives.settings.IMPTextareaSettings(scope.textareaSettings);
                var controller = new IMPTextAreaController(scope.textareaSettings.numberOfRows, scope.textareaSettings.numberOfCharacters, element, scope.model);
                scope.onClick = controller.bindEventsOnClick;
            }
        };
    }
    angular.module('inputDirectives').directive('impTextarea', impTextArea);
}