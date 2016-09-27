/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />


module directive {

    interface UINavigate {
        form: any;
    }

    export class SaveContinueController {

        private alertCannotNavigate: boolean;
        private buttonClicked: boolean;

        static className = 'saveContinueController';

        static $inject = ['navigationService', '$scope'];


        constructor(private navigationService: consumersite.UINavigationService, private $scope: UINavigate) {
        }

        getNavigationDisplayName = (): string => {
            return this.navigationService.getNavigationDisplayName();
        }

        goToNextState = () => {         
            if (this.$scope.form.$valid) {
                this.navigationService.next();
            }
            else {
                for (var key in this.$scope.form.$error) {
                    for (var i = 0; i < this.$scope.form.$error[key].length; i++) {
                        this.$scope.form.$error[key][i].$setTouched();
                    }
                }
            }
        }

        alertVisible = () => {
            if (this.buttonClicked) {//after the button has been clicked and this has been set as true once, sync it with the canNavigate
                this.alertCannotNavigate = !this.$scope.form.$valid;
            }
            return this.alertCannotNavigate;
        }
    }

    export class SaveContinueDirective implements ng.IDirective {

        static className = 'saveContinue';
        static $inject = [];

        constructor() { }

        static createNew(args: any[]): SaveContinueDirective {
            return new SaveContinueDirective();
        }

        //controller = ($scope: UINavigate) => {
        //    return new SaveContinueController(this.navigationService, $scope);
        //}

        controller = 'saveContinueController';
        controllerAs = 'saveContCntrl';
        transclude = true;
        restrict = 'E';
        bindToController = false;
        scope: any = {
            form: '='
        };

        templateUrl = "/angular/consumersite/directives/savecontinue/savecontinue.template.html";
    }

    moduleRegistration.registerController(consumersite.moduleName, SaveContinueController);
    moduleRegistration.registerDirective(consumersite.moduleName, SaveContinueDirective);
} 