module consumersite.vm {

    export class Declarations {

        
        private getDeclarations: () => srv.cls.DeclarationInfoViewModel;

        constructor(declarations: srv.cls.DeclarationInfoViewModel) {
            this.getDeclarations = () => declarations;
        }

        //REFACTOR: Issue with srv.cls.DeclarationInfoViewModel, ALL ARE NUMBERS!
        //PS: I hate myself for this.
        private isNumberTrue = (compare: any) => {
            return compare == 0;
        }

        private convertBooleanToNumber = (bool: boolean) => {
            if (bool) {
                return 1;
            }
            else {
                return 0;
            }
        }
        //Government Monitoring Page
        //Do you want to disclose this info?
        get additionalInformationCheckboxIndicator(): boolean {
            return this.getDeclarations().additionalInformationCheckboxIndicator;
        }
        set additionalInformationCheckboxIndicator(additionalInformationCheckboxIndicator: boolean) {
            this.getDeclarations().additionalInformationCheckboxIndicator = additionalInformationCheckboxIndicator;
        }

        //Are you hispanic or latino?
        get ethnicityId() {
            return this.getDeclarations().ethnicityId;
        }
        set ethnicityId(ethnicityId: number) {
            this.getDeclarations().ethnicityId = ethnicityId;
        }

        //Are you Alaska Natice, Black or AA, etc.
        get race() {
            return this.getDeclarations().race;
        }
        set race(race: number) {
            this.getDeclarations().race = race;
        }

        //Are you male or female?
        get sexId() {
            return this.getDeclarations().sexId;
        }
        set sexId(sexId: number) {
            this.getDeclarations().sexId = sexId;
        }

        //Declarations Page
        //a
        get outstandingJudgmentsIndicator(): number {
            return this.getDeclarations().outstandingJudgmentsIndicator;
        }
        set outstandingJudgmentsIndicator(value: number) {
            this.getDeclarations().outstandingJudgmentsIndicator = value;
        }
        //b        
        get bankrupcyIndicator(): number {
            return this.getDeclarations().bankrupcyIndicator;
        }
        set bankrupcyIndicator(value: number) {
            this.getDeclarations().bankrupcyIndicator = value;
        }
        //c
        get propertyForeclosedIndicator(): number {
            return this.getDeclarations().propertyForeclosedIndicator;
        }
        set propertyForeclosedIndicator(value: number) {
            this.getDeclarations().propertyForeclosedIndicator = value;
        }
        //d
        get partyToLawsuitIndicator(): number {
            return this.getDeclarations().partyToLawsuitIndicator;
        }
        set partyToLawsuitIndicator(value: number) {
            this.getDeclarations().partyToLawsuitIndicator = value;
        }
        //e
        get obligatedLoanIndicator(): number {
            return this.getDeclarations().obligatedLoanIndicator;
        }
        set obligatedLoanIndicator(value: number) {
            this.getDeclarations().obligatedLoanIndicator = value;
        }
        //f
        get presentlyDelinquentIndicator(): number {
            return this.getDeclarations().presentlyDelinquentIndicator;
        }
        set presentlyDelinquentIndicator(value: number) {
            this.getDeclarations().presentlyDelinquentIndicator = value;
        }
        //g
        get alimonyChildSupportObligation(): number {
            return this.getDeclarations().alimonyChildSupportObligation;
        }
        set alimonyChildSupportObligation(value: number) {
            this.getDeclarations().alimonyChildSupportObligation = value;
        }
        //h
        get downPaymentIndicator(): number {
            return this.getDeclarations().downPaymentIndicator;
        }
        set downPaymentIndicator(value: number) {
            this.getDeclarations().downPaymentIndicator = value;
        }
        //i
        get noteEndorserIndicator(): number {
            return this.getDeclarations().noteEndorserIndicator;
        }
        set noteEndorserIndicator(value: number) {
            this.getDeclarations().noteEndorserIndicator = value;
        }
        //j - from borrower/coborrower view model
        //k - from borrower/coborrower view model

        //l
        get propertyAsPrimaryResidence(): number {
            return this.getDeclarations().propertyAsPrimaryResidence;
        }
        set propertyAsPrimaryResidence(value: number) {
            this.getDeclarations().propertyAsPrimaryResidence = value;
        }
        //m
        get ownershipInterestLastThreeYears(): number {
            return this.getDeclarations().ownershipInterestLastThreeYears;
        }
        set ownershipInterestLastThreeYears(value: number) {
            this.getDeclarations().ownershipInterestLastThreeYears = value;
        }
        get hasOwnershipInterestLastThreeYears(): boolean {
            return this.isNumberTrue(this.getDeclarations().ownershipInterestLastThreeYears);
        }
        set hasOwnershipInterestLastThreeYears(hasOwnershipInterestLastThreeYears: boolean) {
            /*Read-Only*/
        }
        //n
        get typeOfProperty() {
            return this.getDeclarations().typeOfProperty;
        }
        set typeOfProperty(typeOfProperty: number) {
            this.getDeclarations().typeOfProperty = typeOfProperty;
        }
        //o
        get priorPropertyTitleType() {
            return this.getDeclarations().priorPropertyTitleType;
        }
        set priorPropertyTitleType(priorPropertyTitleType: number) {
            this.getDeclarations().priorPropertyTitleType = priorPropertyTitleType;
        }
    }
}