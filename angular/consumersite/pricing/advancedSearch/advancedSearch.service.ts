/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../viewModels/loan.viewModel.ts" />
/// <reference path="../../consumersite.module.ts" />


module consumersite {
   

    class PricingAdvancedSearchController {

        constructor(private loan: vm.Loan, private $modalInstance: ng.ui.bootstrap.IModalServiceInstance, private applicationData: any) {
            this.loanPurpose = [{ val: 1, text: 'Purchase' }, { val: 2, text: 'Refinance' }];
        }
        //something is up with this one, the remainder are still saving properly
        public loanPurpose: OptionViewModel[];
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

        get loanPurposeType(): srv.LoanPurposeTypeEnum {
            return this.loan.loanPurposeType;
        }
        set loanPurposeType(loanPurposeType: srv.LoanPurposeTypeEnum) {
            this.loan.loanPurposeType = loanPurposeType;
        }

        public get propertyType(): string {
            return this.loan.getLoan().getSubjectProperty().propertyType;
        }
        public set propertyType(value: string) {
            this.loan.getLoan().getSubjectProperty().propertyType = value;
        }

        public get homeUseType(): srv.PropertyUsageTypeEnum {
            return this.loan.getLoan().active.occupancyType;
        }
        public set homeUseType(value: srv.PropertyUsageTypeEnum) {
            this.loan.getLoan().active.occupancyType = value;
        }

        public taxTypes: OptionViewModel[];

        get taxType(): string {
            return this.loan.getLoan().otherInterviewData.selectedImpoundsOption;
        }
        set taxType(taxType: string) {
            this.loan.getLoan().otherInterviewData.selectedImpoundsOption = taxType;
        }

        public employmentStatusTypes: OptionViewModel[];

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

        public secondMortgageTypes: OptionViewModel[];

        get secondMortgageType(): string {
            return this.loan.getLoan().otherInterviewData.existingSecondMortgage;
        }
        set secondMortgageType(secondMortgageType: string) {
            this.loan.getLoan().otherInterviewData.existingSecondMortgage = secondMortgageType;
        }

        get is2ndFixed(): boolean {
            // secondMortgageType = "0"; // 0:"No" ; 1:"Fixed Rate" ; 2:"Home Equity Line of Credit"
            return this.has2nd && this.secondMortgageType == "1";
        }

        set is2ndFixed(is2ndFixed: boolean) {
            /*Read Only*/
        }

        _isVAEligible: boolean;
        get isVAEligible(): boolean {
            return this._isVAEligible;
        }
        set isVAEligible(val: boolean)
        {
            this._isVAEligible = val;
            if (val == false) {
            }
        }

        _isVAUsedBefore: boolean;  //todo map
        get isVAUsedBefore(): boolean {
            return this._isVAUsedBefore;
        }
        set isVAUsedBefore(val: boolean) {
            this._isVAUsedBefore = val;
        }

        _isOnVADisablity: boolean;//todo map
        get isOnVADisablity(): boolean {
            return this._isOnVADisablity;
        }
        set isOnVADisablity(val: boolean) {
            this._isOnVADisablity = val;
        }
        _militaryBranch: string;//todo map
        get militaryBranch(): string {
            return this._militaryBranch;
        }
        set militaryBranch(val: string) {
             this._militaryBranch=val;
        }

        public branch: OptionViewModel[];
        private static militaryBranches_lookup = [
            { text: 'Army', value: (<number>srv.MilitaryBranchOrServiceTypeEnum.Army).toString() },
            { text: 'Air Force', value: (<number>srv.MilitaryBranchOrServiceTypeEnum.AirForce).toString() },
            { text: 'Marines', value: (<number>srv.MilitaryBranchOrServiceTypeEnum.Marines).toString() },
            { text: 'Navy', value: (<number>srv.MilitaryBranchOrServiceTypeEnum.Navy).toString() },
            { text: 'Other', value: (<number>srv.MilitaryBranchOrServiceTypeEnum.Other).toString() },
        ];
        public get militaryBranches(): any {
            return PricingAdvancedSearchController.militaryBranches_lookup;
        }

        //view search
        //public get vs(): vm.IPricingAdvancedSearchViewModel {
        //    return this.loan.pricingSearch;
        //}
        //public set vs(val: vm.IPricingAdvancedSearchViewModel) {
        //    this.loan.pricingSearch = val;
        //}




        //The "Get my Rates" button should call the close and pass in the pricingAdvancedSearchViewModel
        getRates = () => {
            //var pricingAdvancedSearchModel: vm.IPricingAdvancedSearchViewModel = {
            //    getRatesClicked: true
            //};
            //this.loan.pricingSearch = pricingAdvancedSearchModel;
          
           this.$modalInstance.close(this.loan);
        }
        close = () => {
            this.$modalInstance.close(this.loan);
        }
        //if the user clicks outside of the modal or on the "close" in the top right corner.
        dismiss = () => {
            this.$modalInstance.dismiss("Canceled by user");
        }

        clearVAInfomation = () => {

            if (!this._isVAEligible) {
                this.isVAUsedBefore = false;
                this.isOnVADisablity = false;
                this.militaryBranch = "";
            }
        }
    }


    export class PricingAdvancedSearchService {
        static className = 'pricingAdvancedSearchService';

        static $inject = ['$log', '$modal'];

        constructor(private $log: ng.ILogService, private $modal: ng.ui.bootstrap.IModalService) { }
        static _loan: vm.Loan;
        
        get loan(): vm.Loan {
            return PricingAdvancedSearchService._loan;
        }
        set(val: vm.Loan) {
            PricingAdvancedSearchService._loan = val;
        }
        //successCallback: (getRates: boolean) => void;

        openAdvancedSearchModal = (loan: vm.Loan, applicationData,successCallback: (getRates:boolean) => void, errorCallback?: () => void) => {
            PricingAdvancedSearchService._loan = loan;
          //  this.successCallback = successCallback;
            var loanPurposeType = loan.getLoan().loanPurposeType;
            var isRefi = loanPurposeType == srv.LoanPurposeTypeEnum.Refinance;
            var isPurch = loanPurposeType == srv.LoanPurposeTypeEnum.Purchase;
            var employmentType = loan.loanApp.borrower.employments[0].employmentType;
            var employmentTypeStr = (<number>employmentType).toString();
            var secondMortgageType = loan.getLoan().otherInterviewData.existingSecondMortgage;
            var has2nd = isRefi && secondMortgageType != "0";
            var numUnits = loan.getLoan().getSubjectProperty().numberOfUnits.toString();
            //load IPricingAdvancedSearchViewModel from loanViewModel
            var searchModal: angular.ui.bootstrap.IModalServiceInstance = this.$modal.open({
                templateUrl: '/angular/consumersite/pricing/advancedSearch/advancedSearch.html',
                backdrop: true, //Backdrop enabled, with click outside functional
                backdropClass: 'noBackdrop', //Hide the backdrop from the view, but keep the click outside functionality.
                windowClass: 'advancedSearchPosition',
                controller: () => {
                    return new PricingAdvancedSearchController(this.loan, searchModal, applicationData);
                },
                controllerAs: 'advSearchCntrl',
            });

            searchModal.result.then(
                //success
                (results: vm.Loan) => {
                    console.log("closed");
                   // if (results.pricingSearch.getRatesClicked = true) {
                        successCallback(true);
                   // }
                   // else {
                        successCallback(false);
                    //}
                },
                //cancel
                (reason) => {
                    console.log("dismissed");
                    console.log(reason);
                });
        };
    }

    moduleRegistration.registerService(consumersite.moduleName, PricingAdvancedSearchService);
}