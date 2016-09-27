(function () {
	'use strict';
	 
	angular.module('loanCenter').factory('BroadcastSvc', BroadcastSvc);

	BroadcastSvc.$inject = ['$rootScope'];

	function BroadcastSvc($rootScope) {

	    var sharedService = {};

	    sharedService.message = '';

	    sharedService.prepForBroadcast = function (msg) {
	        this.message = msg;
	        this.broadcastItem();
	    };

	    sharedService.broadcastItem = function () {
	        $rootScope.$broadcast('REFRESH');
	    };

        sharedService.broadcastCotextualBar = function () {
	        $rootScope.$broadcast('REFRESHCotextualBar');
	    };

        sharedService.broadcastCostDetailsLoaded = function () {
            $rootScope.$broadcast('CostDetailsLoaded');
        };

        sharedService.broadcastCostDetailsTotals = function () {
            $rootScope.$broadcast('CostDetailsTotalsUpdated');
        };

        sharedService.broadcastSelectedProduct = function (product) {
            $rootScope.$broadcast('ProductSelected', product);
        };

        sharedService.broadcastChangedImpounds = function (data) {
            $rootScope.$broadcast('ImpoundsChanged', data);
        };

        sharedService.broadcastQueueLoadRequest = function (data) {
            $rootScope.$broadcast('QueueLoadRequest', data);
        };

        sharedService.broadcastQueueSizeChanged = function (data) {
            $rootScope.$broadcast('QueueSizeChanged', data);
        };

        sharedService.broadcastLoanChanged = function (wrappedLoan, applicationData) {
            $rootScope.$broadcast('LoanChanged', {wrappedLoan: wrappedLoan, applicationData: applicationData});
        };

        sharedService.broadcastRefreshGridColumns = function () {
            $rootScope.$broadcast('BroadcastRefreshGridColumns');
        };

        sharedService.broadcastRepopulatePricingResults = function () {
            $rootScope.$broadcast('BroadcastRepopulatePricingResults');
        };

        sharedService.broadcastUpdateSectionSeven = function () {
            $rootScope.$broadcast('UpdateSectionSeven');
        };        
        
        sharedService.broadcastClearAllFilter = function () {
            $rootScope.$broadcast('BroadcastClearAllFilter');
        };

        sharedService.broadcastRefreshQueue = function () {
            $rootScope.$broadcast('BroadcastRefreshQueue');
        };

        sharedService.broadcastCostsRecalculated = function () {
            $rootScope.$broadcast('CostsRecalculated');
        };

	    return sharedService;		 
	 
	}
})();