(function () {
    'use strict';

    angular.module('multiborrowerPopover')
        .directive('mbList', mbList)
        .directive('mbPopover', ['modalPopoverFactory', mbPopover]);

    /**
    * @desc Selectable multi-borrower list.
    * @example <mb-list ng-model="loanDetails.vm.borrowers"></mb-list>
    */
    function mbList() {
        return {
            restrict: 'E',
            require: 'ngModel',
            replace: true,
            scope: {
                model: '=ngModel',
                borrower: '='
            },
            transclude: true,
            templateUrl: 'angular/loandetails/multiborrowerpopover/multiborrowerList.html',
            bindToController: true,
            controller: controller,
            controllerAs: 'mbList'
        };

        function controller() {
            var self = this;

            self.setBorrower = setBorrower;
            self.isClicked = isClicked;

            function setBorrower(bor) {
                self.borrower = bor;
            }

            function isClicked(bor) {
                return self.borrower === bor;
            }
        }
    }

    /**
    * @desc Modal popover for the multi-borrower details. Left section is an <mb-list>, 
    *   and the right section is a placeholder for an injectabe template.
    * @example <div mb-popover="angular/loandetails/multiborrowerpopover/test.html" ng-model="loanDetails.borrowers">Click Here</div>
    */
    function mbPopover(modalPopoverFactory) {
        return {
            restrict: 'A',
            bindToController: true,
            controller: controller,
            controllerAs: 'multiborrowerPopover"',
            link: link
        };

        function link(scope, element, attrs, controller) {
            element.bind("click", openPopover);

            controller.template = attrs.mbPopover;
            controller.model = scope.$eval(attrs.ngModel);
            controller.title = attrs.mbPopoverTitle;

            function openPopover(event) {
                modalPopoverFactory.openModalPopover('angular/loandetails/multiborrowerpopover/multiborrowerpopover.html', controller, null, event);
            }
        }

        function controller() {
            var self = this;
        }

    }

})();
