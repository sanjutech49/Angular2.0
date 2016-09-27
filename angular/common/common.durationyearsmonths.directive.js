(function () {
    'use strict';
    angular.module('common')
        .directive('impDurationYearsMonths', impDurationYearsMonths);

    /**
    * @desc Directive on Common module which displays duration in years and months. Months get recalculated into years if they are >12
    * @example <imp-duration-years-months years="property.years" months="property.months"></imp-duration-years-months>
    */
    function impDurationYearsMonths() {
        return {
            restrict: 'E',
            // TODO: Replace classes from FeatureStyle.css with the ones from CommonStyle.css
            template: ['<div class="col-lg-5">',
                            '<div class="imp-psection-label">{{::controller.label}}</div>',
                        '</div>',
                        '<div style="width: 28%;" class="col-lg-3 imp-psection-placeholder">',
                            '<div class="imp-property-visible-placeholder">Years</div>',
                            '<input style="width: 94%;" type="text" maxlength="2" ng-model="controller.internal.years" ng-blur="controller.recalculate()" imp-numeric ',
                            'ng-class="{\'imp-has-error\': (controller.validation.sixPicesCompleted && controller.validation.validate && ((!controller.internal.years && !controller.internal.months) || (controller.internal.years == 0 && controller.internal.months == 0)))}"',
                            '/>',
                        '</div>',
                        '<div style="width: 28%;" class="col-lg-3 imp-psection-placeholder">',
                            '<div style="right:0px;" class="imp-property-visible-placeholder">Months</div>',
                            '<input class="imp-psection-left-borderadius" type="text" maxlength="2" ng-model="controller.internal.months" ng-blur="controller.recalculate()" imp-numeric ',
                            'ng-class="{\'imp-has-error\': (controller.validation.sixPicesCompleted && controller.validation.validate && ((!controller.internal.years && !controller.internal.months) || (controller.internal.years == 0 && controller.internal.months == 0)))}"',
                            '/>',
                        '</div>'
            ].join(''),
            scope: {
                years: '=',
                months: '=',
                label: '@',
                validation: '='
            },
            link: link,
            controller: controller,
            controllerAs: 'controller',
            bindToController: true
        };

        function link(scope, element, attrs, controller) {

            // Use an internal copy of the model.           
            controller.internal = {
                years: controller.years,
                months: controller.months,
                sixPicesCompleted: controller.validation.sixPicesCompleted,
                validate: controller.validation.validate
            };

            // Recalculate in case the data from the server came unformatted.
            if (controller.months >= 12)
                controller.recalculate();
        };

        function controller(commonService) {
            var self = this;
            self.internal = {};
            self.recalculate = recalculate;
            self.updateModel = updateModel;

            function updateModel() {
                self.years = self.internal.years;
                self.months = self.internal.months;
            };

            function recalculate() {
                var time = commonService.recalculateMonths(Number(self.internal.years), Number(self.internal.months));
                self.internal.years = time.years;
                self.internal.months = time.months;

                self.updateModel();
            };
        };
    };
})();