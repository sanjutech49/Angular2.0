/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var BreadCrumbController = (function () {
        function BreadCrumbController(navigationService) {
            var _this = this;
            this.navigationService = navigationService;
            this.getPersonalLink = function () {
                //it is safe to always leave this link active as it is the first one.
                return _this.navigationService.getBorrowerLink();
            };
            this.getPropertyLink = function () {
                //return an empty string if the user hasn't reached the property section
                if (_this.navigationService.hasReachedProperty()) {
                    return _this.navigationService.getPropertyLink();
                }
                else {
                    return '';
                }
            };
            this.getFinancialLink = function () {
                if (_this.navigationService.hasReachedFinancial()) {
                    return _this.navigationService.getFinancialLink();
                }
                else {
                    return '';
                }
            };
            this.getSummaryLink = function () {
                if (_this.navigationService.hasReachedSummary()) {
                    return _this.navigationService.getSummaryLink();
                }
                else {
                    return '';
                }
            };
            this.getCreditLink = function () {
                if (_this.navigationService.hasReachedCredit()) {
                    return _this.navigationService.getCreditLink();
                }
                else {
                    return '';
                }
            };
            this.getSuccessLink = function () {
                if (_this.navigationService.hasReachedCompletion()) {
                    return _this.navigationService.getSuccessLink();
                }
                else {
                    return '';
                }
            };
            this.hasReachedPersonal = function () {
                return _this.navigationService.hasReachedPersonal();
            };
            this.isAtPersonal = function () {
                return _this.navigationService.isAtPersonal();
            };
            this.hasReachedProperty = function () {
                return _this.navigationService.hasReachedProperty();
            };
            this.isAtProperty = function () {
                return _this.navigationService.isAtProperty();
            };
            this.hasReachedFinancial = function () {
                return _this.navigationService.hasReachedFinancial();
            };
            this.isAtFinancial = function () {
                return _this.navigationService.isAtFinancial();
            };
            this.hasReachedSummary = function () {
                return _this.navigationService.hasReachedSummary();
            };
            this.isAtSummary = function () {
                return _this.navigationService.isAtSummary();
            };
            this.hasReachedCredit = function () {
                return _this.navigationService.hasReachedCredit();
            };
            this.isAtCredit = function () {
                return _this.navigationService.isAtCredit();
            };
            this.hasReachedCompletion = function () {
                return _this.navigationService.hasReachedCompletion();
            };
            this.isAtCompletion = function () {
                return _this.navigationService.isAtCompletion();
            };
            this.finishFlagImageUrl = function () {
                if (_this.navigationService.hasReachedCompletion()) {
                    return "../../../Content/images/ConsumerSite/icon-finish-flag-green.png";
                }
                else {
                    return "../../../Content/images/ConsumerSite/icon-finish-flag.png";
                }
            };
        }
        BreadCrumbController.className = 'breadCrumbController';
        BreadCrumbController.$inject = ['navigationService'];
        return BreadCrumbController;
    })();
    directive.BreadCrumbController = BreadCrumbController;
    var BreadCrumbDirective = (function () {
        function BreadCrumbDirective() {
            this.controller = 'breadCrumbController';
            this.controllerAs = 'breadCrumbCntrl';
            this.transclude = true;
            this.restrict = 'E';
            this.templateUrl = "/angular/consumersite/directives/breadcrumb/breadcrumb.html";
        }
        BreadCrumbDirective.createNew = function (args) {
            return new BreadCrumbDirective();
        };
        BreadCrumbDirective.className = 'breadCrumb';
        BreadCrumbDirective.$inject = [];
        return BreadCrumbDirective;
    })();
    directive.BreadCrumbDirective = BreadCrumbDirective;
    moduleRegistration.registerController(consumersite.moduleName, BreadCrumbController);
    moduleRegistration.registerDirective(consumersite.moduleName, BreadCrumbDirective);
})(directive || (directive = {}));
//# sourceMappingURL=breadcrumb.directive.js.map