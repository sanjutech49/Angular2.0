/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var BreadCrumbMNSController = (function () {
        function BreadCrumbMNSController(navigationService) {
            var _this = this;
            this.navigationService = navigationService;
            this.getDisclosuresLink = function () {
                //it is safe to always leave this link active as it is the first one.
                return _this.navigationService.getBorrowerLink();
            };
            this.getAppraisalLink = function () {
                //return an empty string if the user hasn't reached the property section
                if (_this.navigationService.hasReachedProperty()) {
                    return _this.navigationService.getPropertyLink();
                }
                else {
                    return '';
                }
            };
            this.getUploadLink = function () {
                if (_this.navigationService.hasReachedFinancial()) {
                    return _this.navigationService.getFinancialLink();
                }
                else {
                    return '';
                }
            };
            this.getSuccessLink = function () {
                return '';
            };
            this.hasReachedDisclosures = function () {
                return false;
            };
            this.isAtDisclosures = function () {
                return false;
            };
            this.hasReachedAppraisal = function () {
                return false;
            };
            this.isAtAppraisal = function () {
                return false;
            };
            this.hasReachedUpload = function () {
                return false;
            };
            this.isAtUpload = function () {
                return false;
            };
            this.hasReachedCompletion = function () {
                return false;
            };
            this.isAtCompletion = function () {
                return false;
            };
            this.finishFlagImageUrl = function () {
                if (false) {
                    return "../../../Content/images/ConsumerSite/icon-finish-flag-green.png";
                }
                else {
                    return "../../../Content/images/ConsumerSite/icon-finish-flag.png";
                }
            };
        }
        BreadCrumbMNSController.className = 'breadCrumbMNSController';
        BreadCrumbMNSController.$inject = ['navigationService'];
        return BreadCrumbMNSController;
    })();
    directive.BreadCrumbMNSController = BreadCrumbMNSController;
    var BreadCrumbMNSDirective = (function () {
        function BreadCrumbMNSDirective() {
            this.controller = 'breadCrumbMNSController';
            this.controllerAs = 'breadCrumbMNSCntrl';
            this.transclude = true;
            this.restrict = 'E';
            this.templateUrl = "/angular/consumersite/directives/breadcrumb/breadcrumb.myNextStep.html";
        }
        BreadCrumbMNSDirective.createNew = function (args) {
            return new BreadCrumbMNSDirective();
        };
        BreadCrumbMNSDirective.className = 'breadCrumbMyNextStep';
        BreadCrumbMNSDirective.$inject = [];
        return BreadCrumbMNSDirective;
    })();
    directive.BreadCrumbMNSDirective = BreadCrumbMNSDirective;
    moduleRegistration.registerController(consumersite.moduleName, BreadCrumbMNSController);
    moduleRegistration.registerDirective(consumersite.moduleName, BreadCrumbMNSDirective);
})(directive || (directive = {}));
//# sourceMappingURL=breadcrumb.myNextStep.directive.js.map