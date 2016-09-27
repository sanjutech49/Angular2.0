(function () {
    'use strict';
    angular.module('loanDetails')
        .controller('propertyDetailsController', propertyDetailsController);

    propertyDetailsController.$inject = ['$log', '$modalInstance', 'propertyDetailsSvc', 'modalPopoverFactory', 'propertyDetails', 'wrappedLoan', 'loanId', 'userId', 'applicationData', 'loanEvent'];

    function propertyDetailsController($log, $modalInstance, propertyDetailsSvc, modalPopoverFactory, propertyDetails, wrappedLoan, loanId, userId, applicationData, loanEvent) {

        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.lookup = wrappedLoan.ref.lookup;
        vm.cancel = cancel;
        vm.save = save;
        vm.saveclose = saveAndClose;
        vm.propertyDetailsViewModel;
        vm.modalPopoverFactory = modalPopoverFactory;
        vm.fullLegalDescriptionEdit = fullLegalDescriptionEdit;
        vm.fullLegalDescriptionSave = fullLegalDescriptionSave;
        vm.applicationData = applicationData;
        vm.onAppraisedValueChanged = onAppraisedValueChanged;
        vm.propertyDetailsViewModel = propertyDetails;
        vm.licencedStates = vm.wrappedLoan.ref.getLicencedStates(vm.applicationData);
   
        function cancel() {
            $modalInstance.dismiss('cancel');
        };

        function save() {
            wrappedLoan.ref.setSubjectProperty(vm.propertyDetailsViewModel);
            propertyDetailsSvc.UpdatePropertyDetailsData.UpdatePropertyDetailsData({ loanId: loanId, userId: userId }, vm.propertyDetailsViewModel);

        };

        function saveAndClose() {
            $modalInstance.close(vm.propertyDetailsViewModel);
            propertyDetailsSvc.UpdatePropertyDetailsData.UpdatePropertyDetailsData({ loanId: loanId, userId: userId }, vm.propertyDetailsViewModel);

            //For updating LTV, and CLTV graphs after modal closes
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.AppraisedValue, wrappedLoan.ref.getSubjectProperty().appraisedValue);
        };
    };

    function fullLegalDescriptionEdit(event, ctrlPropertyDetails) {

        var sectionSevenPopup = ctrlPropertyDetails.modalPopoverFactory.openModalPopover('angular/loandetails/dynamics/fulllegaldescription.html', this, ctrlPropertyDetails.propertyDetailsViewModel, event, { arrowRight: true, className: 'tooltip-arrow-right-border-legal-desc', verticalPopupPositionPerHeight: 0.625, horisontalPopupPositionPerWidth: 1.03 });

        sectionSevenPopup.result.then(function (data) {
            fullLegalDescriptionSave(data.ctrlMain, data.model.fullLegal);
        });
    }

    function onAppraisedValueChanged() {
        loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.AppraisedValue, wrappedLoan.ref.getSubjectProperty().appraisedValue);
    }

    function fullLegalDescriptionSave(ctrlMain, model) {

        ctrlMain.propertyDetailsViewModel.fullLegal = angular.copy(model);
    }
})();

