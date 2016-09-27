/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../viewModels/loan.viewModel.ts" />
/// <reference path="../../consumersite.module.ts" />
var consumersite;
(function (consumersite) {
    var PricingAdvancedSearchController = (function () {
        function PricingAdvancedSearchController(loan, $modalInstance, applicationData) {
            var _this = this;
            this.loan = loan;
            this.$modalInstance = $modalInstance;
            this.applicationData = applicationData;
            //view search
            //public get vs(): vm.IPricingAdvancedSearchViewModel {
            //    return this.loan.pricingSearch;
            //}
            //public set vs(val: vm.IPricingAdvancedSearchViewModel) {
            //    this.loan.pricingSearch = val;
            //}
            //The "Get my Rates" button should call the close and pass in the pricingAdvancedSearchViewModel
            this.getRates = function () {
                //var pricingAdvancedSearchModel: vm.IPricingAdvancedSearchViewModel = {
                //    getRatesClicked: true
                //};
                //this.loan.pricingSearch = pricingAdvancedSearchModel;
                _this.$modalInstance.close(_this.loan);
            };
            this.close = function () {
                _this.$modalInstance.close(_this.loan);
            };
            //if the user clicks outside of the modal or on the "close" in the top right corner.
            this.dismiss = function () {
                _this.$modalInstance.dismiss("Canceled by user");
            };
            this.clearVAInfomation = function () {
                if (!_this._isVAEligible) {
                    _this.isVAUsedBefore = false;
                    _this.isOnVADisablity = false;
                    _this.militaryBranch = "";
                }
            };
            this.loanPurpose = [{ val: 1, text: 'Purchase' }, { val: 2, text: 'Refinance' }];
        }
        Object.defineProperty(PricingAdvancedSearchController.prototype, "isRefi", {
            get: function () {
                return this.loanPurposeType == 2 /* Refinance */;
            },
            set: function (isRefi) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "isPurch", {
            get: function () {
                return this.loanPurposeType == 1 /* Purchase */;
            },
            set: function (isPurch) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "has2nd", {
            get: function () {
                // secondMortgageType = "0"; // 0:"No" ; 1:"Fixed Rate" ; 2:"Home Equity Line of Credit"
                return this.isRefi && this.secondMortgageType != "0";
            },
            set: function (has2nd) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "is2ndHeloc", {
            get: function () {
                // secondMortgageType = "0"; // 0:"No" ; 1:"Fixed Rate" ; 2:"Home Equity Line of Credit"
                return this.has2nd && this.secondMortgageType == "2";
            },
            set: function (is2ndHeloc) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "loanPurposeType", {
            get: function () {
                return this.loan.loanPurposeType;
            },
            set: function (loanPurposeType) {
                this.loan.loanPurposeType = loanPurposeType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "propertyType", {
            get: function () {
                return this.loan.getLoan().getSubjectProperty().propertyType;
            },
            set: function (value) {
                this.loan.getLoan().getSubjectProperty().propertyType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "homeUseType", {
            get: function () {
                return this.loan.getLoan().active.occupancyType;
            },
            set: function (value) {
                this.loan.getLoan().active.occupancyType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "taxType", {
            get: function () {
                return this.loan.getLoan().otherInterviewData.selectedImpoundsOption;
            },
            set: function (taxType) {
                this.loan.getLoan().otherInterviewData.selectedImpoundsOption = taxType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "employmentStatusType", {
            get: function () {
                var employmentType = this.loan.loanApp.borrower.employments[0].employmentType;
                var employmentTypeStr = employmentType.toString();
                return employmentTypeStr;
            },
            set: function (employmentStatusType) {
                var employmentStatusTypeNum = parseInt(employmentStatusType);
                if (employmentStatusTypeNum != NaN) {
                    this.loan.loanApp.borrower.employments[0].employmentType = employmentStatusTypeNum;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "secondMortgageType", {
            get: function () {
                return this.loan.getLoan().otherInterviewData.existingSecondMortgage;
            },
            set: function (secondMortgageType) {
                this.loan.getLoan().otherInterviewData.existingSecondMortgage = secondMortgageType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "is2ndFixed", {
            get: function () {
                // secondMortgageType = "0"; // 0:"No" ; 1:"Fixed Rate" ; 2:"Home Equity Line of Credit"
                return this.has2nd && this.secondMortgageType == "1";
            },
            set: function (is2ndFixed) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "isVAEligible", {
            get: function () {
                return this._isVAEligible;
            },
            set: function (val) {
                this._isVAEligible = val;
                if (val == false) {
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "isVAUsedBefore", {
            get: function () {
                return this._isVAUsedBefore;
            },
            set: function (val) {
                this._isVAUsedBefore = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "isOnVADisablity", {
            get: function () {
                return this._isOnVADisablity;
            },
            set: function (val) {
                this._isOnVADisablity = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "militaryBranch", {
            get: function () {
                return this._militaryBranch;
            },
            set: function (val) {
                this._militaryBranch = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdvancedSearchController.prototype, "militaryBranches", {
            get: function () {
                return PricingAdvancedSearchController.militaryBranches_lookup;
            },
            enumerable: true,
            configurable: true
        });
        PricingAdvancedSearchController.militaryBranches_lookup = [
            { text: 'Army', value: 1 /* Army */.toString() },
            { text: 'Air Force', value: 0 /* AirForce */.toString() },
            { text: 'Marines', value: 2 /* Marines */.toString() },
            { text: 'Navy', value: 3 /* Navy */.toString() },
            { text: 'Other', value: 4 /* Other */.toString() },
        ];
        return PricingAdvancedSearchController;
    })();
    var PricingAdvancedSearchService = (function () {
        function PricingAdvancedSearchService($log, $modal) {
            var _this = this;
            this.$log = $log;
            this.$modal = $modal;
            //successCallback: (getRates: boolean) => void;
            this.openAdvancedSearchModal = function (loan, applicationData, successCallback, errorCallback) {
                PricingAdvancedSearchService._loan = loan;
                //  this.successCallback = successCallback;
                var loanPurposeType = loan.getLoan().loanPurposeType;
                var isRefi = loanPurposeType == 2 /* Refinance */;
                var isPurch = loanPurposeType == 1 /* Purchase */;
                var employmentType = loan.loanApp.borrower.employments[0].employmentType;
                var employmentTypeStr = employmentType.toString();
                var secondMortgageType = loan.getLoan().otherInterviewData.existingSecondMortgage;
                var has2nd = isRefi && secondMortgageType != "0";
                var numUnits = loan.getLoan().getSubjectProperty().numberOfUnits.toString();
                //load IPricingAdvancedSearchViewModel from loanViewModel
                var searchModal = _this.$modal.open({
                    templateUrl: '/angular/consumersite/pricing/advancedSearch/advancedSearch.html',
                    backdrop: true,
                    backdropClass: 'noBackdrop',
                    windowClass: 'advancedSearchPosition',
                    controller: function () {
                        return new PricingAdvancedSearchController(_this.loan, searchModal, applicationData);
                    },
                    controllerAs: 'advSearchCntrl',
                });
                searchModal.result.then(
                //success
                function (results) {
                    console.log("closed");
                    // if (results.pricingSearch.getRatesClicked = true) {
                    successCallback(true);
                    // }
                    // else {
                    successCallback(false);
                    //}
                }, 
                //cancel
                function (reason) {
                    console.log("dismissed");
                    console.log(reason);
                });
            };
        }
        Object.defineProperty(PricingAdvancedSearchService.prototype, "loan", {
            get: function () {
                return PricingAdvancedSearchService._loan;
            },
            enumerable: true,
            configurable: true
        });
        PricingAdvancedSearchService.prototype.set = function (val) {
            PricingAdvancedSearchService._loan = val;
        };
        PricingAdvancedSearchService.className = 'pricingAdvancedSearchService';
        PricingAdvancedSearchService.$inject = ['$log', '$modal'];
        return PricingAdvancedSearchService;
    })();
    consumersite.PricingAdvancedSearchService = PricingAdvancedSearchService;
    moduleRegistration.registerService(consumersite.moduleName, PricingAdvancedSearchService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=advancedSearch.service.js.map