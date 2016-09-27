/// <reference path='../../../angular/ts/extendedViewModels/asset.extendedViewModel.ts' />
/// <reference path="../viewmodels/employment.viewmodel.ts" />
var consumersite;
(function (consumersite) {
    var LookupService = (function () {
        function LookupService() {
            var _this = this;
            this.assetTypeLookup = [
                { value: srv.AssetTypeEnum.None, text: 'None' },
                { value: srv.AssetTypeEnum.Checking, text: 'Checking' },
                { value: srv.AssetTypeEnum.Savings, text: 'Savings' },
                { value: srv.AssetTypeEnum.CD, text: 'CD' },
                { value: srv.AssetTypeEnum.MutualFunds, text: 'Mutual Funds' },
                { value: srv.AssetTypeEnum.Bonds, text: 'Bonds' },
                { value: srv.AssetTypeEnum.Stocks, text: 'Stocks' },
                { value: srv.AssetTypeEnum.MoneyMarket, text: 'Money Market' },
                { value: srv.AssetTypeEnum.RetirementFund, text: 'Retirement Fund' },
                { value: srv.AssetTypeEnum.IRA, text: 'IRA' },
                { value: srv.AssetTypeEnum.GiftFunds, text: 'Gift Funds' },
                { value: srv.AssetTypeEnum.EscrowDeposit, text: 'Escrow Deposit' },
                { value: srv.AssetTypeEnum.ProceedsfromaPropertySale, text: 'Proceeds from a Property Sale' },
                { value: srv.AssetTypeEnum.TrustFunds, text: 'Trust Funds' },
                { value: srv.AssetTypeEnum.LifeInsuranceCashValue, text: 'Life Insurance Cash Value' },
                { value: srv.AssetTypeEnum.Other, text: 'Other' },
                { value: srv.AssetTypeEnum.Automobile, text: 'Automobile' },
                { value: srv.AssetTypeEnum.SecuredBorrowerFundsNotDeposited, text: 'Secured Borrower Funds Not Deposited' },
                { value: srv.AssetTypeEnum.NotRequired, text: 'Not Required' },
            ];
            this.getAssetTypeLookups = function () {
                return _this.assetTypeLookup;
            };
            this.maritalStatusTypeLookup = [
                { value: srv.MaritalStatusTypeEnum.SelectOne, text: 'Select One' },
                { value: srv.MaritalStatusTypeEnum.Unmarried, text: 'Unmarried' },
                { value: srv.MaritalStatusTypeEnum.Married, text: 'Married' },
                { value: srv.MaritalStatusTypeEnum.Separated, text: 'Seperated' },
            ];
            this.getMaritalStatusTypeLookups = function () {
                return _this.maritalStatusTypeLookup;
            };
            this.employmentTypeLookup = [
                { value: srv.EmploymentTypeEnum.SalariedEmployee, text: 'Salaried Employee' },
                { value: srv.EmploymentTypeEnum.ActiveMilitaryDuty, text: 'Active Military Duty' },
                { value: srv.EmploymentTypeEnum.SelfEmployed, text: 'Self Employed' },
                { value: srv.EmploymentTypeEnum.Retired, text: 'Retired' },
                { value: srv.EmploymentTypeEnum.OtherOrUnemployed, text: 'Other/Unemployed' },
            ];
            this.getEmploymentTypeLookups = function () {
                return _this.employmentTypeLookup;
            };
            this.phoneNumberTypeLookup = [
                { value: srv.PhoneNumberType.None, text: 'Select One' },
                { value: srv.PhoneNumberType.Cell, text: 'Cell' },
                { value: srv.PhoneNumberType.Home, text: 'Home' },
                { value: srv.PhoneNumberType.Work, text: 'Work' },
                { value: srv.PhoneNumberType.Other, text: 'Other' },
            ];
            this.getPhoneNumberTypeLookups = function () {
                return _this.phoneNumberTypeLookup;
            };
            this.occupancyTypeLookup = [
                { value: srv.OccupancyType.None, text: 'Select One' },
                { value: srv.OccupancyType.PrimaryResidence, text: 'Primary Residence' },
                { value: srv.OccupancyType.InvestmentProperty, text: 'Investment Property' },
                { value: srv.OccupancyType.SecondVacationHome, text: 'Second / Vacation Home' },
            ];
            this.getOccupancyTypeLookups = function () {
                return _this.occupancyTypeLookup;
            };
            this.propertyTypeLookup = [
                { value: srv.PropertyTypeEnum.Commercial, text: 'Commercial' },
                { value: srv.PropertyTypeEnum.Condominium, text: 'Condominium' },
                { value: srv.PropertyTypeEnum.Condotel, text: 'Condotel' },
                { value: srv.PropertyTypeEnum.Cooperative, text: 'Cooperative' },
                { value: srv.PropertyTypeEnum.Farm, text: 'Farm' },
                { value: srv.PropertyTypeEnum.HomeAndBusinessCombined, text: 'Home And Business Combined' },
                { value: srv.PropertyTypeEnum.Land, text: 'Land' },
                { value: srv.PropertyTypeEnum.ManufacturedHousingDoubleWide, text: 'Manufactured Housing Double Wide' },
                { value: srv.PropertyTypeEnum.ManufacturedHousingSingleWide, text: 'Manufactured Housing Single Wide' },
                { value: srv.PropertyTypeEnum.MixedUse, text: 'Mixed Use' },
                { value: srv.PropertyTypeEnum.MobileHome, text: 'Mobile Home' },
                { value: srv.PropertyTypeEnum.Modular, text: 'Modular' },
                { value: srv.PropertyTypeEnum.MultiFamilyMoreThanFourUnits, text: 'Multi-Family More Than Four Units' },
                { value: srv.PropertyTypeEnum.MultiFamilyTwoToFourUnits, text: 'Multi-Family Two To Four Units' },
                { value: srv.PropertyTypeEnum.None, text: 'None' },
                { value: srv.PropertyTypeEnum.NonWarrantableCondo, text: 'Non Warrantable Condo' },
                { value: srv.PropertyTypeEnum.PUD, text: 'PUD' },
                { value: srv.PropertyTypeEnum.SingleFamily, text: 'Single Family' },
                { value: srv.PropertyTypeEnum.Timeshare, text: 'Timeshare' },
                { value: srv.PropertyTypeEnum.TownHouse, text: 'Town House' },
            ];
            this.getPropertyTypeLookups = function () {
                return _this.propertyTypeLookup;
            };
            this.propertyUsageTypeLookup = [
                { value: srv.PropertyUsageTypeEnum.None, text: 'None' },
                { value: srv.PropertyUsageTypeEnum.InvestmentProperty, text: 'Investment Property' },
                { value: srv.PropertyUsageTypeEnum.PrimaryResidence, text: 'Primary Residence' },
                { value: srv.PropertyUsageTypeEnum.SecondVacationHome, text: 'Second Vacation Home' },
            ];
            this.getPropertyUsageTypeLookups = function () {
                return _this.propertyUsageTypeLookup;
            };
            this.downPaymentSourceLookup = [
                { value: 1, text: 'Other' },
            ];
            this.getDownPaymentSourceLookups = function () {
                return _this.downPaymentSourceLookup;
            };
            this.incomeTypeLookup = [
                { value: srv.IncomeTypeEnum.AlimonyChildSupport, text: 'Alimony/Child Support' },
                { value: srv.IncomeTypeEnum.AutomobileExpenseAccount, text: 'Automobile Expense Account' },
                { value: srv.IncomeTypeEnum.BaseEmployment, text: 'Base Employment' },
                { value: srv.IncomeTypeEnum.Bonuses, text: 'Bonuses' },
                { value: srv.IncomeTypeEnum.Commissions, text: 'Commissions' },
                { value: srv.IncomeTypeEnum.DisabilityIncome, text: 'Disability Income' },
                { value: srv.IncomeTypeEnum.DividendsInterest, text: 'Dividends Interest' },
                { value: srv.IncomeTypeEnum.FosterCare, text: 'Foster Care' },
                { value: srv.IncomeTypeEnum.MilitaryBasePay, text: 'Military Base Pay' },
                { value: srv.IncomeTypeEnum.MilitaryClothesAllows, text: 'Military Clothes Allows' },
                { value: srv.IncomeTypeEnum.MilitaryCombatPay, text: 'Military Combat Pay' },
                { value: srv.IncomeTypeEnum.MilitaryFlightPay, text: 'Military Flight Pay' },
                { value: srv.IncomeTypeEnum.MilitaryHazardPay, text: 'Military Hazard Pay' },
                { value: srv.IncomeTypeEnum.MilitaryOverseasPay, text: 'Military Overseas Pay' },
                { value: srv.IncomeTypeEnum.MilitaryPropPay, text: 'Military Prop Pay' },
                { value: srv.IncomeTypeEnum.MilitaryQuartersAllowance, text: 'Military Quarters Allowance' },
                { value: srv.IncomeTypeEnum.MilitaryRationsAllowance, text: 'Military Rations Allowance' },
                { value: srv.IncomeTypeEnum.MilitaryVariableHousingAllowance, text: 'Military VariableHousing Allowance' },
                { value: srv.IncomeTypeEnum.NetRental, text: 'Net Rental' },
                { value: srv.IncomeTypeEnum.NotesReceivableInstallment, text: 'Notes Receivable Installment' },
                { value: srv.IncomeTypeEnum.Other, text: 'Other' },
                { value: srv.IncomeTypeEnum.Overtime, text: 'Overtime' },
                { value: srv.IncomeTypeEnum.PartTime, text: 'Part Time' },
                { value: srv.IncomeTypeEnum.RetirementPensionIncome, text: 'Retirement Pension Income' },
                { value: srv.IncomeTypeEnum.SelfEmployedIncome, text: 'Self Employed Income' },
                { value: srv.IncomeTypeEnum.SocialSecurity, text: 'Social Security' },
                { value: srv.IncomeTypeEnum.TrustIncome, text: 'Trust Income' },
                { value: srv.IncomeTypeEnum.Unemployment, text: 'Unemployment' },
                { value: srv.IncomeTypeEnum.VABenefitsNonEducational, text: 'VA Benefits Non-Educational' },
            ];
            this.getIncomeTypeLookups = function () {
                return _this.incomeTypeLookup;
            };
        }
        LookupService.className = 'lookupService';
        LookupService.$inject = [];
        return LookupService;
    })();
    consumersite.LookupService = LookupService;
    moduleRegistration.registerService(consumersite.moduleName, LookupService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=lookup.service.js.map