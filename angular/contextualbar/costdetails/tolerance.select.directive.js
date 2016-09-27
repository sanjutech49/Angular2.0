(function () {
    angular.module('loanCenter').directive('impToleranceSelect', ['costDetailsSvc', '$rootScope', function (costDetailsSvc, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'angular/contextualbar/costdetails/toleranceselect.html',
            bindToController: true,
            scope: {
                'toleranceGroup': '=',
                'selectedToleranceId': '=',
                'activeToleranceId': '=',
                'selectedToleranceItems': '='
            },
            controller: function () {
                var vm = this;          
                vm.setActiveToleranceGroup = function (id) {
                    costDetailsSvc.getToleranceLineItems(id).then(function(data){
                        vm.selectedToleranceId = id;
                        vm.selectedToleranceItems = data;
                    }, 
                    function(errorMsg){
                        console.log('Error:' + JSON.stringify(errorMsg));
                    });
                };
                vm.getColorCode = function (status) {
                    return (status == 0) ? 'alert-red' : 'primary-green';
                }
            },
            controllerAs: 'toleranceSelect'
        };
    }]);
})()