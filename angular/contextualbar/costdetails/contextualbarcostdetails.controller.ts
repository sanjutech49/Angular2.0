/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

    class ContextualBarCostDetailsController {

        static $inject = ['$scope', '$location', 'anchorSmoothScroll'];
      
        //TODO: Please populate this variable from backend service
        AutomatedFees = 'Off'
  
        constructor(private $scope: ng.IScope, private $location, private anchorSmoothScroll) {
            
             $scope.$on('CostDetailsLoaded', function (event, isRefinance) {
                this.ApplicationType = (isRefinance) ? 'refinance' : 'purchase';
            });
        }
 
        toggleAutomatedFees = () => {
            this.AutomatedFees = (this.AutomatedFees == 'Off') ? 'On' : 'Off';
        }

        scrollTo = (id) => {
            var old = this.$location.hash();
            this.$location.hash(id);
            this.anchorSmoothScroll(id);
            this.$location.hash(old);
        }
    }
