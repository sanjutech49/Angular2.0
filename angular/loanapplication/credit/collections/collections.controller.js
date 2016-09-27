(function () {
    'use strict';
    angular.module('loanApplication').controller('collectionsController', collectionsController);

    collectionsController.$inject = ['wrappedLoan', 'CreditHelpers', 'modalPopoverFactory', 'applicationData', 'controllerData', 'CreditStateService'];

    function collectionsController(wrappedLoan, CreditHelpers, modalPopoverFactory, applicationData, controllerData, CreditStateService) {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;

        //properties
        vm.isCollapsed = controllerData.isCollapsed;
        vm.disableFields = false;
        vm.borrowers = wrappedLoan.ref.active.Borrowers(false, true, false);
        vm.debtAccountOwnershipTypes = CreditStateService.debtAccountOwnershipTypes;
        vm.applicationData = applicationData;
    
        //vm.allCollections = wrappedLoan.ref.getAllCollections();

        //functions
        vm.showCompanyInfo = showCompanyInfo;
        vm.addCollectionsRow = addCollectionsRow;
        vm.deleteCollectionsRow = deleteCollectionsRow;
        vm.collectionsCommentChanged = collectionsCommentChanged; 
        vm.moveCollectionBetweenBorrowerAndCoBorrower = moveCollectionBetweenBorrowerAndCoBorrower;

        vm.getCollections = function () {
            return vm.wrappedLoan.ref.active.collections;
        }

        vm.CreditStateService = CreditStateService;
        vm.summateTotalCollectionsUnpaidBalance = CreditStateService.summateTotalCollectionsUnpaidBalance;
        vm.summateTotalCollectionsPayments = CreditStateService.summateTotalCollectionsPayments;

        //function getBorrowerFullNameTrimmed() {
        //    return wrappedLoan.ref.active.Borrowers(false).filter(function (item) {
        //        item.value = item.value.trim().replace(/\s+/g, ' ');
        //        item.text = item.text.trim().replace(/\s+/g, ' ');
        //        return item;
        //    });
        //}


        //function showCompanyInfo(collection, event) {

        //    var initialModel = angular.copy(collection.companyData);

        //    var companyData = vm.CreditStateService.getCompanyDataForCollection(collection, vm.disableFields);

        //    //var result = CreditHelpers.getCompanyInfoData(model, false, wrappedLoan.ref.lookup.liabilityTypes, vm.debtAccountOwnershipTypes, false, false, vm.disableFields, wrappedLoan.ref.lookup.allStates);

        //    var confirmationPopup = modalPopoverFactory.openModalPopover('angular/loanapplication/credit/companycreditcontrol.html', companyData, model.companyData, event);
        //    confirmationPopup.result.then(function (data) {
        //        collection.companyData.hasChanges = CreditHelpers.companyHasChanges(initialModel, collection, companyData);
        //        collection.debtsAccountOwnershipType = companyData.debtsAccountOwnershipType;
        //        //TODO: implement this method 
        //        //Task 23105:ProcessRulesForLiabilityOwnershipType - rule not working
        //        vm.CreditStateService.ProcessRulesForLiabilityOwnershipType(collection);
        //    });
        //}

        function showCompanyInfo(model, event) {
            var initialModel = angular.copy(model.companyData);
            var result = CreditHelpers.getCompanyInfoData(model, false, wrappedLoan.ref.lookup.liabilityTypes, vm.debtAccountOwnershipTypes, false, false, vm.disableFields, wrappedLoan.ref.lookup.allStates);

            var confirmationPopup = modalPopoverFactory.openModalPopover('angular/loanapplication/credit/companycreditcontrol.html', result, model.companyData, event);
            confirmationPopup.result.then(function (data) {
                model.companyData.hasChanges = CreditHelpers.companyHasChanges(initialModel, model, result);
                model.debtsAccountOwnershipType = result.debtsAccountOwnershipType;
                //TODO: implement this method 
                //Task 23105:ProcessRulesForLiabilityOwnershipType - rule not working
                CreditHelpers.ProcessRulesForLiabilityOwnershipType(model, vm);
            });
        }

        function addCollectionsRow() {          
            var liablity = new cls.LiabilityViewModel(vm.wrappedLoan.ref.getTransactionInfoRef());
            liablity.typeId = 3; //TODO: change this with enum
            liablity.isUserEntry = true;
            liablity.minPayment = "0";
            liablity.monthsLeft = "1";
            liablity.debtCommentId = -1;
            liablity.companyData.companyName = '';
            liablity.isNewRow = true;
            liablity.currentratingType = "Collection";

            CreditStateService.addCollection(liablity);

            //wrappedLoan.ref.active.getBorrower().getLiabilites();
            //wrappedLoan.ref.active.getBorrower().addLiability(liablity);
        }

        function deleteCollectionsRow(index) {

            CreditStateService.deleteCollection(vm.getCollections()[index]);

            //var item = wrappedLoan.ref.active.getCombinedCollections()[index];
            //wrappedLoan.ref.active.removeFromCollection(item, wrappedLoan.ref.active.getBorrower().getLiabilites(), wrappedLoan.ref.active.getCoBorrower().getLiabilites());
        }
        
        function collectionsCommentChanged(collection) {
            //var collection = new cls.LiabilityViewModel();
            collection.includeCollectionInLiabilitesTotalAmount(collection);
        }

        function moveCollectionBetweenBorrowerAndCoBorrower(item) {

            if (item.borrowerId)
                CreditStateService.moveLiabilityBetweenBorrowers(item);
            //wrappedLoan.ref.active.toggleBorrowerForItem(item, wrappedLoan.ref.active.getBorrower().getLiabilites(), wrappedLoan.ref.active.getCoBorrower().getLiabilites(), null, item.isNewRow);
        }

    }
})();