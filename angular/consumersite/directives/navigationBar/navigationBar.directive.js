var directive;
(function (directive) {
    var NavigationBarDirective = (function () {
        function NavigationBarDirective() {
            var _this = this;
            this.isMobileMenuOpen = false;
            this.link = function ($scope) {
                $scope.toggleMobileMenu = function () {
                    console.log('hello');
                    this.isMobileMenuOpen = !this.isMobileMenuOpen;
                };
                $scope.isMobileMenuOpen = _this.isMobileMenuOpen;
            };
            this.templateUrl = '/angular/consumersite/directives/navigationBar/navigationBar.html';
        }
        NavigationBarDirective.createNew = function (args) {
            return new NavigationBarDirective();
        };
        NavigationBarDirective.className = 'navigationBar';
        NavigationBarDirective.$inject = [];
        return NavigationBarDirective;
    })();
    moduleRegistration.registerDirective(consumersite.moduleName, NavigationBarDirective);
})(directive || (directive = {}));
//# sourceMappingURL=navigationBar.directive.js.map