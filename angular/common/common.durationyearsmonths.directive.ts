//(function () {
//    'use strict';
//    angular.module('common')
//        .directive('impDurationYearsMonths', impDurationYearsMonths);

/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Services/scripts/ts/lib/DirectiveFactory.ts" />
/// <reference path="../../scripts/ts/global/global.ts" />

class DurationController {

    internal: {
        months: number;
        years: number;
    }
    months: number;
    years: number;

    updateModel = () => {
        this.years = this.internal.years;
        this.months = this.internal.months;
    }

    recalculate = () => {
        var time = CommonFactory.recalculateMonths(this.internal.years, this.internal.months);
        this.internal.years = time.years;
        this.internal.months = time.months;

        this.updateModel();
    }
}

class DurationYearsMonthsDirective implements ng.IDirective {
    /**
    * @desc Directive on Common module which displays duration in years and months. Months get recalculated into years if they are >12
    * @example <imp-duration-years-months years="property.years" months="property.months"></imp-duration-years-months>
    */

    restrict = 'E';
    // TODO: Replace classes from FeatureStyle.css with the ones from CommonStyle.css
    template = ['<div class="col-lg-5">',
        '<div class="imp-psection-label">{{::controller.label}}</div>',
        '</div>',
        '<div style="width: 28%;" class="col-lg-3 imp-psection-placeholder">',
        '<div class="imp-property-visible-placeholder">Years</div>',
        '<input style="width: 94%;" type="text" maxlength="2" ng-model="controller.internal.years" ng-blur="controller.recalculate()" imp-numeric />',
        '</div>',
        '<div style="width: 28%;" class="col-lg-3 imp-psection-placeholder">',
        '<div style="right:0px;" class="imp-property-visible-placeholder">Months</div>',
        '<input class="imp-psection-left-borderadius" type="text" maxlength="2" ng-model="controller.internal.months" ng-blur="controller.recalculate()" imp-numeric />',
        '</div>'
    ].join('');
    scope = {
        years: '=',
        months: '=',
        label: '@'
    };

    controller = new DurationController();
    controllerAs = 'controller';
    bindToController = true;

    link = (scope, element, attrs, controller: DurationController) => {

        // Use an internal copy of the model.           
        controller.internal = {
            years: controller.years,
            months: controller.months
        };

        // Recalculate in case the data from the server came unformatted.
        if (controller.months >= 12)
            controller.recalculate();
    };

    static Factory(): ng.IDirectiveFactory {
        return lib.DirectiveFactory(DurationYearsMonthsDirective);
    }
}

modules.registerDirective("impDurationYearsMonths", DurationYearsMonthsDirective.Factory);