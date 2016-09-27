module consumersite {

    export class SummaryController {

        static className = "summaryController";

        public static $inject = ['loan', 'loanAppPageContext', 'applicationData', 'navigationService', '$location'];

        private assetActive: vm.Asset;

        private assetActives: vm.Asset[];

        isBorrower: boolean;
        declarations: vm.Declarations; 
        codeclarations: vm.Declarations;
        raceType: srv.cls.DeclarationInfoViewModel;
        genderType: srv.cls.DeclarationInfoViewModel;
        employmentType: srv.EmploymentTypeEnum;
        employmentActive: vm.Employment;
        coemploymentType: srv.EmploymentTypeEnum;
        coemploymentActive: vm.Employment;

        private otherIncomeActive: vm.OtherIncome;
        private cootherIncomeActive: vm.OtherIncome;

        ownerTypeLookup: vm.ILookupEntry<srv.OwnerTypeEnum>[];

   /*     public  item = {
            name: 'Interest',
            cost: 4.875,
            minAge: 1.0,
            maxAge: 10
        };  */

     public  currencyFormatting = function (value) { return value.toString() + " $"; };


        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, public applicationData: any, private navigationService: consumersite.UINavigationService,private $location1) {
           // this.$location1 = $location;
            this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this.employmentType = srv.EmploymentTypeEnum.SalariedEmployee;
            this.employmentActive = this.loan.loanApp.borrower.employments[0];
            this.coemploymentType = srv.EmploymentTypeEnum.SalariedEmployee;
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

        getBorrowerLink = (): string => {
            return this.navigationService.getBorrowerLink(navigation.loanAppNavigationState.summary);
        }

        getCoBorrowerLink = (): string => {
            return this.navigationService.getCoBorrowerLink(navigation.loanAppNavigationState.summary);
        }

        getBorrowerAddressLink = (): string => {
            return this.navigationService.getBorrowerAddressLink(navigation.loanAppNavigationState.summary);
        }

        getCoBorrowerAddressLink = (): string => {
            return this.navigationService.getCoBorrowerAddressLink(navigation.loanAppNavigationState.summary);
        }

        getPropertyLink = (): string => {
            return this.navigationService.getPropertyLink(navigation.loanAppNavigationState.summary);
        }

        getBorrowerEmploymentLink = (): string => {
            return this.navigationService.getBorrowerEmploymentLink(navigation.loanAppNavigationState.summary);
        }

        getCoBorrowerEmploymentLink = (): string => {
            return this.navigationService.getCoBorrowerEmploymentLink(navigation.loanAppNavigationState.summary);
        }

        getBorrowerGovermentMonitoringLink = (): string => {
            return this.navigationService.getBorrowerGovermentMonitoringLink(navigation.loanAppNavigationState.summary);
        }
        getCoBorrowerGovermentMonitoringLink = (): string => {
            return this.navigationService.getCoBorrowerGovermentMonitoringLink(navigation.loanAppNavigationState.summary);
        }

        getOtherIncomeLink = (): string => {
            return this.navigationService.getOtherIncomeLink(navigation.loanAppNavigationState.summary);
        }

        getAssetsLink = (): string => {
            return this.navigationService.getAssetsLink(navigation.loanAppNavigationState.summary);
        }

        getDeclarationsLink = (): string => {
            return this.navigationService.getDeclarationsLink(navigation.loanAppNavigationState.summary);
        }


        addAsset = (): void => {
            this.assetActive = this.loan.loanApp.assets[this.loan.loanApp.addAsset() - 1];
        }

        populateAssets = () => {
            //Assets array is empty, add one for the user to begin the page.
            if (this.loan.loanApp.assets.length == 0) {
                this.addAsset();
            }
            else { // select the last one
                this.assetActive = this.loan.loanApp.assets[this.loan.loanApp.assets.length - 1];
            }
        }



        populateDeclarations = () => {
            this.declarations.outstandingJudgmentsIndicator = 1;
            this.codeclarations.outstandingJudgmentsIndicator = 0;

            this.declarations.bankrupcyIndicator = 1;
            this.codeclarations.bankrupcyIndicator = 0;

            this.declarations.propertyForeclosedIndicator = 1;
            this.codeclarations.propertyForeclosedIndicator = 0;

            this.declarations.partyToLawsuitIndicator = 1;
            this.codeclarations.partyToLawsuitIndicator = 0;

            this.declarations.obligatedLoanIndicator = 1;
            this.codeclarations.obligatedLoanIndicator = 0;

            this.declarations.presentlyDelinquentIndicator = 1;
            this.codeclarations.presentlyDelinquentIndicator = 0;

            this.declarations.obligatedLoanIndicator = 1;
            this.codeclarations.obligatedLoanIndicator = 0;

            this.declarations.alimonyChildSupportObligation = 1;
            this.codeclarations.alimonyChildSupportObligation = 0;

            this.declarations.downPaymentIndicator = 1;
            this.codeclarations.downPaymentIndicator = 0;

            this.declarations.noteEndorserIndicator = 1;
            this.codeclarations.noteEndorserIndicator = 0;

            this.declarations.propertyAsPrimaryResidence = 0;
            this.codeclarations.propertyAsPrimaryResidence = 0;

            this.declarations.ownershipInterestLastThreeYears = 0;
            this.codeclarations.ownershipInterestLastThreeYears = 0;

            this.declarations.priorPropertyTitleType = 1;
            this.codeclarations.priorPropertyTitleType = 2;

            this.declarations.typeOfProperty = 0;
            this.codeclarations.typeOfProperty = 1;

        }

        populateGovtMonitoring = () => {
            this.declarations = this.loan.loanApp.borrower.declarations;
            this.declarations.ethnicityId = 1;
            this.declarations.race = 2;
            this.declarations.sexId = 1;
            this.codeclarations = this.loan.loanApp.coBorrower.declarations;
            this.codeclarations.ethnicityId = 0;
            this.codeclarations.race = 3;
            this.codeclarations.sexId = 1;
        }


        getOwnerTypeLookups = (): ng.IPromise<vm.ILookupEntry<srv.OwnerTypeEnum>[]> | vm.ILookupEntry<srv.OwnerTypeEnum>[] => {
            return this.ownerTypeLookup;
        }

        populateOwnerTypeLookup = () => {
            this.ownerTypeLookup = [];

            this.ownerTypeLookup.push({ value: srv.OwnerTypeEnum.Borrower, text: this.loan.loanApp.borrower.fullName });

            if (this.loan.loanApp.hasCoBorrower) {
                this.ownerTypeLookup.push({ value: srv.OwnerTypeEnum.CoBorrower, text: this.loan.loanApp.coBorrower.fullName });
            }

            this.ownerTypeLookup.push({ value: srv.OwnerTypeEnum.Joint, text: "Joint" });
        }

        //this code is only for testing and must be removed before going into production
        populatePersonalInfo = () => {
            this.loan.loanApp.borrower.firstName = "Tom";
            this.loan.loanApp.borrower.lastName = "Brogans";
            this.loan.loanApp.borrower.middleName = "T";
            this.loan.loanApp.borrower.maritalStatus = 1;
            this.loan.loanApp.borrower.email = "tom@hotmail.com";
            this.loan.loanApp.borrower.preferredPhone = "865-443-2156";
            this.loan.loanApp.borrower.preferredPhoneType = "1";
            this.loan.loanApp.coBorrower.firstName = "Roberto";
            this.loan.loanApp.coBorrower.lastName = "Clemente";
            this.loan.loanApp.coBorrower.middleName = "S";
            this.loan.loanApp.coBorrower.maritalStatus = 2;
        }

        populatePropertyInfo = () => {
            this.loan.property.streetName = "1313 Mockingbird Lane";
            this.loan.property.cityName = "Redmond";
            this.loan.property.stateName = "NY";
            this.loan.property.zipCode = "11745";
            this.loan.property.propertyType = 1;
            this.loan.property.occupancyType = 2;
            this.loan.property.currentEstimatedValue = 510000;
            this.loan.property.purchasePrice = 300000;
            this.loan.loanPurposeType = 2;
            var pDate = new Date("2009-12-15");
            this.loan.property.purchaseDate = pDate;
            this.loan.property.isCurrentAddressSame = false;
        }


        populateAddress = () => {
            this.loan.loanApp.borrower.currentAddress.streetName = "1515 Main Street";
            this.loan.loanApp.borrower.currentAddress.stateName = "WA";
            this.loan.loanApp.borrower.currentAddress.cityName = "Commack";
            this.loan.loanApp.borrower.currentAddress.zipCode = "98052";
            this.loan.loanApp.borrower.currentAddress.ownOrRent = 2;
            this.loan.loanApp.borrower.currentAddress.timeAtAddressYears = 3;
            this.loan.loanApp.borrower.currentAddress.timeAtAddressMonths = 5;
            this.loan.loanApp.borrower.currentAddress.isMailingAddressDifferent = true;
            this.loan.loanApp.borrower.mailingAddress.streetName = "139 Force Way";
            this.loan.loanApp.borrower.mailingAddress.stateName = "WA";
            this.loan.loanApp.borrower.mailingAddress.cityName = "Redmond";
            this.loan.loanApp.borrower.mailingAddress.zipCode = "98052";
            this.loan.loanApp.coBorrower.currentAddress.streetName = "198 Force Way";
            this.loan.loanApp.coBorrower.currentAddress.stateName = "WA";
            this.loan.loanApp.coBorrower.currentAddress.cityName = "Redmond";
            this.loan.loanApp.coBorrower.currentAddress.zipCode = "98052";
            this.loan.loanApp.coBorrower.currentAddress.ownOrRent = 1;
            this.loan.loanApp.coBorrower.currentAddress.timeAtAddressYears = 5;
            this.loan.loanApp.coBorrower.currentAddress.timeAtAddressMonths = 2;
            this.loan.loanApp.coBorrower.currentAddress.isMailingAddressDifferent = false;
        }

        populateEmployment = () => {
            this.employmentType = srv.EmploymentTypeEnum.SalariedEmployee;
            if (this.loan.loanApp.coBorrower.employments.length > 0)
                this.employmentActive = this.loan.loanApp.coBorrower.employments[0];
        }

        hasCoBorrower = () => {
            return this.loan.loanApp.hasCoBorrower;
        }
        SaveContinuePoperty = () => {
            this.$location1.url('/credit');
           //  this.navigationService.goToAddress();
        }

        showYesNo = (val) => {
            if (val) {
                return "Yes";
            }
            else {
                return "No";
            }
        }

    }
    moduleRegistration.registerController(consumersite.moduleName, SummaryController);
} 