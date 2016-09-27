(function () {
    'use strict';
    angular.module('loanDetails').controller('propertyInfoController', propertyInfoController);

    propertyInfoController.$inject = ['$log', '$scope', '$modal', 'loanDetailsSvc', 'modalPopoverFactory', '$controller', 'wrappedLoan', 'applicationData', 'loanEvent'];

    function propertyInfoController($log, $scope, $modal, loanDetailsSvc, modalPopoverFactory, $controller, wrappedLoan, applicationData, loanEvent) {

        var vm = this;
        vm.wrappedLoan = wrappedLoan;

		 /* Properties
		 */
        vm.appraisedValueCtrl = {};
        vm.applicationData = applicationData;
        vm.loanTypeEnum = srv.LoanPurposeTypeEnum



        /**
		  * Functions
		 */
        vm.editPropertyDetails = editPropertyDetails;
        vm.showAppraisedValuePopup = showAppraisedValuePopup;
        vm.effectivePropertyValue = effectivePropertyValue;
        vm.effectivePropertyValueName = effectivePropertyValueName;




        /**
		  * Function declerations
		 */
     
        function editPropertyDetails() {
            var modalInstance = $modal.open({
                templateUrl: 'angular/loandetails/dynamics/propertydetails.html',
                controller: 'propertyDetailsController',
                controllerAs: 'propertyDetailsController',
                backdrop: 'static',
                windowClass: 'imp-modal flyout imp-flyout-float-to-contextual',
                resolve: {
                    propertyDetails: function () {
                        return wrappedLoan.ref.getSubjectProperty();
                    },
                    wrappedLoan: function () {
                        return wrappedLoan;
                    },
                    modalPopoverFactory: function () {
                        return modalPopoverFactory;
                    },
                    userId: function () {
                        return $scope.userAccountId
                    },
                    loanId: function () {
                        return $scope.selectedLoanId
                    },
                    applicationData: function () {
                        return applicationData;
                    },
                    loanEvent: function() {
                        return loanEvent;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                wrappedLoan.ref.setSubjectProperty(data);
            })
        };

        function effectivePropertyValue() {
            CheckEffectivePropertyValue();
            return vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValue;
        }

        function effectivePropertyValueName() {
            CheckEffectivePropertyValue();
            return vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValueName;
        }

        function CheckEffectivePropertyValue() {
            //Purchase
            if (vm.wrappedLoan.ref.loanPurposeType && vm.wrappedLoan.ref.loanPurposeType == 1) {
                //Use smaller value
                if (vm.wrappedLoan.ref.getSubjectProperty().appraisedValue > 0 && (vm.wrappedLoan.ref.getSubjectProperty().appraisedValue <= vm.wrappedLoan.ref.getSubjectProperty().purchasePrice))
                {
                    vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValue = vm.wrappedLoan.ref.getSubjectProperty().appraisedValue;
                    vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValueName = 'Appraised Value';
                }
                else
                {
                    vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValue = vm.wrappedLoan.ref.getSubjectProperty().purchasePrice;
                    vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValueName = 'Purchase Value';
                }
            }
            //Refinance
            else if (vm.wrappedLoan.ref.loanPurposeType && vm.wrappedLoan.ref.loanPurposeType == 2) {
                //Use appraised if available
                if (vm.wrappedLoan.ref.getSubjectProperty().appraisedValue && vm.wrappedLoan.ref.getSubjectProperty().appraisedValue > 0)
                {
                    vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValue = vm.wrappedLoan.ref.getSubjectProperty().appraisedValue;
                    vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValueName = 'Appraised Value';
                } 
                else
                {
                    vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValue = vm.wrappedLoan.ref.getSubjectProperty().currentEstimatedValue;
                    vm.wrappedLoan.ref.getSubjectProperty().effectivePropertyValueName = 'Estimated Value';
                }
                    
            }
            else {
                console.log("Error can't estimate purchase value loan type is unknown!");
            }
        };

        function showAppraisedValuePopup(event) {
            vm.appraisedValueCtrl = $controller('appraisedValueHistoryController')
            vm.appraisedValueCtrl.init($scope.selectedLoanId);
            vm.appraisedValueCtrl.event = event;
        };
    }

})();
