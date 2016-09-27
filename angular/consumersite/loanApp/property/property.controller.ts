/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {
    export class PropertyController {
        static className = "propertyController";

        static $inject = ['loan', 'loanAppPageContext', 'applicationData', 'navigationService', '$scope', '$location'];

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any, private navigationService: consumersite.UINavigationService, $scope, $location) {

            //Scroll so just the loanAppNavbarIsVisible
            //loanAppPageContext.scrollToTop();
        }

        get isPurchaseTypeLoan() {
            return this.loan.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase;
        }
        set isPurchaseTypeLoan(isPurchaseTypeLoan: boolean) {
            /*Read Only*/
        }

        get isSameAsPropertyAddress() {
            return this.loan.loanApp.borrower.currentAddress.isSameAsPropertyAddress;
        }
        set isSameAsPropertyAddress(isSameAsPropertyAddress: boolean) {
            this.loan.loanApp.borrower.currentAddress.isSameAsPropertyAddress = isSameAsPropertyAddress;
        }
    }

    // @todo-cc: REMOVE
    export class PropertyControllerVx {

        static className = "propertyControllerVx";

        static $inject = ['loan', 'loanAppPageContext', 'applicationData','navigationService', '$scope', '$location'];

        sameaddress: boolean;
        streetNamePlaceholder: string;

        $location1;
      

        constructor(public loan: vm.Loan, private loanAppPageContext: LoanAppPageContext, private applicationData: any, private navigationService: consumersite.UINavigationService,  $scope,  $location) {
            this.sameaddress = true;
            this.streetNamePlaceholder = "TBD";
            loan.property.numberOfUnits = 1;
            loan.property.NeedPreApproval = true;
            //loan.property.isCurrentAddressSame= true;
            this.$location1 = $location;

            
          
          //  $scope.UINavigate.canNavigate = true;
        }


        isPurchaseTypeLoan = () => {
            return this.loan.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase;
        }

        SaveContinueProperty = () => {
            this.$location1.url('/borrowerAddressInfo');
            // this.navigationService.goToAddress();
        }

        //isRefinanceTypeLoan = () => {
        //    //return this.loan.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance;
        //    return true;
        //}

        needPreApproval_Click = (value) => {
            console.log(value);
            this.loan.property.NeedPreApproval = value;
            this.streetNamePlaceholder = value ? "TBD" : "";
        }
    }
    moduleRegistration.registerController(consumersite.moduleName, PropertyController);
} 

