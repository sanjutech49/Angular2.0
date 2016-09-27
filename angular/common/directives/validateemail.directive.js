impDirectives.directive('impValidateEmail',
    [  function () {

        return {
            require: 'ngModel',
            restrict: 'A',
            replace: true,
            scope: {
                model: '=ngModel'
            },
            link: function (scope, elm, attrs, ctrl) {
                if (scope.model && scope.model.startsWith('newprospect')) {
                    scope.model = ''
                }
            }
        };
    }]); 