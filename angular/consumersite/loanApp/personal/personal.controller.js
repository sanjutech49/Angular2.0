/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var PersonalController = (function () {
        function PersonalController(loan, loanAppPageContext, applicationData) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.populateAllData = function (val) {
                _this.firstName = val;
                if (val == "Simon_" && _this.isBorrower) {
                    _this.populatePersonalData();
                    _this.populateCoBorrowerData();
                    _this.populateEmployment();
                    _this.populatePropertyInfo();
                    _this.populateAddress();
                    _this.populateAssets();
                    _this.populateGovtMonitoring();
                    _this.populateOtherIncome();
                }
            };
            this.populateHowDidYouHearAboutUs = function () {
                _this.howDidYouHearAboutUs = [
                    { text: 'Akasha Center', value: '0384' },
                    { text: 'Anaheim Fire Department', value: '0549' },
                    { text: 'BankRate', value: '0001' },
                    { text: 'CraigEvans', value: '9020' },
                    { text: 'Family', value: '0008' },
                    { text: 'Friend', value: '0003' },
                    { text: 'Internet', value: '0007' },
                    { text: 'GRM', value: '0159' },
                    { text: 'Mailer', value: '0005' },
                    { text: 'Radio (KTTH)', value: '0052' },
                    { text: 'SFC Financial Network', value: '0004' },
                    { text: 'Social Media', value: '0006' },
                ];
            };
            this.addOtherIncome = function () {
                _this.otherIncomeActive = _this.loan.loanApp.addOtherIncome();
            };
            this.addcoOtherIncome = function () {
                _this.cootherIncomeActive = _this.loan.loanApp.addOtherIncome();
            };
            this.addcoEmployment = function () {
                _this.coemploymentActive = _this.loan.loanApp.coBorrower.employments[_this.loan.loanApp.coBorrower.addEmployment(false, false) - 2];
            };
            this.addEmployment = function () {
                _this.addEmploymentImpl(false, false);
            };
            this.addEmploymentImpl = function (isPrevious, isAdditional) {
                var edx = _this.borrower.addEmployment(isPrevious, isAdditional);
                _this.employmentActive = _this.borrower.employments[edx - 2];
            };
            this.addAsset = function () {
                _this.assetActive = _this.loan.loanApp.assets[_this.loan.loanApp.addAsset() - 1];
            };
            this.populateOtherIncome = function () {
                // this.loan.loanApp.otherIncomes.
                //Other Income array is empty, add one for the user to begin the page.
                if (_this.loan.loanApp.otherIncomes.length == 0) {
                    _this.addOtherIncome();
                }
                else {
                    _this.otherIncomeActive = _this.loan.loanApp.otherIncomes[_this.loan.loanApp.otherIncomes.length - 1];
                }
                _this.addcoOtherIncome();
                // this.cootherIncomeActive = this.loan.loanApp.otherIncomes[this.loan.loanApp.otherIncomes.length - 1];
                _this.otherIncomeActive.incomeType = 10;
                _this.otherIncomeActive.incomeValue = 57000;
                _this.cootherIncomeActive.incomeType = 16;
                _this.cootherIncomeActive.incomeValue = 25000;
                // this.populateOwnerTypeLookup();
            };
            this.populateGovtMonitoring = function () {
                _this.loan.loanApp.borrower.declarations.ethnicityId = 1;
                _this.loan.loanApp.borrower.declarations.race = 2;
                _this.loan.loanApp.borrower.declarations.sexId = 1;
                _this.loan.loanApp.coBorrower.declarations.ethnicityId = 0;
                _this.loan.loanApp.coBorrower.declarations.race = 3;
                _this.loan.loanApp.coBorrower.declarations.sexId = 1;
            };
            this.populateCoBorrowerData = function () {
                _this.loan.loanApp.coBorrower.firstName = "Glenn";
                _this.loan.loanApp.coBorrower.lastName = "Smith";
                _this.loan.loanApp.coBorrower.middleName = "T";
                _this.loan.loanApp.coBorrower.maritalStatus = 2;
                _this.loan.loanApp.coBorrower.email = "joseph@hotmail.com";
                _this.loan.loanApp.coBorrower.preferredPhone = "818-443-2156";
                _this.loan.loanApp.coBorrower.preferredPhoneType = "2";
                _this.loan.loanApp.coBorrower.suffix = "Jr.";
                _this.loan.loanApp.coBorrower.numberOfDependents = 1;
                _this.loan.loanApp.coBorrower.agesOfDependents = "5";
            };
            this.populatePropertyInfo = function () {
                _this.loan.property.streetName = "1313 Mockingbird Lane";
                _this.loan.property.cityName = "Redmond";
                _this.loan.property.stateName = "NY";
                _this.loan.property.zipCode = "11745";
                _this.loan.property.propertyType = 1;
                _this.loan.property.occupancyType = 2;
                _this.loan.property.currentEstimatedValue = 500000;
                _this.loan.property.purchasePrice = 500000;
                _this.loan.loanPurposeType = 2;
                var pDate = new Date("2009-12-15");
                _this.loan.property.purchaseDate = pDate;
                _this.loan.property.isCurrentAddressSame = false;
                _this.loan.property.numberOfUnits = 1;
                _this.loan.property.monthlyHOADues = 24;
            };
            this.populateEmployment = function () {
                //if (!this.isBorrower)
                //    this.employmentActive = this.loan.loanApp.coBorrower.employments[this.loan.loanApp.coBorrower.employments.length - 1];
                //else
                //    this.employmentActive = this.loan.loanApp.borrower.employments[this.loan.loanApp.borrower.employments.length - 1];
                //if (this.loan.loanApp.borrower.employments.length == 0 ) {
                //    this.addEmployment();
                //}
                //else { // select the last one
                //  }
                _this.addEmployment();
                // this.employmentActive = new vm.Employment(new cls.EmploymentInfoViewModel()) ;
                var startingDate = new Date("2011-12-10");
                var endingDate = new Date("2015-12-10");
                _this.employmentActive.startingDate = startingDate;
                _this.employmentActive.endingDate = endingDate;
                _this.employmentActive.yearsInTheSameField = endingDate.getFullYear() - startingDate.getFullYear();
                _this.employmentActive.companyName = "Sears";
                _this.employmentActive.businessPhone = "455-643-8765";
                _this.employmentActive.companyStreet = "101 Empire Avenue";
                _this.employmentActive.companyCity = "Redmond";
                _this.employmentActive.companyState = "WA";
                _this.employmentActive.companyZip = "94521";
                _this.employmentActive.baseSalary = 12000;
                _this.employmentActive.positionDescription = "President";
                _this.employmentActive.typeOfBusiness = "Software";
                //this.coemploymentType = srv.EmploymentTypeEnum.SalariedEmployee;
                //if (this.loan.loanApp.coBorrower.employments.length == 0) {
                //    this.addcoEmployment();
                //}
                //else { // select the last one
                //    this.coemploymentActive = this.loan.loanApp.coBorrower.employments[this.loan.loanApp.coBorrower.employments.length - 1];
                //}
                _this.addcoEmployment();
                _this.coemploymentActive.positionDescription = "Jr Artist";
                _this.coemploymentActive.typeOfBusiness = "Artist";
                _this.coemploymentActive.startingDate = new Date("2008-09-13");
                _this.coemploymentActive.endingDate = new Date("2015-11-05");
                _this.coemploymentActive.companyName = "Grumman Data Systems";
                _this.coemploymentActive.baseSalary = 11000;
            };
            this.populateAssets = function () {
                //Assets array is empty, add one for the user to begin the page.
                if (_this.loan.loanApp.assets.length == 0) {
                    _this.addAsset();
                }
                else {
                    _this.assetActive = _this.loan.loanApp.assets[_this.loan.loanApp.assets.length - 1];
                }
                _this.assetActive.ownerType = 1;
                _this.assetActive.accountNumber = "123456789";
                _this.assetActive.assetValue = 34542;
                _this.assetActive.borrowerFullName = "";
                _this.assetActive.financialInstitutionName = "abc financial institure";
            };
            this.populateAddress = function () {
                _this.loan.loanApp.borrower.currentAddress.streetName = "1515 Main Street";
                _this.loan.loanApp.borrower.currentAddress.stateName = "WA";
                _this.loan.loanApp.borrower.currentAddress.cityName = "Commack";
                _this.loan.loanApp.borrower.currentAddress.zipCode = "11231";
                _this.loan.loanApp.borrower.currentAddress.ownOrRent = 2;
                _this.loan.loanApp.borrower.currentAddress.timeAtAddressYears = 3;
                _this.loan.loanApp.borrower.currentAddress.timeAtAddressMonths = 5;
                _this.loan.loanApp.borrower.currentAddress.isMailingAddressDifferent = true;
                _this.loan.loanApp.borrower.mailingAddress.streetName = "139 Park Drive";
                _this.loan.loanApp.borrower.mailingAddress.stateName = "WA";
                _this.loan.loanApp.borrower.mailingAddress.cityName = "Redmond";
                _this.loan.loanApp.borrower.mailingAddress.zipCode = "77152";
                _this.loan.loanApp.coBorrower.currentAddress.streetName = "1717 Forest Lane";
                _this.loan.loanApp.coBorrower.currentAddress.stateName = "CA";
                _this.loan.loanApp.coBorrower.currentAddress.cityName = "Irvine";
                _this.loan.loanApp.coBorrower.currentAddress.zipCode = "98052";
                _this.loan.loanApp.coBorrower.currentAddress.ownOrRent = 0;
                _this.loan.loanApp.coBorrower.currentAddress.timeAtAddressYears = 5;
                _this.loan.loanApp.coBorrower.currentAddress.timeAtAddressMonths = 2;
                _this.loan.loanApp.coBorrower.currentAddress.isMailingAddressDifferent = false;
            };
            this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this.borrower = !this.isBorrower ? this.loan.loanApp.coBorrower : this.loan.loanApp.borrower;
            // set the intial
            loan.loanApp.initialHasCoBorrowerState = !!this.loan.loanApp.hasCoBorrower;
            this.populateHowDidYouHearAboutUs();
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        PersonalController.prototype.populatePersonalData = function () {
            this.borrower.firstName = this.firstName;
            this.borrower.lastName = "Brogans";
            this.borrower.middleName = "T";
            this.borrower.maritalStatus = 1;
            this.borrower.email = "brogan@hotmail.com";
            this.borrower.preferredPhone = "865-443-2156";
            this.borrower.preferredPhoneType = "2";
            this.borrower.suffix = "Sr.";
            this.borrower.numberOfDependents = 1;
            this.borrower.agesOfDependents = "3";
        };
        PersonalController.className = "personalController";
        PersonalController.$inject = ['loan', 'loanAppPageContext', 'applicationData'];
        return PersonalController;
    })();
    consumersite.PersonalController = PersonalController;
    moduleRegistration.registerController(consumersite.moduleName, PersonalController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=personal.controller.js.map