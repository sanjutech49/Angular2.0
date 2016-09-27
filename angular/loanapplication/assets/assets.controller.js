(function () {
    'use strict';
    angular.module('loanApplication')
        .controller('assetsController', assetsController);

    assetsController.$inject = ['$log', '$scope', '$modal', 'assetsSvc', 'modalPopoverFactory', 'BroadcastSvc', 'simpleModalWindowFactory', 'wrappedLoan', '$filter', 'applicationData'];

    function assetsController($log, $scope, $modal, assetsSvc, modalPopoverFactory, BroadcastSvc, simpleModalWindowFactory, wrappedLoan, $filter, applicationData) {
        var vm = this;
        var event = {};
        event.type = 'click';

        //properties
        vm.wrappedLoan = wrappedLoan;
        vm.showLoader = true;
        vm.totalAutomobilesAmount = 0.00;
        vm.totalFinancesAmount = 0.00;
        vm.totalNetFaceAmount = 0.00;
        vm.totalLiquidAssets = 0.00;
        vm.disableFields = false;
        vm.expandFinancials = true;
        vm.expandAutomobiles = true;
        vm.expandLifeInsurance = true;
        vm.financials;
        vm.automobiles;
        vm.lifeInsurance;
        vm.borrowers = [];
        vm.applicationData = applicationData;
        vm.ctrlAsset = new cls.AssetViewModel();
        vm.assetTypeEnum = srv.AssetTypeEnum;


        //functions
        vm.addFinancials = addFinancials;
        vm.addAutomobiles = addAutomobiles;
        vm.addInsurances = addInsurances;
        vm.removeFinancials = removeFinancials;
        vm.removeAutomobiles = removeAutomobiles;
        vm.removeInsurances = removeInsurances;
        vm.collapseExpand = collapseExpand;
        vm.collapseAll = collapseAll;
        vm.expandAll = expandAll;
        vm.showItemInfo = showItemInfo;
        vm.calculateTotals = calculateTotals;
        vm.calculateTotal = calculateTotal;
        //vm.createBorrowersList = createBorrowersList;
        vm.checkIteminstitiutionContactInfoModified = checkIteminstitiutionContactInfoModified;
        vm.toggleAsset = toggleAsset;
        vm.clearFinancialAssetsValues = clearFinancialAssetsValues;

        getAssetsData();

        function toggleAsset(item) {

            item.jointAccount = (item.borrowerFullName === 'JointAccount') ? true : false;
            wrappedLoan.ref.active.toggleBorrowerForItem(item, wrappedLoan.ref.active.getBorrower().assets, wrappedLoan.ref.active.getCoBorrower().assets, (item.borrowerFullName === 'JointAccount' || item.borrowerFullName === wrappedLoan.ref.active.getBorrower().fullName), item.isUserEntry);
        }

        function getAssetsData() {
            var financials;

            if (!vm.ctrlAsset)
                vm.ctrlAsset = new cls.AssetViewModel();

            // custom function created so that middle name wont affect the borrower list
            populateBorrowerList();

            //var b = wrappedLoan.ref.active.Borrowers();
            //for (var i = 0; i < b.length; i++) {
            //    if (!!b[i].text && b[i].text.trim().length > 0) {
            //        vm.borrowers.push(b[i]);
            //    }
            //}
            
            vm.calculateTotals();
            
            financials = wrappedLoan.ref.active.getCombinedAssetsFinancials();

            if (financials.length == 0)
                addFinancials(event);

            for (var i = 0; i < financials.length; i++) {
                financials[i].institiutionContactInfoModified = vm.ctrlAsset.checkIteminstitiutionContactInfoModified(financials[i].institiutionContactInfo);
            }

            vm.showLoader = false;
            vm.disableFields = false;

            if (vm.wrappedLoan.ref.active.getCombinedAssetsAutomobiles().length == 0)
                addAutomobiles(event)

            if (vm.wrappedLoan.ref.active.getCombinedAssetsLifeInsurence().length == 0)
                addInsurances(event)
        }

        function clearFinancialAssetsValues(item) {
            if (item.assetType == srv.AssetTypeEnum.NotRequired) {
                item.institiutionContactInfo = new cls.CompanyDataViewModel();
                item.institiutionContactInfoModified = false;
                item.accountNumber = '';
                item.monthlyAmount = 0;

                calculateTotals();
            }
        }

        function addFinancials(event) {

            addItem(event, new cls.FinancialsAssetViewModel(), vm.expandFinancials, 'financials');
        }

        function addAutomobiles(event) {

            addItem(event, new cls.AutomobileAssetViewModel(), vm.expandAutomobiles, 'automobiles');

        }

        function addInsurances(event) {

            addItem(event, new cls.LifeInsuranceAssetViewModel(), vm.expandLifeInsurance, 'insurances');

        }

        function addItem(event, object, collapse, collapseId) {
            if ((event.type === 'keypress' && event.keyCode === 13) || event.type === 'click') {
                if (!collapse) vm.collapseExpand(collapseId);

                wrappedLoan.ref.active.getBorrower().addAssets(object);

                window.setTimeout(function () {
                    //@todo: after indexing logic is completed
                    //$('.ddlInsurance').eq(wrappedLoan.ref.active.lifeInsurance.length - 1).focus();
                    //$('.ddlInsurance:eq(' + (vm.AssetsTabViewModel.LifeInsurances.length - 1) + ') option:eq(1)').prop('selected', true);
                }, 200);
            }
        }

        function removeFinancials(obj, index) {
            removeItem(obj);
            calculateTotal('finances');

            if (wrappedLoan.ref.active.getCombinedAssetsFinancials().length === 0) {
                vm.collapseExpand('financials');
            }
        }

        function removeAutomobiles(obj, index) {
            removeItem(obj);
            calculateTotal('automobiles');

            if (wrappedLoan.ref.active.getCombinedAssetsAutomobiles().length === 0) {
                vm.collapseExpand('automobiles');
            }
        }

        function removeInsurances(obj, index) {
            removeItem(obj);
            calculateTotal('insurances');

            if (wrappedLoan.ref.active.getCombinedAssetsLifeInsurence().length === 0) {
                vm.collapseExpand('insurances');
            }
        }

        function removeItem(obj) {
            if (obj.isUserEntry)
                wrappedLoan.ref.active.deleteFromCollection(obj, wrappedLoan.ref.active.getBorrower().getAssets(), wrappedLoan.ref.active.getCoBorrower().getAssets());
            else
                wrappedLoan.ref.active.removeFromCollection(obj, wrappedLoan.ref.active.getBorrower().getAssets(), wrappedLoan.ref.active.getCoBorrower().getAssets());
        }

        function collapseExpand(sectionName) {
            if (sectionName) {
                switch (sectionName) {
                    case 'financials':
                        vm.expandFinancials = vm.expandFinancials ? false : true;
                        break;
                    case 'automobiles':
                        vm.expandAutomobiles = vm.expandAutomobiles ? false : true;
                        break;
                    case 'insurances':
                        vm.expandLifeInsurance = vm.expandLifeInsurance ? false : true;
                        break;
                }
            }
        }

        function collapseAll() {
            vm.expandFinancials = false;
            vm.expandAutomobiles = false;
            vm.expandLifeInsurance = false;
        }

        function checkIteminstitiutionContactInfoModified(item) {

            if (!vm.ctrlAsset)
                vm.ctrlAsset = new cls.AssetViewModel();
            
            item.institiutionContactInfoModified = vm.ctrlAsset.checkIteminstitiutionContactInfoModified(item.institiutionContactInfo);
        }

        function expandAll() {
            vm.expandFinancials = true;
            vm.expandAutomobiles = true;
            vm.expandLifeInsurance = true;
        }

        function calculateTotal(sectionName) {

            switch (sectionName) {
                case 'finances':
                    vm.totalFinancesAmount = wrappedLoan.ref.getFinancialsTotal(wrappedLoan.ref.active, 'bothForBorrowerAndCoborrower');
                    break;
                case 'automobiles':
                    vm.totalAutomobilesAmount = wrappedLoan.ref.getAutomobilesTotal(wrappedLoan.ref.active, 'bothForBorrowerAndCoborrower');
                    break;
                case 'insurances':
                    vm.totalNetFaceAmount = wrappedLoan.ref.getLifeInsuranceTotal(wrappedLoan.ref.active, 'bothForBorrowerAndCoborrower');
                    break;
            }

            vm.totalLiquidAssets = wrappedLoan.ref.getTotalLiquidAssets();
        }

        function calculateTotals() {

            vm.totalFinancesAmount = wrappedLoan.ref.getFinancialsTotal(wrappedLoan.ref.active, 'bothForBorrowerAndCoborrower');
            vm.totalAutomobilesAmount = wrappedLoan.ref.getAutomobilesTotal(wrappedLoan.ref.active, 'bothForBorrowerAndCoborrower');
            vm.totalNetFaceAmount = wrappedLoan.ref.getLifeInsuranceTotal(wrappedLoan.ref.active, 'bothForBorrowerAndCoborrower');

            vm.totalLiquidAssets = wrappedLoan.ref.getTotalLiquidAssets();
        }

        function showItemInfo(item, event) {
            var ctrl = {
                itemContactInfoModalTitle: "Institution Contact Info",
                DisableFields: vm.disableFields,
                states: cls.LoanViewModel.getLookups().states
            };

            modalPopoverFactory.openModalPopover('angular/common/companycontrol.html', ctrl, item.institiutionContactInfo, event)
                .result.then(function (data) {
                    item.institiutionContactInfo = data;
                    checkIteminstitiutionContactInfoModified(item);
                });
        };

        function cloneItem(parentObject) {
            for (var i = 0; i < parentObject.length; i++) {
                if (parentObject[i].isRemoved && parentObject[i].isEmpty) {
                    var item = angular.copy(parentObject[i]);
                    item.isRemoved = false;

                    return item;
                }
            }
        }

        // the logic from getAssets data has been moved to a seperate function
        function populateBorrowerList() {
            vm.borrowers = [];

            vm.borrowers.push({
                value: wrappedLoan.ref.active.getBorrower().fullName.trim(),
                text: wrappedLoan.ref.active.getBorrower().firstName.trim() + ' ' + wrappedLoan.ref.active.getBorrower().lastName.trim()
            });

            if (wrappedLoan.ref.active.isSpouseOnTheLoan) {
                vm.borrowers.push({
                    value: wrappedLoan.ref.active.getCoBorrower().fullName.trim(),
                    text: wrappedLoan.ref.active.getCoBorrower().firstName.trim() + ' ' + wrappedLoan.ref.active.getCoBorrower().lastName.trim()
                });
                vm.borrowers.push({
                    value: 'JointAccount',
                    text: 'Joint Account'
                });
            }
        }

    }
})();