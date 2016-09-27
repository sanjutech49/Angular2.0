/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />

//Jacob Nix - 01/05/2016
//A directive that accepts a single value to compare the elements ngModel value to.
//
//<input class="blah input bluh" input-match="passwordOne" ngModel="passwordTwo"></input>
//
//Preferred method would have been to throw the validators as shown, that functionality is
//still present.  However, classing issue forced developer add/remove defined error thrown classes.

module directive {

    //Not happy about this, but if I want to use "compareTo" and it be typescript compliant it is required.
    export interface IModelValidators extends ng.IModelValidators {
        comparedTo: (modelValue: any, viewValue: any) => boolean;
    }

    export interface INgModelController extends ng.INgModelController {
        $validators: IModelValidators;
    }


    export class InputMatchDirective implements ng.IDirective {

        static className = 'inputMatch';

        static $inject = [];

        constructor() { }

        static createNew(args: any[]): InputMatchDirective {
            return new InputMatchDirective();
        }

        require = 'ngModel';

        scope = {
            inputMatch: "=",
        };

        link = ($scope: any, element: ng.IAugmentedJQuery, attr: ng.IAttributes, ngModel: INgModelController) => {
            
            var errorClasses: string = 'input-match';

            ngModel.$validators.comparedTo = (modelValue) => {

                if (element.parent().hasClass(errorClasses)) {
                    element.parent().removeClass(errorClasses);
                }

                if (ngModel.$dirty && (modelValue != $scope.inputMatch)) {
                    element.parent().addClass(errorClasses);
                    return false;
                }

                return true;
            }

            $scope.$watch('inputMatch', () => {
                ngModel.$validate();
            });

        }
    }

    moduleRegistration.registerDirective(consumersite.moduleName, InputMatchDirective);
}