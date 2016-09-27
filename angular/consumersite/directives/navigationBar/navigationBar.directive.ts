
module directive {
    class NavigationBarDirective {

        static className = 'navigationBar';
        static $inject = [];

        isMobileMenuOpen: boolean = false;

        constructor() {
        }

        static createNew(args: any[]) {
            return new NavigationBarDirective();
        }

        link = ($scope) => {
            $scope.toggleMobileMenu = function () {
                console.log('hello');
                this.isMobileMenuOpen = !this.isMobileMenuOpen;
            };
            $scope.isMobileMenuOpen = this.isMobileMenuOpen;
        }

        public templateUrl = '/angular/consumersite/directives/navigationBar/navigationBar.html';

    }

    moduleRegistration.registerDirective(consumersite.moduleName, NavigationBarDirective);
}