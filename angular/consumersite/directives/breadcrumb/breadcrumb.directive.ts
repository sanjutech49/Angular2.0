/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />


module directive {

    export class BreadCrumbController {

        static className = 'breadCrumbController';

        static $inject = ['navigationService'];

        constructor(private navigationService: consumersite.UINavigationService) { }

        getPersonalLink = (): string => {
            //it is safe to always leave this link active as it is the first one.
            return this.navigationService.getBorrowerLink();
        }

        getPropertyLink = (): string => {
            //return an empty string if the user hasn't reached the property section
            if (this.navigationService.hasReachedProperty()) {
                return this.navigationService.getPropertyLink();
            } else {
                return '';
            }
        }

        getFinancialLink = (): string => {
            if (this.navigationService.hasReachedFinancial()) {
                return this.navigationService.getFinancialLink();
            } else {
                return '';
            }
        }

        getSummaryLink = (): string => {
            if (this.navigationService.hasReachedSummary()) {
                return this.navigationService.getSummaryLink();
            } else {
                return '';
            }
        }

        getCreditLink = (): string => {
            if (this.navigationService.hasReachedCredit()) {
                return this.navigationService.getCreditLink();
            } else {
                return '';
            }
        }

        getSuccessLink = (): string => {
            if (this.navigationService.hasReachedCompletion()) {
                return this.navigationService.getSuccessLink();
            } else {
                return '';
            }
        }

        hasReachedPersonal = () => {
            return this.navigationService.hasReachedPersonal();
        }

        isAtPersonal = () => {
            return this.navigationService.isAtPersonal();
        }

        hasReachedProperty = () => {
            return this.navigationService.hasReachedProperty();
        }

        isAtProperty = () => {
            return this.navigationService.isAtProperty();
        }

        hasReachedFinancial = () => {
            return this.navigationService.hasReachedFinancial();
        }

        isAtFinancial = () => {
            return this.navigationService.isAtFinancial();
        }

        hasReachedSummary = () => {
            return this.navigationService.hasReachedSummary();
        }

        isAtSummary = () => {
            return this.navigationService.isAtSummary();
        }

        hasReachedCredit = () => {
            return this.navigationService.hasReachedCredit();
        }

        isAtCredit = () => {
            return this.navigationService.isAtCredit();
        }

        hasReachedCompletion = () => {
            return this.navigationService.hasReachedCompletion();
        }

        isAtCompletion = () => {
            return this.navigationService.isAtCompletion();
        }

        finishFlagImageUrl = () => {
            if (this.navigationService.hasReachedCompletion()) {
                return "../../../Content/images/ConsumerSite/icon-finish-flag-green.png";
            } else {
                return "../../../Content/images/ConsumerSite/icon-finish-flag.png";
            }
        }
    }

    export class BreadCrumbDirective implements ng.IDirective {

        static className = 'breadCrumb';

        static $inject = [];

        constructor() { }

        static createNew(args: any[]): BreadCrumbDirective {
            return new BreadCrumbDirective();
        }

        controller = 'breadCrumbController';
        controllerAs = 'breadCrumbCntrl';
        transclude = true;
        restrict = 'E';
        templateUrl = "/angular/consumersite/directives/breadcrumb/breadcrumb.html";
    }

    moduleRegistration.registerController(consumersite.moduleName, BreadCrumbController);
    moduleRegistration.registerDirective(consumersite.moduleName, BreadCrumbDirective);
} 