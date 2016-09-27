(function () {
	'use strict';
	angular.module('messagecenter')
		.controller('messagecenterController', messagecenterController);

	function messagecenterController($log, $modal, messagecenterSvc, enums, NavigationSvc) {
	    var vm = this;

	    vm.init = init;
	    vm.Submit = Submit;
	    vm.PostMessage = PostMessage;

	    vm.EmailMessage = '';

	    vm.processing = false;
	    vm.showLoader = false;
	    vm.showErrorContainer = false;
        
	    NavigationSvc.contextualType = enums.ContextualTypes.MessageCenter;

	    init();

	    function init() {
	        vm.showLoader = false;
	        vm.showErrorContainer = false;
	        /*
	        vm.showLoader = true;
	        vm.showErrorContainer = false;
	        messagecenterSvc.MessageCenter.GetData({ loanId: $scope.selectedLoanId, userAccountId: $scope.userAccountId }).$promise.then(
            function (data) {
                vm.showLoader = false;
                vm.showErrorContainer = false;
                vm.processing = false;
//                vm.ComplianceEaseReports = data.complianceEaseData;
                vm.setColors();
            },
            function (error) {
                console.log("Error:" + JSON.stringify(error));
                vm.processing = false;
                vm.showLoader = false;
                vm.showErrorContainer = true;
            });*/
	    }

	    function Submit() {
	    }

	    function PostMessage() {
	        alert(vm.EmailMessage);
	    }
    }
});
