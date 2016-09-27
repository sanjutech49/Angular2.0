(function () {
    'use strict';

    angular.module('contextualBar').controller('ContextualBarProductAndPricingCtrl', ContextualBarProductAndPricingCtrl);

    ContextualBarProductAndPricingCtrl.$inject = ['$scope', '$state', '$controller', '$modal', '$modalStack', 'wrappedLoan', 'modalPopoverFactory', 'BroadcastSvc', 'controllerData', 'pricingResultsSvc', 'applicationData', 'commonCalculatorSvc'];

    function ContextualBarProductAndPricingCtrl($scope, $state, $controller, $modal, $modalStack, wrappedLoan, modalPopoverFactory, BroadcastSvc, controllerData, pricingResultsSvc, applicationData, commonCalculatorSvc) {

        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.back = back;
        vm.openImpoundCalculator = openImpoundCalculator;
        vm.selectedProduct = null;
        vm.showAdjustmentsPopup = showAdjustmentsPopup;

        vm.openShareComparisonReportModal = openShareComparisonReportModal;
        vm.getSelectedProducts = getSelectedProducts;

        vm.totalAdjustmentsValue = getTotalAdjustmentsValue();

        $scope.$on('ProductSelected', function (event, args) {
            vm.selectedProduct = args;
        });

        function back() {
            $state.go("loanCenter.loan.loanScenario.sections", { 'repricing': controllerData.repricing });
        };

        function getTotalAdjustmentsValue() {
            var tmpTotalAdjustmentsValue = 0;

            for (var i = 0; i < vm.wrappedLoan.ref.pricingAdjustments.adjustments.length; i++) {
                if (vm.wrappedLoan.ref.pricingAdjustments.adjustments[i].adjustmentSectionType == 2 && (vm.wrappedLoan.ref.pricingAdjustments.adjustments[i].adjustmentTypeId != 1))
                    tmpTotalAdjustmentsValue += parseFloat(vm.wrappedLoan.ref.pricingAdjustments.adjustments[i].value);
            }

            tmpTotalAdjustmentsValue = parseFloat(Math.round(tmpTotalAdjustmentsValue * 1000) / 1000).toFixed(3);

            return tmpTotalAdjustmentsValue;
        }

        function showAdjustmentsPopup() {
            var tmpTotalAdjustmentsValue = getTotalAdjustmentsValue();
            var adjustments = new Array();

            var tmpDesc;
            var tmpPaidBy;

            for (var i = 0; i < vm.wrappedLoan.ref.pricingAdjustments.adjustments.length; i++) {
                if (vm.wrappedLoan.ref.pricingAdjustments.adjustments[i].adjustmentSectionType == 2 && (vm.wrappedLoan.ref.pricingAdjustments.adjustments[i].adjustmentTypeId != 1)) {
                    var tempAdjs = vm.wrappedLoan.ref.pricingAdjustments.adjustments[i];
                    tempAdjs.value = parseFloat(Math.round(tempAdjs.value * 1000) / 1000).toFixed(3);

                    if (applicationData.lookup.loAdjustmentTypes) {
                        tmpDesc = applicationData.lookup.loAdjustmentTypes.filter(function (obj) { return obj.value == (parseInt(vm.wrappedLoan.ref.pricingAdjustments.adjustments[i].adjustmentTypeId) - 1); });
                        tempAdjs.adjustmentTypeDescription = tmpDesc[0].text;
                    }

                    if (applicationData.lookup.loPricePaidBy) {
                        tmpPaidBy = applicationData.lookup.loPricePaidBy.filter(function (obj) { return obj.value == (parseInt(vm.wrappedLoan.ref.pricingAdjustments.adjustments[i].paidBy) - 1); });
                        tempAdjs.adjustmentPaidBy = tmpPaidBy.length > 0 ? tmpPaidBy[0].text : "No Entry";
                    }

                    adjustments.push(tempAdjs);
                }
            }

            var ctrl = {
                adjustments: adjustments,
                totalAdjustmentsValue: tmpTotalAdjustmentsValue
            };

            modalPopoverFactory.openModalPopover('angular/contextualbar/productandpricing/adjustmentspopup.html', ctrl, {}, event)
                .result.then(function (data) {
                    console.log("clicked somewhere else");
                });
        }

        function openImpoundCalculator(event) {

            if (!vm.selectedProduct)
                return;



            var impoundCalculator = modalPopoverFactory.openModalPopover(
                'angular/common/impoundcalculator/impoundcalculator.html',
                $controller("impoundCalculatorController", { $scope: $scope.$new() }),
                {
                    isRefinance: wrappedLoan.ref.loanPurposeType != '1',
                    mortageType: wrappedLoan.ref.financialInfo.mortgageType,
                    loanAmount: vm.selectedProduct.totalLoanAmount,
                    applicationData: applicationData,
                    purchasePrice: wrappedLoan.ref.getSubjectProperty().purchasePrice,
                    costs: vm.selectedProduct.costDetails.reservesCosts,
                    HOAExpens: { preferredPayPeriod: srv.PeriodTypeEnum.Monthly, amountPerMonth: vm.wrappedLoan.ref.housingExpenses.newHoa, amount: vm.wrappedLoan.ref.housingExpenses.newHoa }
                },
                event,
                { className: 'tooltip-arrow-right-cost-details', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.695 }
            );
            impoundCalculator.result.then(function (data) {
                BroadcastSvc.broadcastChangedImpounds(data);
            }, function () {
                console.log("clicked somewhere else");
            });
        };

        //function getHOA() {
        //    var hoa = wrappedLoan.ref.getSubjectProperty().hoaDuesExpense;

        //    if (hoa) {
        //        hoa.name = "HOA";
        //        hoa.noOfMonthlyReserves = 1;
        //        hoa.impounded = false;
        //        hoa.monthlyAmount = hoa.monthlyAmount ? hoa.monthlyAmount : 0;
        //        hoa.preferredPayPeriod = hoa.preferredPayPeriod == "Monthly" || hoa.preferredPayPeriod == "1" ? "1" : "2";
        //        hoa.amount = hoa.preferredPayPeriod == "2" ? hoa.monthlyAmount * 12 : hoa.monthlyAmount;
        //        hoa.totalEstimatedReserves = 0;
        //    }
        //    else {
        //        hoa = {};
        //        hoa.name = "HOA";
        //        hoa.noOfMonthlyReserves = 1;
        //        hoa.impounded = false;
        //        hoa.monthlyAmount = 0;
        //        hoa.preferredPayPeriod = "1";
        //        hoa.amount = 0;
        //        hoa.totalEstimatedReserves = 0;
        //    }

        //    //wrappedLoan.ref.getSubjectProperty().hoaDuesExpense = hoa;
        //};

        function getSelectedProducts() {
            var selectedProducts = [];

            var productTypeGroups = _.values(controllerData.sortedProductPricingArray);
            angular.forEach(productTypeGroups, function (productTypeGroup) {
                var productNameGroups = _.values(productTypeGroup);
                angular.forEach(productNameGroups, function (productNameGroup) {
                    angular.forEach(productNameGroup, function (product) {
                        if (product.compare)
                            selectedProducts.push(product);
                    })
                })
            })
            return selectedProducts;
        }

        function openShareComparisonReportModal() {

            var userSelectedProductCategoriesVM = new srv.cls.UserSelectedProductCategoriesViewModel();

            userSelectedProductCategoriesVM.firstName = wrappedLoan.ref.active.getBorrower().firstName;
            userSelectedProductCategoriesVM.lastName = wrappedLoan.ref.active.getBorrower().lastName
            userSelectedProductCategoriesVM.email = wrappedLoan.ref.active.getBorrower().userAccount.FilterUsername;
            userSelectedProductCategoriesVM.borrowerUserAccountId = wrappedLoan.ref.active.getBorrower().userAccount.userAccountId;
            userSelectedProductCategoriesVM.additionalRecipients = [];
            userSelectedProductCategoriesVM.sendEmail = false;
            //loan info
            userSelectedProductCategoriesVM.companyProfileId = applicationData.companyProfile.companyProfileId;
            userSelectedProductCategoriesVM.channelId = wrappedLoan.ref.channelId;
            userSelectedProductCategoriesVM.divisionId = wrappedLoan.ref.divisionId;
            userSelectedProductCategoriesVM.branchId = wrappedLoan.ref.branchId;
            userSelectedProductCategoriesVM.conciergeId = wrappedLoan.ref.conciergeId;
            userSelectedProductCategoriesVM.loanId = wrappedLoan.ref.loanId;
            userSelectedProductCategoriesVM.hearAboutUs = wrappedLoan.ref.hearAboutUs;
            userSelectedProductCategoriesVM.refinancePurpose = 1;
            userSelectedProductCategoriesVM.propertyType = wrappedLoan.ref.getSubjectProperty().propertyType;
            userSelectedProductCategoriesVM.occupancyType = wrappedLoan.ref.active.occupancyType;
            userSelectedProductCategoriesVM.numberOfUnits = wrappedLoan.ref.getSubjectProperty().numberOfUnits;
            userSelectedProductCategoriesVM.numberOfStories = wrappedLoan.ref.getSubjectProperty().numberOfStories;
            userSelectedProductCategoriesVM.impounds = wrappedLoan.ref.otherInterviewData.selectedImpoundsOption;
            userSelectedProductCategoriesVM.decisionScore = commonCalculatorSvc.GetLowestMiddleFicoScore(wrappedLoan, applicationData);
            userSelectedProductCategoriesVM.loanAmount = wrappedLoan.ref.loanAmount;
            userSelectedProductCategoriesVM.ltv = wrappedLoan.ref.getSubjectProperty().ltv;
            userSelectedProductCategoriesVM.cltv = wrappedLoan.ref.getSubjectProperty().cltv;
            userSelectedProductCategoriesVM.dti = wrappedLoan.ref.financialInfo.dti;
            userSelectedProductCategoriesVM.purchasePrice = wrappedLoan.ref.getSubjectProperty().purchasePrice;
            userSelectedProductCategoriesVM.estimatedValue = wrappedLoan.ref.getSubjectProperty().currentEstimatedValue;
            userSelectedProductCategoriesVM.cashout = wrappedLoan.ref.financialInfo.cashOutAmount;
            userSelectedProductCategoriesVM.stateName = wrappedLoan.ref.getSubjectProperty().stateName;
            userSelectedProductCategoriesVM.products = getSelectedProducts();

            $modal.open({
                backdrop: 'static',
                dialogFade: false,
                controller: 'ShareComparisonCtrl as ShareComparisonCtrl',
                templateUrl: 'angular/pricingresults/other/sharecomparisonmodal.html',
                windowClass: 'share-comparison-report-content',
                backdropClass: 'custom-modal-backdrop',
                resolve: {
                    wrappedLoan: function () {
                        return wrappedLoan;
                    },
                    applicationData: function () {
                        return applicationData;
                    },
                    userSelectedProductCategoriesVM: function () {
                        return userSelectedProductCategoriesVM;
                    }
                }
            });
        };

    }
})();