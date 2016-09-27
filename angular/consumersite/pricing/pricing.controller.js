// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
// <reference path="../advancedSearch/advancedSearch.service.ts" />
var consumersite;
(function (consumersite) {
    var PricingController = (function () {
        function PricingController(loan, loanAppPageContext, pricingService, navigationService, consumerLoanService, $scope, $location, applicationData, mockPricingService, $timeout, $modal, uiBlockWithSpinner, pricingAdvancedSearchService, pricingAllOptionsService, $http, detailedClosingCostsService, pricingResultsSvc) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.pricingService = pricingService;
            this.navigationService = navigationService;
            this.consumerLoanService = consumerLoanService;
            this.$scope = $scope;
            this.applicationData = applicationData;
            this.mockPricingService = mockPricingService;
            this.$timeout = $timeout;
            this.$modal = $modal;
            this.uiBlockWithSpinner = uiBlockWithSpinner;
            this.pricingAdvancedSearchService = pricingAdvancedSearchService;
            this.pricingAllOptionsService = pricingAllOptionsService;
            this.$http = $http;
            this.detailedClosingCostsService = detailedClosingCostsService;
            this.pricingResultsSvc = pricingResultsSvc;
            //
            // @todo-cc: Review this tuple , consider defining a class
            //
            this.metricsPricingAPR = { min: 0, avg: 0, max: 0 };
            this.metricsPricingMonthlyPayment = { min: 0, avg: 0, max: 0 };
            this.metricsPricingTotalCost = { min: 0, avg: 0, max: 0 };
            this.comparedId = null;
            this.haveMetricsBeenCalculated = false;
            this.resultsEx = [];
            this.parentSlide = false;
            this.parentSlide2 = false;
            this.slide = false;
            this.slide2 = false;
            //view search
            //get vs(): vm.IPricingAdvancedSearchViewModel {
            //    return this.loan.pricingSearch;
            //}
            //set vs(val: vm.IPricingAdvancedSearchViewModel) {
            //    this.loan.pricingSearch = val;
            //}
            this.showAllOptionsModal = function () {
                _this.pricingAllOptionsService.doModal(_this.loan, _this.vf);
            };
            this.showSearchModal = function () {
                _this.pricingAdvancedSearchService.openAdvancedSearchModal(_this.loan, _this.applicationData, function (getRates) {
                    if (getRates) {
                        _this.getProducts();
                    }
                });
            };
            /// zzp, 02/02/2016
            this.toggleDisclaimer = function (showDisclaimer) {
                _this.disclaimersHidden = showDisclaimer;
                window.scrollTo(0, document.body.scrollHeight);
            };
            this.showDetailedClosingCostsModal = function (productId) {
                var selectedProduct = (function () {
                    for (var i = 0; i <= _this.products.length; i++) {
                        if (_this.products[i].productId === productId)
                            return _this.products[i];
                    }
                })();
                if (selectedProduct) {
                    _this.openDetailedClosingCostsModal(selectedProduct);
                }
                ;
            };
            this.openDetailedClosingCostsModal = function (vm) {
                _this.detailedClosingCostsService.openModal(_this.loan, vm, function () {
                });
            };
            this.getProducts = function () {
                //
                // @todo: generalize for default values (e.g. (VALUE || LITERAL) == LITERAL )
                //
                _this.productFilter = "TopPicks";
                _this.haveMetricsBeenCalculated = false;
                var lvm = _this.loan.getLoan();
                // mapped 
                if ((lvm.getSubjectProperty().propertyType || "") == "") {
                    lvm.getSubjectProperty().propertyType = "1"; //srv.PropertyTypeEnum.SingleFamily;
                }
                //mapped 
                //lvm.active.occupancyType = srv.PropertyUsageTypeEnum.PrimaryResidence;
                if ((lvm.active.occupancyType || srv.PropertyUsageTypeEnum.None) == srv.PropertyUsageTypeEnum.None) {
                    lvm.active.occupancyType = srv.PropertyUsageTypeEnum.PrimaryResidence;
                }
                //not mapped 
                if ((lvm.loanAmount || 0) == 0) {
                    lvm.loanAmount = 500000;
                }
                //removed 
                if ((lvm.getSubjectProperty().stateName || "") == "") {
                    lvm.getSubjectProperty().stateName = "CA";
                }
                if ((lvm.financialInfo.dti || 0) == 0) {
                    lvm.financialInfo.dti = 40;
                }
                if ((lvm.getSubjectProperty().ltv || "0") == "0") {
                    lvm.getSubjectProperty().ltv = "80";
                }
                //removed  
                if ((lvm.getSubjectProperty().purchasePrice || 0) == 0) {
                    lvm.getSubjectProperty().purchasePrice = lvm.getSubjectProperty().currentEstimatedValue;
                }
                // removed 
                if ((lvm.getSubjectProperty().appraisedValue || 0) == 0) {
                    lvm.getSubjectProperty().appraisedValue = lvm.getSubjectProperty().currentEstimatedValue;
                }
                //removed 
                if ((lvm.otherInterviewData.firstPayment || 0) == 0) {
                    lvm.otherInterviewData.firstPayment = 5555;
                }
                //mapped 
                if ((lvm.getSubjectProperty().numberOfStories || 0) == 0) {
                    lvm.getSubjectProperty().numberOfStories = 1;
                }
                //mapped but not used....
                if ((lvm.getSubjectProperty().numberOfUnits || -1) == -1) {
                    lvm.getSubjectProperty().numberOfUnits = 1;
                }
                //mapped 
                lvm.getSubjectProperty().OccupancyType = srv.PropertyUsageTypeEnum.PrimaryResidence;
                if ((lvm.otherInterviewData.selectedDecisionScoreRange || "-1") == "-1") {
                    lvm.otherInterviewData.selectedDecisionScoreRange = "0";
                }
                if (!lvm.otherInterviewData.interviewId || lvm.otherInterviewData.interviewId == lib.getEmptyGuid()) {
                    lvm.otherInterviewData.interviewId = util.IdentityGenerator.nextGuid();
                }
                lvm.getLoanApplications()[0].getBorrower().userAccount.interviewId = lvm.otherInterviewData.interviewId;
                // lvm.getLoanApplications()[0].getBorrower().userAccount.isOnlineUser = true; // @todo-cc: Does not work on UserAccount Entity , and cannot be used until after email change anyhow
                //
                var loanCls = _this.consumerLoanService.prepareLoanViewModelForSubmit(_this.loan);
                var mock = false;
                if (mock == true) {
                    _this.getMockPricing();
                }
                if (mock == false) {
                    _this.uiBlockWithSpinner.call(function () { return _this.pricingService.getProducts(loanCls).$promise; }, 'Getting Rates. Please Wait.', function (loanData) {
                        //Capture UserAccountId
                        lvm.getLoanApplications()[0].getBorrower().userAccount.userAccountId = loanData.transactionInfo.borrowers[0].userAccount.userAccountId;
                        lvm.getLoanApplications()[0].getBorrower().userAccount.username = loanData.transactionInfo.borrowers[0].userAccount.username;
                        lvm.getLoanApplications()[0].getBorrower().email = lvm.getLoanApplications()[0].getBorrower().userAccount.username;
                        //Transform the Eligible Products from LoanVM to PricingRowVM
                        //
                        var eProducts = loanData.pricingResults.productListViewModel.eligibleProducts;
                        var results = [];
                        for (var item in eProducts) {
                            results.push({
                                productId: eProducts[item].productId,
                                LoanAmortizationTerm: eProducts[item].loanAmortizationTerm.toString(),
                                AmortizationType: eProducts[item].amortizationType == 1 ? "Fixed" : "ARM",
                                AdjustmentPeriod: eProducts[item].adjustmentPeriod.toString(),
                                TitleYears: (eProducts[item].amortizationType == 1 ? eProducts[item].loanAmortizationTerm.toString() : eProducts[item].loanAmortizationFixedTerm.toString()),
                                Rate: eProducts[item].rate.toString(),
                                APR: eProducts[item].paymentBreakdownModalVM.apr.toString(),
                                MonthlyPayment: eProducts[item].paymentBreakdownModalVM.totalMonthlyPayment.toString(),
                                TotalCost: eProducts[item].costDetails.totalLenderCosts.toString(),
                                LoanOptionType: eProducts[item].loanOptionType.toString(),
                                isLowCost: (eProducts[item].loanOptionType.toString() == "3" || eProducts[item].loanOptionType.toString() == "13" || eProducts[item].loanOptionType.toString() == "14"),
                                isTopPick: (eProducts[item].loanOptionType.toString() == "10" || eProducts[item].loanOptionType.toString() == "11" || eProducts[item].loanOptionType.toString() == "13" || eProducts[item].loanOptionType.toString() == "14" || eProducts[item].loanOptionType.toString() == "19"),
                                isLowRateARM: (eProducts[item].loanOptionType.toString() == "6" || eProducts[item].loanOptionType.toString() == "10"),
                                isPayoffQuickly: (eProducts[item].loanOptionType.toString() == "5" || eProducts[item].loanOptionType.toString() == "9" || eProducts[item].loanOptionType.toString() == "15" || eProducts[item].loanOptionType.toString() == "16"),
                                isLowFixed: (eProducts[item].loanOptionType.toString() == "1" || eProducts[item].loanOptionType.toString() == "11"),
                                isNoCost: (eProducts[item].loanOptionType.toString() == "2" || eProducts[item].loanOptionType.toString() == "8"),
                                compare: false
                            });
                        }
                        // @todo: Review: Static for now due to some 'this' keyword issue?
                        _this.haveMetricsBeenCalculated = false;
                        _this.resultsEx = results;
                    });
                }
            };
            this.getMockPricing = function () {
                _this.products = _this.mockPricingService.getProducts(_this.loan);
                _this.getProductMetrics(_this.products);
                return _this.products;
            };
            //
            this.getProductDetails = function (productId, $event) {
                var selectedProduct = (function () {
                    for (var i = 0; i <= _this.products.length; i++) {
                        if (_this.products[i].productId === productId)
                            return _this.products[i];
                    }
                })();
                if (selectedProduct) {
                    _this.openProductDetailsModal(selectedProduct);
                }
                ;
            };
            this.openProductDetailsModal = function (selectedProduct) {
                var productDetailsModal = _this.$modal.open({
                    templateUrl: "/angular/consumersite/pricing/productDetails/productDetails.html",
                    controller: function () {
                        return new consumersite.ProductDetailsController(productDetailsModal, selectedProduct);
                    },
                    controllerAs: 'productDetailsCtrl',
                    backdrop: true,
                    backdropClass: 'noBackdrop',
                    windowClass: 'flyout-right product-details-flyout'
                });
                productDetailsModal.result.then(function (selectedProduct) {
                    console.log(selectedProduct);
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };
            this.showDetails = function ($event) {
                _this.parentSlide = true;
                _this.$timeout(function () {
                    alert(_this.slide);
                    _this.slide = !_this.slide;
                }, 1);
                if ($event.stopPropagation)
                    $event.stopPropagation();
                else if ($event.cancelBubble)
                    $event.cancelBubble = true;
            };
            this.getProductMetrics = function (pricingRowViewModels) {
                _this.metricsPricingAPR = _this.calcMetrics(pricingRowViewModels, 'APR', parseFloat);
                _this.metricsPricingMonthlyPayment = _this.calcMetrics(pricingRowViewModels, 'MonthlyPayment', parseInt);
                _this.metricsPricingTotalCost = _this.calcMetrics(pricingRowViewModels, 'TotalCost', parseInt);
            };
            //sharecomparisonmodal.controller.js
            /* Comment1
            private openEmailPrompt = () => {
                var sendEmailReportModal = this.$modal.open({
                    templateUrl: "/angular/consumersite/pricing/sendEmailReport.html",
                    controller: () => {
                        return new sendEmailReportController(
                            sendEmailReportModal,
                            null
                        )
                    },
                    controllerAs: 'sendEmailReportCntrl',
                    backdrop: false,
                    windowClass: 'flyout-right sendemailreport-flyout',
                    backdropClass: 'custom-modal-backdrop'
                });
    
            };
            */
            this.filterBtnClicked = function (val) {
                if (val == "GetAdvancedFilter") {
                    _this.productFilter = "";
                    _this._activeFilterButton = val;
                }
                else {
                    _this._activeFilterButton = val;
                    _this.productFilter = val;
                }
            };
            this.clickCancelSendReportClick = function () {
                _this.$location1.url('/pricing');
            };
            this.selectProduct = function (productId) {
                for (var i = 0; i <= _this.products.length; i++) {
                    if (_this.products[i].productId === productId) {
                        _this.selectedRate = _this.products[i];
                        break;
                    }
                }
                if (_this.selectedRate != null) {
                    _this.loan.pricingProduct = _this.selectedRate;
                }
                _this.navigationService.goToPersonal();
            };
            this.productSortFunction = function (producta, productb) {
                var productA = producta;
                var productB = productb;
                var sortAsc = _this.vf.sortDirection != "DESC";
                switch (_this.vf.sortField) {
                    case "Term":
                        {
                            var terma = +productA.TitleYears;
                            var termb = +productB.TitleYears;
                            if (terma < termb) {
                                return (sortAsc ? -1 : 1);
                            }
                            else {
                                if (terma > termb) {
                                    return (sortAsc ? 1 : -1);
                                }
                            }
                        }
                        break;
                    case "Rate":
                        {
                            var ratea = +productA.APR;
                            var rateb = +productB.APR;
                            if (ratea < rateb) {
                                return (sortAsc ? -1 : 1);
                            }
                            else {
                                if (ratea > rateb) {
                                    return (sortAsc ? 1 : -1);
                                }
                            }
                        }
                        break;
                    case "Payment":
                        {
                            var paymenta = +productA.MonthlyPayment;
                            var paymentb = +productB.MonthlyPayment;
                            if (paymenta < paymentb) {
                                return (sortAsc ? -1 : 1);
                            }
                            else {
                                if (paymenta > paymentb) {
                                    return (sortAsc ? 1 : -1);
                                }
                            }
                        }
                        break;
                    default:
                        {
                            var paymenta = +productA.MonthlyPayment;
                            var paymentb = +productB.MonthlyPayment;
                            if (paymenta < paymentb) {
                                return (sortAsc ? -1 : 1);
                            }
                            else {
                                if (paymenta > paymentb) {
                                    return (sortAsc ? 1 : -1);
                                }
                            }
                        }
                        break;
                }
                return 0;
            };
            this.allOptionsFilter = function (product) {
                if (!_this.vf.show30Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "30") {
                    return false;
                }
                if (!_this.vf.show25Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "25") {
                    return false;
                }
                if (!_this.vf.show20Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "20") {
                    return false;
                }
                if (!_this.vf.show15Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "15") {
                    return false;
                }
                if (!_this.vf.show10Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "10") {
                    return false;
                }
                if (!_this.vf.show10ARM && product.AmortizationType == "ARM" && product.TitleYears == "10") {
                    return false;
                }
                if (!_this.vf.show7ARM && product.AmortizationType == "ARM" && product.TitleYears == "7") {
                    return false;
                }
                if (!_this.vf.show5ARM && product.AmortizationType == "ARM" && product.TitleYears == "5") {
                    return false;
                }
                if (!_this.vf.show3ARM && product.AmortizationType == "ARM" && product.TitleYears == "3") {
                    return false;
                }
                var maxInterest = +_this.vf.maxInterest;
                var apr = +product.APR;
                if (maxInterest < apr) {
                    return false;
                }
                var maxPayment = +_this.vf.maxPayment;
                if (_this.vf.maxPayment < product.MonthlyPayment) {
                    return false;
                }
                var maxCost = +_this.vf.maxCost;
                var totalCost = +product.TotalCost;
                if (maxCost < totalCost) {
                    return false;
                }
                return true;
            };
            //sharecomparisonmodal.controller.js
            this.openEmailPrompt = function () {
                var BroadcastSvc;
                //var pricingResultsSvc;
                var NavigationSvc;
                var sendEmailReportModal = _this.$modal.open({
                    templateUrl: "/angular/consumersite/pricing/sendEmailReport.html",
                    controller: function () {
                        return new sendEmailReportController(sendEmailReportModal, _this.loan, _this.applicationData, _this.$http, BroadcastSvc, _this.pricingResultsSvc, NavigationSvc);
                    },
                    controllerAs: 'sendEmailReportCntrl',
                    backdrop: false,
                    windowClass: 'flyout-right sendemailreport-flyout',
                    backdropClass: 'custom-modal-backdrop'
                });
            };
            this.sendEmailReport = function () {
                _this.openEmailPrompt();
            };
            this.openEmail = function () {
                _this.openEmailPrompt();
            };
            this.productFilterFunction = function (product) {
                if (!_this.allOptionsFilter(product)) {
                    return false;
                }
                switch (_this.productFilter) {
                    case "TopPicks":
                        return product.isTopPick;
                    case "LowRateARMs":
                        return product.isLowRateARM;
                    case "PayoffQuickly":
                        return product.isPayoffQuickly;
                    case "LowFixedRates":
                        return product.isLowFixed;
                    case "NoCost":
                        return product.isNoCost;
                    case "AllOptions":
                        return true;
                    case "CompareMyFavorites":
                        return product.compare;
                    default:
                        return true;
                }
            };
            this.isActiveFilter = function (title) {
                if (_this._activeFilterButton == title.toString()) {
                    return "pricing-filter-box active";
                }
                else {
                    return "pricing-filter-box";
                }
            };
            this.showAdvancedSearchModal = function () {
                _this.showSearchModal();
            };
            this.loanPurpose = [{ val: 1, text: 'Purchase' }, { val: 2, text: 'Refinance' }];
            this.creditScores = [{ val: 1, text: '720-739' }, { val: 2, text: '740-759' }];
            this.$location1 = $location;
            this._activeFilterButton = "TopPicks";
            this.productFilter = "TopPicks";
            this.vf = {
                show30Fixed: true,
                show25Fixed: true,
                show20Fixed: true,
                show15Fixed: true,
                show10Fixed: true,
                show10ARM: true,
                show7ARM: true,
                show5ARM: true,
                show3ARM: true,
                sortField: 'Payment',
                sortDirection: 'ASC',
                maxInterest: '20',
                maxPayment: '50000',
                maxCost: '50000'
            };
            this.loan.setDefaultsForPricing();
            this.getProducts();
        }
        Object.defineProperty(PricingController.prototype, "showAllOptions", {
            get: function () {
                return this.activeFilterButton == "GetAdvancedFilter";
            },
            set: function (val) {
                //read only
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "isRefi", {
            get: function () {
                return this.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance;
            },
            set: function (isRefi) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "isPurch", {
            get: function () {
                return this.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase;
            },
            set: function (isPurch) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "loanPurposeType", {
            get: function () {
                return this.loan.loanPurposeType;
            },
            set: function (loanPurposeType) {
                this.loan.loanPurposeType = loanPurposeType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "propertyType", {
            get: function () {
                return this.loan.getLoan().getSubjectProperty().propertyType;
            },
            set: function (value) {
                this.loan.getLoan().getSubjectProperty().propertyType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "homeUseType", {
            get: function () {
                return this.loan.getLoan().active.occupancyType;
            },
            set: function (value) {
                this.loan.getLoan().active.occupancyType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "taxType", {
            get: function () {
                return this.loan.getLoan().otherInterviewData.selectedImpoundsOption;
            },
            set: function (taxType) {
                this.loan.getLoan().otherInterviewData.selectedImpoundsOption = taxType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "employmentStatusType", {
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
        Object.defineProperty(PricingController.prototype, "secondMortgageType", {
            get: function () {
                return this.loan.getLoan().otherInterviewData.existingSecondMortgage;
            },
            set: function (secondMortgageType) {
                this.loan.getLoan().otherInterviewData.existingSecondMortgage = secondMortgageType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "payoffSecondMortgageType", {
            get: function () {
                return this.loan.secondMortgageRefinanceComment;
            },
            set: function (payoffSecondMortgageType) {
                this.loan.secondMortgageRefinanceComment = payoffSecondMortgageType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "helocCreditLimit", {
            get: function () {
                return this.loan.getLoan().otherInterviewData.maximumCreditLine;
            },
            set: function (helocCreditLimit) {
                this.loan.getLoan().otherInterviewData.maximumCreditLine = helocCreditLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "helocBalance", {
            get: function () {
                return this.loan.outstandingBalance;
            },
            set: function (helocBalance) {
                this.loan.outstandingBalance = helocBalance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "has2nd", {
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
        Object.defineProperty(PricingController.prototype, "is2ndHeloc", {
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
        Object.defineProperty(PricingController.prototype, "is2ndFixed", {
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
        Object.defineProperty(PricingController.prototype, "products", {
            get: function () {
                var filtered = this.resultsEx.filter(this.productFilterFunction, this);
                filtered.sort(this.productSortFunction);
                if (!this.haveMetricsBeenCalculated) {
                    this.getProductMetrics(filtered);
                    this.haveMetricsBeenCalculated = true;
                }
                return filtered;
            },
            set: function (value) {
                this.resultsEx = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "vf", {
            //view filter
            get: function () {
                return this.loan.pricingFilter;
            },
            set: function (val) {
                this.loan.pricingFilter = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "disclaimersHidden", {
            get: function () {
                return this._disclaimersHidden;
            },
            set: function (value) {
                this._disclaimersHidden = value;
            },
            enumerable: true,
            configurable: true
        });
        PricingController.prototype.calcMetrics = function (array, prop, fn) {
            var values = array.map(function (el) {
                return fn(el[prop]);
            });
            var sum = 0;
            values.forEach(function (item) {
                sum += item;
            });
            return {
                max: Math.max.apply(Math, values),
                min: Math.min.apply(Math, values),
                avg: sum / ((values.length > 0 ? values.length : 1) * 1.)
            };
        };
        Object.defineProperty(PricingController.prototype, "productFilter", {
            get: function () {
                return this._productFilter;
            },
            set: function (value) {
                switch (value) {
                    case "AllOptions":
                        break;
                    case "ClearFilter":
                        this._productFilter = "";
                        this.haveMetricsBeenCalculated = false;
                        break;
                    default:
                        this._productFilter = value;
                        this.haveMetricsBeenCalculated = false;
                        break;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "showGrid", {
            get: function () {
                return (this.products.length > 0); // && (this.state == vm.PricingState.None));
            },
            set: function (value) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "showAll", {
            get: function () {
                return (this.showAllFixed && this.showAllARM);
            },
            set: function (value) {
                if (this.showAll != value) {
                    this.showAllFixed = value;
                    this.showAllARM = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "showAllFixed", {
            get: function () {
                return (this.vf.show30Fixed &&
                    this.vf.show25Fixed &&
                    this.vf.show20Fixed &&
                    this.vf.show15Fixed &&
                    this.vf.show10Fixed);
            },
            set: function (value) {
                if (this.showAllFixed != value) {
                    this.vf.show30Fixed = value;
                    this.vf.show25Fixed = value;
                    this.vf.show20Fixed = value;
                    this.vf.show15Fixed = value;
                    this.vf.show10Fixed = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "show30Fixed", {
            get: function () {
                return this.vf.show30Fixed;
            },
            set: function (value) {
                this.vf.show30Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "show25Fixed", {
            get: function () {
                return this.vf.show25Fixed;
            },
            set: function (value) {
                this.vf.show25Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "show20Fixed", {
            get: function () {
                return this.vf.show20Fixed;
            },
            set: function (value) {
                this.vf.show20Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "show15Fixed", {
            get: function () {
                return this.vf.show15Fixed;
            },
            set: function (value) {
                this.vf.show15Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "show10Fixed", {
            get: function () {
                return this.vf.show10Fixed;
            },
            set: function (value) {
                this.vf.show10Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "showAllARM", {
            //
            get: function () {
                return (this.vf.show10ARM && this.vf.show7ARM && this.vf.show5ARM && this.vf.show3ARM);
            },
            set: function (value) {
                if (this.showAllARM != value) {
                    this.vf.show10ARM = value;
                    this.vf.show7ARM = value;
                    this.vf.show5ARM = value;
                    this.vf.show3ARM = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "show10ARM", {
            get: function () {
                return this.vf.show10ARM;
            },
            set: function (value) {
                this.vf.show10ARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "show7ARM", {
            get: function () {
                return this.vf.show7ARM;
            },
            set: function (value) {
                this.vf.show7ARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "show5ARM", {
            get: function () {
                return this.vf.show5ARM;
            },
            set: function (value) {
                this.vf.show5ARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "show3ARM", {
            get: function () {
                return this.vf.show3ARM;
            },
            set: function (value) {
                this.vf.show3ARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "sortField", {
            //
            get: function () {
                return this.vf.sortField;
            },
            set: function (value) {
                this.vf.sortField = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "sortDirection", {
            get: function () {
                return this.vf.sortDirection;
            },
            set: function (value) {
                this.vf.sortDirection = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "isVAEligible", {
            get: function () {
                return this._isVAEligible;
            },
            set: function (value) {
                this._isVAEligible = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "wasVAUsedBefore", {
            get: function () {
                return this._wasVAUsedBefore;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "onVADisability", {
            get: function () {
                return this._onVADisablity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "onVADisablity", {
            set: function (value) {
                this._onVADisablity = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "typeImpounds", {
            get: function () {
                return PricingController.lookup_impounds;
            },
            set: function (typeImpounds) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingController.prototype, "NumberOfUnits", {
            get: function () {
                return this.loan.getLoan().getSubjectProperty().numberOfUnits;
            },
            set: function (value) {
                this.loan.getLoan().getSubjectProperty().numberOfUnits = value;
            },
            enumerable: true,
            configurable: true
        });
        PricingController.prototype.NumberOfUnitTypes = function () {
            return this.applicationData.lookup.numberOfUnits;
        };
        Object.defineProperty(PricingController.prototype, "activeFilterButton", {
            get: function () {
                return this._activeFilterButton;
            },
            set: function (value) {
                this._activeFilterButton = value;
            },
            enumerable: true,
            configurable: true
        });
        PricingController.className = "pricingController";
        PricingController.$inject = [
            'loan',
            'loanAppPageContext',
            'pricingService',
            'navigationService',
            'consumerLoanService',
            '$scope',
            '$location',
            'applicationData',
            'mockPricingService',
            '$timeout',
            '$modal',
            'uiBlockWithSpinner',
            'pricingAdvancedSearchService',
            'pricingAllOptionsService',
            '$http',
            'detailedClosingCostsService',
            'pricingResultsSvc'
        ];
        //Not happy about this.  Quick fix for release 01/06/16 
        PricingController.lookup_impounds = [
            { text: 'Include in Payment', value: srv.impoundType.taxesAndInsurance.toString() },
            { text: 'Don\'t Include in Payment.', value: srv.impoundType.noImpound.toString() },
        ];
        return PricingController;
    })();
    consumersite.PricingController = PricingController;
    moduleRegistration.registerController(consumersite.moduleName, PricingController); //.filter("productFilter", productFilterFunction);   
    var RangedSelection = (function () {
        function RangedSelection() {
        }
        Object.defineProperty(RangedSelection.prototype, "Max", {
            get: function () {
                return this._max;
            },
            set: function (value) {
                this._max = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RangedSelection.prototype, "Min", {
            get: function () {
                return this._min;
            },
            set: function (value) {
                this._min = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RangedSelection.prototype, "Selected", {
            get: function () {
                return this._selected;
            },
            set: function (value) {
                this._selected = value;
            },
            enumerable: true,
            configurable: true
        });
        return RangedSelection;
    })();
    consumersite.RangedSelection = RangedSelection;
})(consumersite || (consumersite = {}));
//# sourceMappingURL=pricing.controller.js.map