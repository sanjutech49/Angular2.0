/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class PersonalController {

        static className = "personalController";

        static $inject = ['loan', 'loanAppPageContext', 'applicationData'];

        borrower: vm.Borrower;
        isBorrower: boolean;

        employmentActive: vm.Employment;
        coemploymentActive: vm.Employment;

        private assetActive: vm.Asset;

        private otherIncomeActive: vm.OtherIncome;
        private cootherIncomeActive: vm.OtherIncome;

        firstName: string;

        //@TODO import service from LC 3.0 
        //angular\loanapplication\personal\personal.service.js
        howDidYouHearAboutUs: any[];
        
        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any) {
            this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this.borrower = !this.isBorrower ? this.loan.loanApp.coBorrower : this.loan.loanApp.borrower;

            // set the intial
            loan.loanApp.initialHasCoBorrowerState = !!this.loan.loanApp.hasCoBorrower;

            this.populateHowDidYouHearAboutUs();

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }


        populateAllData = (val) => {
            this.firstName = val;
            if (val == "Simon_" && this.isBorrower)
            {
                this.populatePersonalData();
                this.populateCoBorrowerData();
                this.populateEmployment();
                this.populatePropertyInfo();
                this.populateAddress();
                this.populateAssets();
                this.populateGovtMonitoring();
                this.populateOtherIncome();
            }
        }

        populateHowDidYouHearAboutUs = (): void => {
            this.howDidYouHearAboutUs = [
                { text: 'Akasha Center', value: '0384'},
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
                ]
        }


        addOtherIncome = (): void => {
            this.otherIncomeActive = this.loan.loanApp.addOtherIncome();
        }

        addcoOtherIncome = (): void => {
            this.cootherIncomeActive = this.loan.loanApp.addOtherIncome();
        }

        addcoEmployment = () => {
            this.coemploymentActive = this.loan.loanApp.coBorrower.employments[this.loan.loanApp.coBorrower.addEmployment(false,false) - 2];
        }

        addEmployment = () => {
            this.addEmploymentImpl(false, false);
        }

        private addEmploymentImpl = (isPrevious: boolean, isAdditional: boolean): void => {
            var edx = this.borrower.addEmployment(isPrevious, isAdditional);
            this.employmentActive = this.borrower.employments[edx - 2];
        }

        addAsset = (): void => {
            this.assetActive = this.loan.loanApp.assets[this.loan.loanApp.addAsset() - 1];
        }

        populateOtherIncome = () => {
            // this.loan.loanApp.otherIncomes.

            //Other Income array is empty, add one for the user to begin the page.
            if (this.loan.loanApp.otherIncomes.length == 0) {
                this.addOtherIncome();
            }
            else { // select the last one
                this.otherIncomeActive = this.loan.loanApp.otherIncomes[this.loan.loanApp.otherIncomes.length - 1];
            }

            this.addcoOtherIncome();
         
            // this.cootherIncomeActive = this.loan.loanApp.otherIncomes[this.loan.loanApp.otherIncomes.length - 1];
         
            this.otherIncomeActive.incomeType = 10;

            this.otherIncomeActive.incomeValue = 57000;

            this.cootherIncomeActive.incomeType = 16;

            this.cootherIncomeActive.incomeValue = 25000;

            // this.populateOwnerTypeLookup();
        }

        populateGovtMonitoring = () => {

            this.loan.loanApp.borrower.declarations.ethnicityId = 1;
            this.loan.loanApp.borrower.declarations.race = 2;
            this.loan.loanApp.borrower.declarations.sexId = 1;


            this.loan.loanApp.coBorrower.declarations.ethnicityId = 0;
            this.loan.loanApp.coBorrower.declarations.race = 3;
            this.loan.loanApp.coBorrower.declarations.sexId = 1;
        }

        populatePersonalData() {
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

        }

        populateCoBorrowerData = () => {
            this.loan.loanApp.coBorrower.firstName = "Glenn";
            this.loan.loanApp.coBorrower.lastName = "Smith";
            this.loan.loanApp.coBorrower.middleName = "T";
            this.loan.loanApp.coBorrower.maritalStatus = 2;
            this.loan.loanApp.coBorrower.email = "joseph@hotmail.com";
            this.loan.loanApp.coBorrower.preferredPhone = "818-443-2156";
            this.loan.loanApp.coBorrower.preferredPhoneType = "2";
            this.loan.loanApp.coBorrower.suffix = "Jr.";
            this.loan.loanApp.coBorrower.numberOfDependents = 1;
            this.loan.loanApp.coBorrower.agesOfDependents = "5";
        }

        populatePropertyInfo = () => {
            this.loan.property.streetName = "1313 Mockingbird Lane";
            this.loan.property.cityName = "Redmond";
            this.loan.property.stateName = "NY";
            this.loan.property.zipCode = "11745";
            this.loan.property.propertyType = 1;
            this.loan.property.occupancyType = 2;

            this.loan.property.currentEstimatedValue = 500000;

            this.loan.property.purchasePrice = 500000;

            this.loan.loanPurposeType = 2;
            var pDate = new Date("2009-12-15");

            this.loan.property.purchaseDate = pDate;

            this.loan.property.isCurrentAddressSame = false;

            this.loan.property.numberOfUnits = 1;

            this.loan.property.monthlyHOADues = 24;

        }

        populateEmployment = () => {
            //if (!this.isBorrower)
            //    this.employmentActive = this.loan.loanApp.coBorrower.employments[this.loan.loanApp.coBorrower.employments.length - 1];
            //else
            //    this.employmentActive = this.loan.loanApp.borrower.employments[this.loan.loanApp.borrower.employments.length - 1];
            //if (this.loan.loanApp.borrower.employments.length == 0 ) {
            //    this.addEmployment();
            //}
            //else { // select the last one
                
            //  }

            this.addEmployment();

            // this.employmentActive = new vm.Employment(new cls.EmploymentInfoViewModel()) ;

            var startingDate = new Date("2011-12-10");

            var endingDate = new Date("2015-12-10");

            this.employmentActive.startingDate = startingDate;

            this.employmentActive.endingDate = endingDate;

            this.employmentActive.yearsInTheSameField = endingDate.getFullYear() - startingDate.getFullYear();

            this.employmentActive.companyName = "Sears";

            this.employmentActive.businessPhone = "455-643-8765";

            this.employmentActive.companyStreet = "101 Empire Avenue";

            this.employmentActive.companyCity = "Redmond";

            this.employmentActive.companyState = "WA";
            this.employmentActive.companyZip = "94521";

            this.employmentActive.baseSalary = 12000;

            this.employmentActive.positionDescription = "President";

            this.employmentActive.typeOfBusiness = "Software";


            //this.coemploymentType = srv.EmploymentTypeEnum.SalariedEmployee;

            //if (this.loan.loanApp.coBorrower.employments.length == 0) {
            //    this.addcoEmployment();
            //}
            //else { // select the last one
            //    this.coemploymentActive = this.loan.loanApp.coBorrower.employments[this.loan.loanApp.coBorrower.employments.length - 1];
            //}

            this.addcoEmployment();

            this.coemploymentActive.positionDescription = "Jr Artist";
            this.coemploymentActive.typeOfBusiness = "Artist";

            this.coemploymentActive.startingDate = new Date("2008-09-13");

            this.coemploymentActive.endingDate = new Date("2015-11-05");

            this.coemploymentActive.companyName = "Grumman Data Systems";

            this.coemploymentActive.baseSalary = 11000;
        }

        populateAssets = () => {
            //Assets array is empty, add one for the user to begin the page.
            if (this.loan.loanApp.assets.length == 0) {
                this.addAsset();
            }
            else { // select the last one
                this.assetActive = this.loan.loanApp.assets[this.loan.loanApp.assets.length - 1];
            }

            this.assetActive.ownerType = 1;
            this.assetActive.accountNumber = "123456789";
            this.assetActive.assetValue = 34542;
            this.assetActive.borrowerFullName = "";

            this.assetActive.financialInstitutionName = "abc financial institure";
        }

        populateAddress = () => {
            this.loan.loanApp.borrower.currentAddress.streetName = "1515 Main Street";
            this.loan.loanApp.borrower.currentAddress.stateName = "WA";
            this.loan.loanApp.borrower.currentAddress.cityName = "Commack";
            this.loan.loanApp.borrower.currentAddress.zipCode = "11231";

            this.loan.loanApp.borrower.currentAddress.ownOrRent = 2;

            this.loan.loanApp.borrower.currentAddress.timeAtAddressYears = 3;
            this.loan.loanApp.borrower.currentAddress.timeAtAddressMonths = 5;

            this.loan.loanApp.borrower.currentAddress.isMailingAddressDifferent = true;

            this.loan.loanApp.borrower.mailingAddress.streetName = "139 Park Drive";
            this.loan.loanApp.borrower.mailingAddress.stateName = "WA";
            this.loan.loanApp.borrower.mailingAddress.cityName = "Redmond";
            this.loan.loanApp.borrower.mailingAddress.zipCode = "77152";


            this.loan.loanApp.coBorrower.currentAddress.streetName = "1717 Forest Lane";
            this.loan.loanApp.coBorrower.currentAddress.stateName = "CA";
            this.loan.loanApp.coBorrower.currentAddress.cityName = "Irvine";
            this.loan.loanApp.coBorrower.currentAddress.zipCode = "98052";

            this.loan.loanApp.coBorrower.currentAddress.ownOrRent = 0;

            this.loan.loanApp.coBorrower.currentAddress.timeAtAddressYears = 5;
            this.loan.loanApp.coBorrower.currentAddress.timeAtAddressMonths = 2;

            this.loan.loanApp.coBorrower.currentAddress.isMailingAddressDifferent = false;
        }


    }
    moduleRegistration.registerController(consumersite.moduleName, PersonalController);
} 