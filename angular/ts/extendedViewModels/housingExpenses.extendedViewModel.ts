module srv {
    export interface IHousingExpensesViewModel {
        newTotalHousingExpenses?: number;
        totalHousingExpenses?: number;
    }
}

module cls {

    export class HousingExpensesViewModel extends srv.cls.HousingExpensesViewModel {
        constructor(housingExpenses?: srv.IHousingExpensesViewModel, public getPropertyList?: () => srv.IList<srv.IPropertyViewModel>,  
            public getCosts?: () => srv.IList<srv.ICostViewModel>, public loanType?: number, public getPledgedAssets?: () => srv.IList<srv.ILiabilityViewModel>, public subjectProperty? : srv.IPropertyViewModel) {
            super();
            if (housingExpenses)
                common.objects.automap(this, housingExpenses);
        }

        get newTotalHousingExpenses() {
            return this.newMonthlyPayment;
        }

        get currentMonthlyPayment(): number {
            return Number(this.floodInsurance) + Number(this.taxes) + Number(this.firstMtgPi) + Number(this.rent) +
                Number(this.mtgInsurance) + Number(this.hoa) + Number(this.hazardInsurance) + Number(this.secondMtgPi);
        }

        get newMonthlyPayment(): number {
            return Number(this.newFloodInsurance) + Number(this.newTaxes) + Number(this.newFirstMtgPi) +
                Number(this.newMtgInsurance) + Number(this.newHoa) + Number(this.newHazardInsurance) + Number(this.newSecondMtgPi);
        }

        get totalHousingExpenses() {
            return this.currentMonthlyPayment;
        }

        get floodInsuranceImpounded() {
            return this.isPropertyExpenseImpounded(srv.propertyExpensesType.FloodInsurance);
        }

        get newFloodInsuranceImpounded() {
            return this.getFlood().impounded;
        }

        get newHazardInsuranceImpounded() {
            return this.getHoi().impounded;
        }

        get hazardInsuranceImpounded() {
            return this.isPropertyExpenseImpounded(srv.propertyExpensesType.HOI);
        }

        get hoaImpounded() {
            return this.isPropertyExpenseImpounded(srv.propertyExpensesType.HOA);
        }

        get newHoaImpounded() {
            return false;
        }

        get mtgInsuranceImpounded() {
            return this.isPropertyExpenseImpounded(srv.propertyExpensesType.PMI);
        }

        get newMtgInsuranceImpounded() {
            return this.getMi().impounded
        }

        get taxesImpounded() {
            return this.isPropertyExpenseImpounded(srv.propertyExpensesType.Tax);
        }

        get newTaxesImpounded() {
            return this.getTax().impounded;
        }

        private isPropertyExpenseImpounded(propertyExpenseType: srv.propertyExpensesType) {
            return this.isExpenseImpounded(this.getPropertyExpenses(), propertyExpenseType);
        }

        private getPropertyExpenses = (): srv.ICollection<srv.IPropertyExpenseViewModel> => {
            if (!this.getPropertyList)
                return;

            var properties = this.getPropertyList();
            var property;
            if (properties && properties.length > 0) {
                var primaryResidences = properties.filter((p) => (p.occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence || p.addressTypeId == 1));

                if (this.loanType == srv.LoanType.Purchase) {
                    property = primaryResidences.filter((p) => !p.isSubjectProperty)[0];
                    if (property)
                        return property.propertyExpenses;

                    property = primaryResidences.filter((p) => p.addressTypeId == 1)[0];
                    if (property)
                        return property.propertyExpenses;
                } 
            } 

            return this.subjectProperty.propertyExpenses;
        }

        public getPropertyExpensesForProperty = (properties: any): srv.ICollection<srv.IPropertyExpenseViewModel> => {

            if (properties && properties.length > 0) {
                var property;
                var primaryResidences = properties.filter((p) => (p.occupancyType == String(srv.OccupancyType.PrimaryResidence) || p.addressTypeId == 1));

                if (this.loanType == srv.LoanType.Purchase) {
                    property = primaryResidences.filter((p) => !p.isSubjectProperty)[0];
                    if (property)
                        return property.propertyExpenses;

                    property = primaryResidences.filter((p) => p.addressTypeId == 1)[0];
                    if (property)
                        return property.propertyExpenses;
                }

                return properties[0].propertyExpenses;
            }
            else {
                return null;
            }

            
        }

        private getCost = (hudLineNumber: number): srv.ICostViewModel => {
            if (this.getCosts) {
                var costs = this.getCosts();
                var cost: srv.ICostViewModel;

                if (costs.length > 0) {
                    var filteredCosts = costs.filter((c) => c["hudLineNumber"] == hudLineNumber);
                    if (filteredCosts && filteredCosts.length > 0)
                        cost = filteredCosts[0];
                }
            }
            return cost ? cost : new srv.cls.CostViewModel();
        }

        private getTax = (): srv.ICostViewModel => {
            return this.getCost(1004);
        }

        private getHoi = (): srv.ICostViewModel => {
            return this.getCost(1002);
        }

        private getMi = (): srv.ICostViewModel => {
            return this.getCost(1003);
        }

        private getFlood = (): srv.ICostViewModel => {
            return this.getCost(1006);
        }

        get totalImpounds() {
            return (this.getHoi().impounded ? Number(this.newHazardInsurance) : 0) + (this.getTax().impounded ? Number(this.newTaxes) : 0)
                + (this.getMi().impounded ? Number(this.newMtgInsurance) : 0) + (this.getFlood().impounded ? Number(this.newFloodInsurance) : 0);
        }

        private isExpenseImpounded = (expenses: srv.IList<srv.IPropertyExpenseViewModel>, propertyExpenseType: srv.propertyExpensesType): boolean => {

            if (!expenses)
                return false;

            var filteredExpenses = expenses.filter((i) => i.type == String(propertyExpenseType));
            if (filteredExpenses && filteredExpenses.length > 0) {
                var expense = filteredExpenses[0];
                return expense.impounded && <number>expense.monthlyAmount > 0;
            }

            return false;
        }
    }

}