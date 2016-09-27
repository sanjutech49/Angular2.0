// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
// <reference path="../advancedSearch/advancedSearch.service.ts" />

module consumersite {
    export class PricingController {
        static className = "pricingController";

        static $inject = [
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
            //,
            //'BroadcastSvc',
            //'NavigationSvc'
        ];

        constructor(
            private loan: vm.Loan,
            private loanAppPageContext: LoanAppPageContext,
            private pricingService: PricingService,
            private navigationService: UINavigationService,
            private consumerLoanService: ConsumerLoanService,
            private $scope: ng.IScope, $location,
            private applicationData: any,
            private mockPricingService: MockPricingService,
            private $timeout: ng.ITimeoutService,
            private $modal: ng.ui.bootstrap.IModalService,
            private uiBlockWithSpinner: UIBlockWithSpinner,
            private pricingAdvancedSearchService: PricingAdvancedSearchService,
            private pricingAllOptionsService: PricingAllOptionsService,
            private $http,
            private detailedClosingCostsService: DetailedClosingCostsService,
            private pricingResultsSvc
        // private NavigationSvc
        ) {

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
            }

            this.loan.setDefaultsForPricing();

            this.getProducts();

        }



        //applicationdata lookup  values
        loanPurpose: OptionViewModel[];
        creditScores: OptionViewModel[];
        propertyTypes: OptionViewModel[];
        taxTypes: OptionViewModel[];
        employmentStatusTypes: OptionViewModel[];
        secondMortgageTypes: OptionViewModel[];
        payoffSecondMortgageTypes: OptionViewModel[];


        get showAllOptions(): boolean {
            return this.activeFilterButton == "GetAdvancedFilter";
        }
        set showAllOptions(val: boolean) {
            //read only
        }
        get isRefi(): boolean {
            return this.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance;
        }
        set isRefi(isRefi: boolean) {
            /*Read Only*/
        }

        get isPurch(): boolean {
            return this.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase;
        }
        set isPurch(isPurch: boolean) {
            /*Read Only*/
        }


        //Search Properties
        priceSearch: PriceSearchViewModel;


        get loanPurposeType(): srv.LoanPurposeTypeEnum {
            return this.loan.loanPurposeType;
        }
        set loanPurposeType(loanPurposeType: srv.LoanPurposeTypeEnum) {
            this.loan.loanPurposeType = loanPurposeType;
        }

        get propertyType(): string {
            return this.loan.getLoan().getSubjectProperty().propertyType;
        }
        set propertyType(value: string) {
            this.loan.getLoan().getSubjectProperty().propertyType = value;
        }

        get homeUseType(): srv.PropertyUsageTypeEnum {
            return this.loan.getLoan().active.occupancyType;
        }
        set homeUseType(value: srv.PropertyUsageTypeEnum) {
            this.loan.getLoan().active.occupancyType = value;
        }


        get taxType(): string {
            return this.loan.getLoan().otherInterviewData.selectedImpoundsOption;
        }
        set taxType(taxType: string) {
            this.loan.getLoan().otherInterviewData.selectedImpoundsOption = taxType;
        }


        get employmentStatusType(): string {
            var employmentType = this.loan.loanApp.borrower.employments[0].employmentType;
            var employmentTypeStr = (<number>employmentType).toString();
            return employmentTypeStr;
        }
        set employmentStatusType(employmentStatusType: string) {
            var employmentStatusTypeNum = parseInt(employmentStatusType);
            if (employmentStatusTypeNum != NaN) {
                this.loan.loanApp.borrower.employments[0].employmentType = employmentStatusTypeNum;
            }
        }

        get secondMortgageType(): string {
            return this.loan.getLoan().otherInterviewData.existingSecondMortgage;
        }
        set secondMortgageType(secondMortgageType: string) {
            this.loan.getLoan().otherInterviewData.existingSecondMortgage = secondMortgageType;
        }

        get payoffSecondMortgageType(): string {
            return this.loan.secondMortgageRefinanceComment;
        }
        set payoffSecondMortgageType(payoffSecondMortgageType: string) {
            this.loan.secondMortgageRefinanceComment = payoffSecondMortgageType;
        }

        get helocCreditLimit(): number {
            return this.loan.getLoan().otherInterviewData.maximumCreditLine;
        }
        set helocCreditLimit(helocCreditLimit: number) {
            this.loan.getLoan().otherInterviewData.maximumCreditLine = helocCreditLimit;
        }

        get helocBalance(): number {
            return this.loan.outstandingBalance;
        }
        set helocBalance(helocBalance: number) {
            this.loan.outstandingBalance = helocBalance;
        }

        get has2nd(): boolean {
            // secondMortgageType = "0"; // 0:"No" ; 1:"Fixed Rate" ; 2:"Home Equity Line of Credit"
            return this.isRefi && this.secondMortgageType != "0";
        }
        set has2nd(has2nd: boolean) {
            /*Read Only*/
        }

        get is2ndHeloc(): boolean {
            // secondMortgageType = "0"; // 0:"No" ; 1:"Fixed Rate" ; 2:"Home Equity Line of Credit"
            return this.has2nd && this.secondMortgageType == "2";
        }
        set is2ndHeloc(is2ndHeloc: boolean) {
            /*Read Only*/
        }

        get is2ndFixed(): boolean {
            // secondMortgageType = "0"; // 0:"No" ; 1:"Fixed Rate" ; 2:"Home Equity Line of Credit"
            return this.has2nd && this.secondMortgageType == "1";
        }

        set is2ndFixed(is2ndFixed: boolean) {
            /*Read Only*/
        }


        $location1;

        selectedRate: vm.PricingRowViewModel;

        //
        // @todo-cc: Review this tuple , consider defining a class
        //
        metricsPricingAPR = { min: 0, avg: 0, max: 0 };
        metricsPricingMonthlyPayment = { min: 0, avg: 0, max: 0 };
        metricsPricingTotalCost = { min: 0, avg: 0, max: 0 };

        comparedId = null;
        private haveMetricsBeenCalculated = false;

        resultsEx = [];
        get products() {
            var filtered = this.resultsEx.filter(this.productFilterFunction, this);
            filtered.sort(this.productSortFunction);
            if (!this.haveMetricsBeenCalculated) {
                this.getProductMetrics(filtered);
                this.haveMetricsBeenCalculated = true;
            }
            return filtered;
        }
        set products(value: vm.PricingRowViewModel[]) {
            this.resultsEx = value;
        }

        parentSlide: boolean = false;

        parentSlide2: boolean = false;

        slide: boolean = false;

        slide2: boolean = false;
        //view filter
        get vf(): vm.PricingFilterViewModel {
            return this.loan.pricingFilter;
        }
        set vf(val: vm.PricingFilterViewModel) {
            this.loan.pricingFilter = val;
        }
        //view search
        //get vs(): vm.IPricingAdvancedSearchViewModel {
        //    return this.loan.pricingSearch;
        //}
        //set vs(val: vm.IPricingAdvancedSearchViewModel) {
        //    this.loan.pricingSearch = val;
        //}
        private showAllOptionsModal = () => {
            this.pricingAllOptionsService.doModal(this.loan, this.vf);
        }

        private showSearchModal = () => {
            this.pricingAdvancedSearchService.openAdvancedSearchModal(this.loan, this.applicationData, (getRates: boolean) => {
                if (getRates) {
                    this.getProducts();
                }
            });
        }

        /// zzp, 02/02/2012
        _disclaimersHidden: boolean;
        get disclaimersHidden(): boolean {
            return this._disclaimersHidden;
        }
        set disclaimersHidden(value: boolean) {
            this._disclaimersHidden = value;
        }

        /// zzp, 02/02/2016
        toggleDisclaimer = (showDisclaimer) => {

            this.disclaimersHidden = showDisclaimer;

            window.scrollTo(0, document.body.scrollHeight);
        }

        private showDetailedClosingCostsModal = (productId) => {
            var selectedProduct: vm.PricingRowViewModel = ((): vm.PricingRowViewModel => {
                for (var i = 0; i <= this.products.length; i++) {
                    if (this.products[i].productId === productId)
                        return this.products[i];
                }
            })();

            if (selectedProduct) {
                this.openDetailedClosingCostsModal(selectedProduct);
            };

        }

        private openDetailedClosingCostsModal = (vm: vm.PricingRowViewModel) => {
            this.detailedClosingCostsService.openModal(this.loan, vm, () => {

            });
        }

        getProducts = () => {
            //
            // @todo: generalize for default values (e.g. (VALUE || LITERAL) == LITERAL )
            //
            this.productFilter = "TopPicks";
            this.haveMetricsBeenCalculated = false;

            var lvm = this.loan.getLoan();
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
            var loanCls = this.consumerLoanService.prepareLoanViewModelForSubmit(this.loan);



            var mock = false;
            if (mock == true) {
                this.getMockPricing();
            }
            if (mock == false) {
                this.uiBlockWithSpinner.call<srv.ILoanViewModel>(() => this.pricingService.getProducts(loanCls).$promise, 'Getting Rates. Please Wait.', loanData => {

                    //Capture UserAccountId
                    lvm.getLoanApplications()[0].getBorrower().userAccount.userAccountId = loanData.transactionInfo.borrowers[0].userAccount.userAccountId;
                    lvm.getLoanApplications()[0].getBorrower().userAccount.username = loanData.transactionInfo.borrowers[0].userAccount.username;
                    lvm.getLoanApplications()[0].getBorrower().email = lvm.getLoanApplications()[0].getBorrower().userAccount.username;

                    //Transform the Eligible Products from LoanVM to PricingRowVM
                    //
                    var eProducts = loanData.pricingResults.productListViewModel.eligibleProducts;
                    var results: vm.PricingRowViewModel[] = [];
                    for (var item in eProducts) {
                        results.push(
                            {
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
                    this.haveMetricsBeenCalculated = false;
                    this.resultsEx = results;
                });
            }
        }

        getMockPricing = (): consumersite.vm.PricingRowViewModel[] => {
            this.products = <consumersite.vm.PricingRowViewModel[]>this.mockPricingService.getProducts(this.loan);
            this.getProductMetrics(this.products);
            return this.products;
        }
        //
        getProductDetails = (productId: string, $event): void => {
            var selectedProduct: vm.PricingRowViewModel = ((): vm.PricingRowViewModel => {
                for (var i = 0; i <= this.products.length; i++) {
                    if (this.products[i].productId === productId)
                        return this.products[i];
                }
            })();

            if (selectedProduct) {
                this.openProductDetailsModal(selectedProduct);
            };
        }

        private openProductDetailsModal = (selectedProduct) => {
            var productDetailsModal = this.$modal.open({
                templateUrl: "/angular/consumersite/pricing/productDetails/productDetails.html",
                controller: () => {
                    return new ProductDetailsController(
                        productDetailsModal,
                        selectedProduct
                    )
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

        private showDetails = ($event): void => {
            this.parentSlide = true;
            this.$timeout(() => {
                alert(this.slide);
                this.slide = !this.slide;
            }, 1)

            if ($event.stopPropagation) $event.stopPropagation();
            else if ($event.cancelBubble) $event.cancelBubble = true;
        }


        calcMetrics(array, prop, fn): any /*{ max: number, min: number, avg: number }*/ {
            var values = array.map(function (el) {
                return fn(el[prop]);
            });

            var sum: number = 0;
            values.forEach(function (item) {
                sum += item;
            });

            return {
                max: Math.max.apply(Math, values),
                min: Math.min.apply(Math, values),
                avg: sum / ((values.length > 0 ? values.length : 1) * 1.)
            };
        }

        private getProductMetrics = (pricingRowViewModels: ng.IPromise<vm.PricingRowViewModel[]> | vm.PricingRowViewModel[]): void => {
            this.metricsPricingAPR = this.calcMetrics(pricingRowViewModels, 'APR', parseFloat);
            this.metricsPricingMonthlyPayment = this.calcMetrics(pricingRowViewModels, 'MonthlyPayment', parseInt);
            this.metricsPricingTotalCost = this.calcMetrics(pricingRowViewModels, 'TotalCost', parseInt);
        }

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









        filterBtnClicked = (val) => {
            if (val == "GetAdvancedFilter") {
                this.productFilter = "";
                this._activeFilterButton = val;
            }
            else {
                this._activeFilterButton = val;
                this.productFilter = val;
            }
        }


        clickCancelSendReportClick = () => {
            this.$location1.url('/pricing');
        };

        selectProduct = (productId: string) => {
            for (var i = 0; i <= this.products.length; i++) {
                if (this.products[i].productId === productId) {
                    this.selectedRate = this.products[i];
                    break;
                }
            }
            if (this.selectedRate != null) {
                this.loan.pricingProduct = this.selectedRate;
            }
            this.navigationService.goToPersonal();
        }


        //Filter and sort properties and methods
        _productFilter: string;
        get productFilter(): string {
            return this._productFilter;
        }
        set productFilter(value: string) {
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
        }

        productSortFunction = (producta: any, productb: any): number => {
            var productA = <vm.PricingRowViewModel>producta;
            var productB = <vm.PricingRowViewModel>productb;
            var sortAsc = this.vf.sortDirection != "DESC";
            switch (this.vf.sortField) {
                case "Term":
                    {
                        var terma = +productA.TitleYears;
                        var termb = +productB.TitleYears;
                        if (terma < termb) {
                            return (sortAsc ? -1 : 1);
                        } else {
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
                        } else {
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
                        } else {
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
                        } else {
                            if (paymenta > paymentb) {
                                return (sortAsc ? 1 : -1);
                            }
                        }
                    }
                    break;
            }
            return 0;
        }

        allOptionsFilter = (product: consumersite.vm.PricingRowViewModel): boolean  => {
            if (!this.vf.show30Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "30") {
                return false;
            }

            if (!this.vf.show25Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "25") {
                return false;
            }

            if (!this.vf.show20Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "20") {
                return false;
            }

            if (!this.vf.show15Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "15") {
                return false;
            }

            if (!this.vf.show10Fixed && product.AmortizationType == "Fixed" && product.TitleYears == "10") {
                return false;
            }

            if (!this.vf.show10ARM && product.AmortizationType == "ARM" && product.TitleYears == "10") {
                return false;
            }

            if (!this.vf.show7ARM && product.AmortizationType == "ARM" && product.TitleYears == "7") {
                return false;
            }

            if (!this.vf.show5ARM && product.AmortizationType == "ARM" && product.TitleYears == "5") {
                return false;
            }

            if (!this.vf.show3ARM && product.AmortizationType == "ARM" && product.TitleYears == "3") {
                return false;
            }
            var maxInterest = +this.vf.maxInterest;
            var apr = +product.APR;
            if (maxInterest < apr) {
                return false;
            }
            var maxPayment = +this.vf.maxPayment;
            if (this.vf.maxPayment < product.MonthlyPayment) {
                return false;
            }
            var maxCost = + this.vf.maxCost;
            var totalCost = +product.TotalCost;
            if (maxCost < totalCost) {
                return false;
            }
            return true;
        }
        //sharecomparisonmodal.controller.js
        private openEmailPrompt = () => {

            var BroadcastSvc;
            //var pricingResultsSvc;
            var NavigationSvc;


            var sendEmailReportModal = this.$modal.open({
                templateUrl: "/angular/consumersite/pricing/sendEmailReport.html",
                controller: () => {
                    return new sendEmailReportController(
                        sendEmailReportModal,
                        this.loan,
                        this.applicationData,
                        this.$http,
                        BroadcastSvc,
                        this.pricingResultsSvc,
                        NavigationSvc
                    )
                },
                controllerAs: 'sendEmailReportCntrl',
                backdrop: false,
                windowClass: 'flyout-right sendemailreport-flyout',
                backdropClass: 'custom-modal-backdrop'
            });

        };

        sendEmailReport = () => {
            this.openEmailPrompt();


        }

        openEmail = () => {
            this.openEmailPrompt();
        }

        productFilterFunction = (product: vm.PricingRowViewModel) => {
            if (!this.allOptionsFilter(product)) {
                return false;
            }
            switch (this.productFilter) {
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
        }

        get showGrid(): boolean {
            return (this.products.length > 0);// && (this.state == vm.PricingState.None));
        }

        set showGrid(value: boolean) {
            /*Read Only*/
        }

        get showAll(): boolean {
            return (this.showAllFixed && this.showAllARM);
        }

        set showAll(value: boolean) {
            if (this.showAll != value) {
                this.showAllFixed = value;
                this.showAllARM = value;
            }
        }

        get showAllFixed(): boolean {
            return (this.vf.show30Fixed &&
                this.vf.show25Fixed &&
                this.vf.show20Fixed &&
                this.vf.show15Fixed &&
                this.vf.show10Fixed);
        }
        set showAllFixed(value: boolean) {
            if (this.showAllFixed != value) {
                this.vf.show30Fixed = value;
                this.vf.show25Fixed = value;
                this.vf.show20Fixed = value;
                this.vf.show15Fixed = value;
                this.vf.show10Fixed = value;
            }
        }
        get show30Fixed(): boolean {
            return this.vf.show30Fixed;
        }
        set show30Fixed(value: boolean) {
            this.vf.show30Fixed = value;
        }
        get show25Fixed(): boolean {
            return this.vf.show25Fixed;
        }
        set show25Fixed(value: boolean) {
            this.vf.show25Fixed = value;
        }
        get show20Fixed(): boolean {
            return this.vf.show20Fixed;
        }
        set show20Fixed(value: boolean) {
            this.vf.show20Fixed = value;
        }
        get show15Fixed(): boolean {
            return this.vf.show15Fixed;
        }
        set show15Fixed(value: boolean) {
            this.vf.show15Fixed = value;
        }
        get show10Fixed(): boolean {
            return this.vf.show10Fixed;
        }
        set show10Fixed(value: boolean) {
            this.vf.show10Fixed = value;
        }
        //
        get showAllARM(): boolean {
            return (this.vf.show10ARM && this.vf.show7ARM && this.vf.show5ARM && this.vf.show3ARM);
        }
        set showAllARM(value: boolean) {
            if (this.showAllARM != value) {
                this.vf.show10ARM = value;
                this.vf.show7ARM = value;
                this.vf.show5ARM = value;
                this.vf.show3ARM = value;
            }
        }
        get show10ARM(): boolean {
            return this.vf.show10ARM;
        }
        set show10ARM(value: boolean) {
            this.vf.show10ARM = value;
        }

        get show7ARM(): boolean {
            return this.vf.show7ARM;
        }
        set show7ARM(value: boolean) {
            this.vf.show7ARM = value;
        }
        get show5ARM(): boolean {
            return this.vf.show5ARM;
        }
        set show5ARM(value: boolean) {
            this.vf.show5ARM = value;
        }

        get show3ARM(): boolean {
            return this.vf.show3ARM;
        }
        set show3ARM(value: boolean) {
            this.vf.show3ARM = value;
        }
        
        //
        get sortField(): string {
            return this.vf.sortField;
        }
        set sortField(value: string) {
            this.vf.sortField = value;
        }

        get sortDirection(): string {
            return this.vf.sortDirection;
        }
        set sortDirection(value: string) {
            this.vf.sortDirection = value;
        }
        //
        _isVAEligible: boolean;
        get isVAEligible(): boolean {
            return this._isVAEligible;
        }
        set isVAEligible(value: boolean) {
            this._isVAEligible = value;
        }

        _wasVAUsedBefore: boolean;
        get wasVAUsedBefore(): boolean {
            return this._wasVAUsedBefore
        }

        _onVADisablity: boolean;
        get onVADisability(): boolean {
            return this._onVADisablity;
        }
        set onVADisablity(value: boolean) {
            this._onVADisablity = value;
        }
        
        //Not happy about this.  Quick fix for release 01/06/16 
        private static lookup_impounds = [
            { text: 'Include in Payment', value: (<number>srv.impoundType.taxesAndInsurance).toString() },
            { text: 'Don\'t Include in Payment.', value: (<number>srv.impoundType.noImpound).toString() },
        ];
        get typeImpounds(): any {
            return PricingController.lookup_impounds;
        }
        set typeImpounds(typeImpounds: any) {
            /*Read Only*/
        }

        get NumberOfUnits(): number {
            return this.loan.getLoan().getSubjectProperty().numberOfUnits;
        }
        set NumberOfUnits(value: number) {
            this.loan.getLoan().getSubjectProperty().numberOfUnits = value;
        }

        NumberOfUnitTypes(): any {
            return this.applicationData.lookup.numberOfUnits;
        }
        //
        _activeFilterButton: string;
        get activeFilterButton(): string {
            return this._activeFilterButton;
        }
        set activeFilterButton(value: string) {
            this._activeFilterButton = value;
        }

        isActiveFilter = (title: any): string => {
            if (this._activeFilterButton == title.toString()) {
                return "pricing-filter-box active";
            }
            else {
                return "pricing-filter-box";
            }
        }

        showAdvancedSearchModal = () => {
            this.showSearchModal();
        }


    }
    moduleRegistration.registerController(consumersite.moduleName, PricingController);//.filter("productFilter", productFilterFunction);   
    
    // View model classes used by pricing controller
    export interface OptionViewModel {
        val: number;
        text: string;
    }

    export interface PriceSearchViewModel {
        downpayment: number;
        loanPurpose: OptionViewModel[];
        loanPurposeSelected: number;
        zipCode: string;
        existingFirstMortgage: number;
        cashOut: number;
        estimatedPropValue: number;
        creditScores: OptionViewModel[];
        creditScoreSelected: number;
    }

    export interface IRangedSelection {
        Min: number;
        Max: number;
        Selected: number;
    }

    export class RangedSelection implements IRangedSelection {
        _max: number;
        get Max(): number {
            return this._max;
        }
        set Max(value: number) {
            this._max = value;
        }
        //
        _min: number;
        get Min(): number {
            return this._min;
        }
        set Min(value: number) {
            this._min = value;
        }
        //
        _selected: number;
        get Selected(): number {
            return this._selected;
        }
        set Selected(value: number) {
            this._selected = value;
        }
    }
}

