/// <reference path='../../../angular/ts/extendedViewModels/employmentInfo.extendedViewModel.ts' />
/// <reference path='../../../angular/ts/extendedViewModels/incomeInfo.extendedViewModel.ts' />

module consumersite.vm {

    export class Employment {

        private getEmployment: () => cls.EmploymentInfoViewModel;

        constructor(employment: cls.EmploymentInfoViewModel) {
            this.getEmployment = () => {
                return employment;
            }
        }

        get startingDate(): Date {
            return this.getEmployment().employmentStartDate;
        }
        set startingDate(startingDate: Date) {
            this.getEmployment().employmentStartDate = startingDate;
        }

        get endingDate(): Date {
            if (!angular.isDefined(this.getEmployment().employmentEndDate)) {
                this.getEmployment().employmentEndDate = new Date();
            }
            return this.getEmployment().employmentEndDate;
        }
        set endingDate(endingDate: Date) {
            this.getEmployment().employmentEndDate = endingDate;
        }

        get employmentType() {
            return this.getEmployment().employmentTypeId;
        }
        set employmentType(employmentType: srv.EmploymentTypeEnum) {
            this.getEmployment().employmentTypeId = employmentType;
        }

        get positionDescription(): string {
            return this.getEmployment().positionDescription;
        }
        set positionDescription(positionDescription: string) {
            this.getEmployment().positionDescription = positionDescription;
        }

        get typeOfBusiness(): string {
            return this.getEmployment().typeOfBusiness;
        }
        set typeOfBusiness(typeOfBusiness: string) {
            this.getEmployment().typeOfBusiness = typeOfBusiness;
        }

        get yearsInTheSameField(): number {
            return this.getEmployment().yearsInThisProfession;
        }
        set yearsInTheSameField(yearsInTheSameField: number) {
            this.getEmployment().yearsInThisProfession = yearsInTheSameField;
        }

        get companyName(): string {
            return this.getEmployment().name;
        }
        set companyName(companyName: string) {
            this.getEmployment().name = companyName;
        }

        get businessPhone(): string {
            return this.getEmployment().businessPhone;
        }
        set businessPhone(businessPhone: string) {
            this.getEmployment().businessPhone = businessPhone;
        }

        get companyFullAddress(): string {
            return this.getEmployment().address.fullAddressString;
        }
        get companyStreet(): string {
            return this.getEmployment().address.streetName;
        }
        set companyStreet(companyStreet: string) {
            this.getEmployment().address.streetName = companyStreet;
        }

        get companyCity(): string {
            return this.getEmployment().address.cityName;
        }
        set companyCity(companyCity: string) {
            this.getEmployment().address.cityName = companyCity;
        }

        get companyState(): string {
            return this.getEmployment().address.stateName;
        }
        set companyState(companyState: string) {
            this.getEmployment().address.stateName = companyState;
        }

        get companyZip(): string {
            return this.getEmployment().address.zipCode;
        }
        set companyZip(companyZip: string) {
            this.getEmployment().address.zipCode = companyZip;
        }

        private getBaseIncomeInfo = (): srv.IIncomeInfoViewModel => {
            var baseEmployment = this.getEmployment().incomeInfoByTypeId(srv.IncomeTypeEnum.BaseEmployment);
            if (!baseEmployment) {
                baseEmployment = new cls.IncomeInfoViewModel(this.getEmployment().getTransactionInfo());
                baseEmployment.incomeTypeId = srv.IncomeTypeEnum.BaseEmployment;
                this.getEmployment().getIncomeInformation().push(baseEmployment);
            }
            return baseEmployment;
        }
        ;
        get preferredPaymentPeriodId(): srv.preferredPaymentPeriodsTypeEnum {
            return this.getBaseIncomeInfo().preferredPaymentPeriodId;
        }

        set preferredPaymentPeriodId(preferredPaymentPeriodType: srv.preferredPaymentPeriodsTypeEnum) {
            this.getBaseIncomeInfo().preferredPaymentPeriodId = preferredPaymentPeriodType;
        }

        isMonthlySalary = (): boolean => {
            return this.getBaseIncomeInfo().preferredPaymentPeriodId == srv.preferredPaymentPeriodsTypeEnum.Monthly;
        }

        //The view doesn't want a zero if it is empty.  It wants null or ""
        get baseSalary(): number {
            var amount = this.getBaseIncomeInfo().amount;
            if (!angular.isDefined(amount) || amount == 0) {
                amount = null;
            }
            return amount;
        }
        set baseSalary(baseSalary: number) {
            this.getBaseIncomeInfo().amount = baseSalary;
        }

    }
}