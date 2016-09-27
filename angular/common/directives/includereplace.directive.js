angular.module('iMP.Directives').directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});
;
//# sourceMappingURL=includereplace.directive.js.map