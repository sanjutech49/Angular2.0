/// <reference path='../../Scripts/typings/angularjs/angular.d.ts'/>
/// <reference path='../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>

module docusign
{
    angular.module('docusign').directive('fullheight', ['$window', function ($window: angular.IWindowService) {
        return function (scope, element) {
            function applyHeight() {
                element.height($window.innerHeight - 80);
            }

            element($window).bind('resize', function () {
                scope.$apply(function () {
                    applyHeight();
                });
            });

            applyHeight();
        }
    }]);


    //angular.module('docusign').directive('fullheight', ['$window', function ($window: angular.IWindowService) {
    //    return function (scope, element, attrs) {
    //        function setFullHeight() {
    //            angular.element.height($window.innerHeight - 80);
    //        }

    //        angular.element($window).bind('resize', function () {
    //            scope.$apply(function () {
    //                setFullHeight();
    //            });
    //        });

    //        setFullHeight();
    //    }
    //}]);

    //angular.module('docusign', ['docusignSVC', '$state']).directive('consumerSignOut', function (docusignSVC: IDocusignService, $state: ng.ui.IStateService): ng.IDirective {
    //    return {
    //        restrict: 'E',
    //        link: function (scope, element, attrs, docusignSVC: IDocusignService) {
    //            if (docusignSVC.removeAuthenticationContext()) {
    //                $state.reload();
    //            }
    //            else {
    //                docusignSVC.log("ERROR REMOVING AUTHENTICATION");
    //            }
    //        }
    //    };
    //});

}