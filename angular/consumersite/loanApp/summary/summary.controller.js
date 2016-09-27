var consumersite;
(function (consumersite) {
    var SummaryController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function SummaryController(loan, loanAppPageContext, applicationData, navigationService, $location1) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.navigationService = navigationService;
            this.$location1 = $location1;
            /*     public  item = {
                     name: 'Interest',
                     cost: 4.875,
                     minAge: 1.0,
                     maxAge: 10
                 };  */
            this.currencyFormatting = function (value) {
                return value.toString() + " $";
            };
            this.getBorrowerLink = function () {
                return _this.navigationService.getBorrowerLink(15 /* summary */);
            };
            this.getCoBorrowerLink = function () {
                return _this.navigationService.getCoBorrowerLink(15 /* summary */);
            };
            this.getBorrowerAddressLink = function () {
                return _this.navigationService.getBorrowerAddressLink(15 /* summary */);
            };
            this.getCoBorrowerAddressLink = function () {
                return _this.navigationService.getCoBorrowerAddressLink(15 /* summary */);
            };
            this.getPropertyLink = function () {
                return _this.navigationService.getPropertyLink(15 /* summary */);
            };
            this.getBorrowerEmploymentLink = function () {
                return _this.navigationService.getBorrowerEmploymentLink(15 /* summary */);
            };
            this.getCoBorrowerEmploymentLink = function () {
                return _this.navigationService.getCoBorrowerEmploymentLink(15 /* summary */);
            };
            this.getBorrowerGovermentMonitoringLink = function () {
                return _this.navigationService.getBorrowerGovermentMonitoringLink(15 /* summary */);
            };
            this.getCoBorrowerGovermentMonitoringLink = function () {
                return _this.navigationService.getCoBorrowerGovermentMonitoringLink(15 /* summary */);
            };
            this.getOtherIncomeLink = function () {
                return _this.navigationService.getOtherIncomeLink(15 /* summary */);
            };
            this.getAssetsLink = function () {
                return _this.navigationService.getAssetsLink(15 /* summary */);
            };
            this.getDeclarationsLink = function () {
                return _this.navigationService.getDeclarationsLink(15 /* summary */);
            };
            this.addAsset = function () {
                _this.assetActive = _this.loan.loanApp.assets[_this.loan.loanApp.addAsset() - 1];
            };
            this.populateAssets = function () {
                //Assets array is empty, add one for the user to begin the page.
                if (_this.loan.loanApp.assets.length == 0) {
                    _this.addAsset();
                }
                else {
                    _this.assetActive = _this.loan.loanApp.assets[_this.loan.loanApp.assets.length - 1];
                }
            };
            this.populateDeclarations = function () {
                _this.declarations.outstandingJudgmentsIndicator = 1;
                _this.codeclarations.outstandingJudgmentsIndicator = 0;
                _this.declarations.bankrupcyIndicator = 1;
                _this.codeclarations.bankrupcyIndicator = 0;
                _this.declarations.propertyForeclosedIndicator = 1;
                _this.codeclarations.propertyForeclosedIndicator = 0;
                _this.declarations.partyToLawsuitIndicator = 1;
                _this.codeclarations.partyToLawsuitIndicator = 0;
                _this.declarations.obligatedLoanIndicator = 1;
                _this.codeclarations.obligatedLoanIndicator = 0;
                _this.declarations.presentlyDelinquentIndicator = 1;
                _this.codeclarations.presentlyDelinquentIndicator = 0;
                _this.declarations.obligatedLoanIndicator = 1;
                _this.codeclarations.obligatedLoanIndicator = 0;
                _this.declarations.alimonyChildSupportObligation = 1;
                _this.codeclarations.alimonyChildSupportObligation = 0;
                _this.declarations.downPaymentIndicator = 1;
                _this.codeclarations.downPaymentIndicator = 0;
                _this.declarations.noteEndorserIndicator = 1;
                _this.codeclarations.noteEndorserIndicator = 0;
                _this.declarations.propertyAsPrimaryResidence = 0;
                _this.codeclarations.propertyAsPrimaryResidence = 0;
                _this.declarations.ownershipInterestLastThreeYears = 0;
                _this.codeclarations.ownershipInterestLastThreeYears = 0;
                _this.declarations.priorPropertyTitleType = 1;
                _this.codeclarations.priorPropertyTitleType = 2;
                _this.declarations.typeOfProperty = 0;
                _this.codeclarations.typeOfProperty = 1;
            };
            this.populateGovtMonitoring = function () {
                _this.declarations = _this.loan.loanApp.borrower.declarations;
                _this.declarations.ethnicityId = 1;
                _this.declarations.race = 2;
                _this.declarations.sexId = 1;
                _this.codeclarations = _this.loan.loanApp.coBorrower.declarations;
                _this.codeclarations.ethnicityId = 0;
                _this.codeclarations.race = 3;
                _this.codeclarations.sexId = 1;
            };
            this.getOwnerTypeLookups = function () {
                return _this.ownerTypeLookup;
            };
            this.populateOwnerTypeLookup = function () {
                _this.ownerTypeLookup = [];
                _this.ownerTypeLookup.push({ value: 1 /* Borrower */, text: _this.loan.loanApp.borrower.fullName });
                if (_this.loan.loanApp.hasCoBorrower) {
                    _this.ownerTypeLookup.push({ value: 2 /* CoBorrower */, text: _this.loan.loanApp.coBorrower.fullName });
                }
                _this.ownerTypeLookup.push({ value: 3 /* Joint */, text: "Joint" });
            };
            //this code is only for testing and must be removed before going into production
            this.populatePersonalInfo = function () {
                _this.loan.loanApp.borrower.firstName = "Tom";
                _this.loan.loanApp.borrower.lastName = "Brogans";
                _this.loan.loanApp.borrower.middleName = "T";
                _this.loan.loanApp.borrower.maritalStatus = 1;
                _this.loan.loanApp.borrower.email = "tom@hotmail.com";
                _this.loan.loanApp.borrower.preferredPhone = "865-443-2156";
                _this.loan.loanApp.borrower.preferredPhoneType = "1";
                _this.loan.loanApp.coBorrower.firstName = "Roberto";
                _this.loan.loanApp.coBorrower.lastName = "Clemente";
                _this.loan.loanApp.coBorrower.middleName = "S";
                _this.loan.loanApp.coBorrower.maritalStatus = 2;
            };
            this.populatePropertyInfo = function () {
                _this.loan.property.streetName = "1313 Mockingbird Lane";
                _this.loan.property.cityName = "Redmond";
                _this.loan.property.stateName = "NY";
                _this.loan.property.zipCode = "11745";
                _this.loan.property.propertyType = 1;
                _this.loan.property.occupancyType = 2;
                _this.loan.property.currentEstimatedValue = 510000;
                _this.loan.property.purchasePrice = 300000;
                _this.loan.loanPurposeType = 2;
                var pDate = new Date("2009-12-15");
                _this.loan.property.purchaseDate = pDate;
                _this.loan.property.isCurrentAddressSame = false;
            };
            this.populateAddress = function () {
                _this.loan.loanApp.borrower.currentAddress.streetName = "1515 Main Street";
                _this.loan.loanApp.borrower.currentAddress.stateName = "WA";
                _this.loan.loanApp.borrower.currentAddress.cityName = "Commack";
                _this.loan.loanApp.borrower.currentAddress.zipCode = "98052";
                _this.loan.loanApp.borrower.currentAddress.ownOrRent = 2;
                _this.loan.loanApp.borrower.currentAddress.timeAtAddressYears = 3;
                _this.loan.loanApp.borrower.currentAddress.timeAtAddressMonths = 5;
                _this.loan.loanApp.borrower.currentAddress.isMailingAddressDifferent = true;
                _this.loan.loanApp.borrower.mailingAddress.streetName = "139 Force Way";
                _this.loan.loanApp.borrower.mailingAddress.stateName = "WA";
                _this.loan.loanApp.borrower.mailingAddress.cityName = "Redmond";
                _this.loan.loanApp.borrower.mailingAddress.zipCode = "98052";
                _this.loan.loanApp.coBorrower.currentAddress.streetName = "198 Force Way";
                _this.loan.loanApp.coBorrower.currentAddress.stateName = "WA";
                _this.loan.loanApp.coBorrower.currentAddress.cityName = "Redmond";
                _this.loan.loanApp.coBorrower.currentAddress.zipCode = "98052";
                _this.loan.loanApp.coBorrower.currentAddress.ownOrRent = 1;
                _this.loan.loanApp.coBorrower.currentAddress.timeAtAddressYears = 5;
                _this.loan.loanApp.coBorrower.currentAddress.timeAtAddressMonths = 2;
                _this.loan.loanApp.coBorrower.currentAddress.isMailingAddressDifferent = false;
            };
            this.populateEmployment = function () {
                _this.employmentType = 1 /* SalariedEmployee */;
                if (_this.loan.loanApp.coBorrower.employments.length > 0)
                    _this.employmentActive = _this.loan.loanApp.coBorrower.employments[0];
            };
            this.hasCoBorrower = function () {
                return _this.loan.loanApp.hasCoBorrower;
            };
            this.SaveContinuePoperty = function () {
                _this.$location1.url('/credit');
                //  this.navigationService.goToAddress();
            };
            this.showYesNo = function (val) {
                if (val) {
                    return "Yes";
                }
                else {
                    return "No";
                }
            };
            // this.$location1 = $location;
            this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this.employmentType = 1 /* SalariedEmployee */;
            this.employmentActive = this.loan.loanApp.borrower.employments[0];
            this.coemploymentType = 1 /* SalariedEmployee */;
            this.coemploymentActive = this.loan.loanApp.coBorrower.employments[0];
            if (this.loan.loanApp.otherIncomes.length > 0)
                this.otherIncomeActive = this.loan.loanApp.otherIncomes[0];
            if (this.loan.loanApp.otherIncomes.length > 1)
                this.cootherIncomeActive = this.loan.loanApp.otherIncomes[1];
            this.populateOwnerTypeLookup();
            this.assetActives = [];
            for (var i = 0; i < this.loan.loanApp.assets.length; i++) {
                this.assetActives.push(this.loan.loanApp.assets[i]);
            }
            this.declarations = this.loan.loanApp.borrower.declarations;
            this.codeclarations = this.loan.loanApp.coBorrower.declarations;
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        SummaryController.className = "summaryController";
        SummaryController.$inject = ['loan', 'loanAppPageContext', 'applicationData', 'navigationService', '$location'];
        return SummaryController;
    })();
    consumersite.SummaryController = SummaryController;
    moduleRegistration.registerController(consumersite.moduleName, SummaryController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=summary.controller.js.map