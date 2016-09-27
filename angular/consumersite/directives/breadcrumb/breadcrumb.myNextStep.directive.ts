/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />


module directive {

    export class BreadCrumbMNSController {

        static className = 'breadCrumbMNSController';

        static $inject = ['navigationService'];

        constructor(private navigationService: consumersite.UINavigationService) { }

        getDisclosuresLink = (): string => {
            //it is safe to always leave this link active as it is the first one.
            return this.navigationService.getBorrowerLink();
        }

        getAppraisalLink = (): string => {
            //return an empty string if the user hasn't reached the property section
            if (this.navigationService.hasReachedProperty()) {
                return this.navigationService.getPropertyLink();
            } else {
                return '';
            }
        }

        getUploadLink = (): string => {
            if (this.navigationService.hasReachedFinancial()) {
                return this.navigationService.getFinancialLink();
            } else {
                return '';
            }
        }

        getSuccessLink = (): string => {
            return '';
        }

        hasReachedDisclosures = () => {
            return false;
        }

        isAtDisclosures = () => {
            return false;
        }

        hasReachedAppraisal = () => {
            return false;
        }

        isAtAppraisal = () => {
            return false;
        }

        hasReachedUpload = () => {
            return false;
        }

        isAtUpload = () => {
            return false;
        }

        hasReachedCompletion = () => {
            return false;
        }

        isAtCompletion = () => {
            return false;
        }

        finishFlagImageUrl = () => {
            if (false) {
                return "../../../Content/images/ConsumerSite/icon-finish-flag-green.png";
            } else {
                return "../../../Content/images/ConsumerSite/icon-finish-flag.png";
            }
        }
    }

    export class BreadCrumbMNSDirective implements ng.IDirective {

        static className = 'breadCrumbMyNextStep';

        static $inject = [];

        constructor() { }

        static createNew(args: any[]): BreadCrumbMNSDirective {
            return new BreadCrumbMNSDirective();
        }

        controller = 'breadCrumbMNSController';
        controllerAs = 'breadCrumbMNSCntrl';
        transclude = true;
        restrict = 'E';
        templateUrl = "/angular/consumersite/directives/breadcrumb/breadcrumb.myNextStep.html";
    }

    moduleRegistration.registerController(consumersite.moduleName, BreadCrumbMNSController);
    moduleRegistration.registerDirective(consumersite.moduleName, BreadCrumbMNSDirective);
} 