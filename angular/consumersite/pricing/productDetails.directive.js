// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
var directive;
(function (directive) {
    var productDetails = (function () {
        function productDetails($location, $timeout) {
            var _this = this;
            this.$location = $location;
            this.$timeout = $timeout;
            this.link = function (scope, instanceElement, instanceAttributes, transclude) {
            };
            this.controller = function () { return _this; };
            this.restrict = 'E';
            this.bindToController = true;
            this.templateUrl = "/angular/consumersite/pricing/productDetails.html";
        }
        productDetails.createNew = function (args) {
            return new productDetails(args[0], args[1]);
        };
        productDetails.$inject = ['$location', '$timeout'];
        productDetails.className = "productDetails";
        return productDetails;
    })();
    directive.productDetails = productDetails;
    moduleRegistration.registerDirective(consumersite.moduleName, productDetails);
})(directive || (directive = {}));
//# sourceMappingURL=productDetails.directive.js.map