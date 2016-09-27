/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var AppraisalController = (function () {
        function AppraisalController(loan, loanAppPageContext, applicationData, $state) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.$state = $state;
            //setPreferredContact = () => {
            //    var preferredContactType: string = this.loan.appraisal.contactRelation;
            //    if (this.isBorrowerContact) {
            //        if (preferredContactType === "borrower") {
            //            this.loan.appraisal.email = borrower.email;
            //            this.loan.appraisal.firstName = borrower.firstName;
            //            this.loan.appraisal.lastName = borrower.lastName;
            //            this.loan.appraisal.phone = borrower.preferredPhone.number;
            //            this.loan.appraisal.phoneType = borrower.preferredPhone.type;
            //        }
            //        if (this.loan.loanApp.hasCoBorrower && preferredContactType === "coborrower") {
            //            this.loan.appraisal.email = coBorrower.email;
            //            this.loan.appraisal.firstName = coBorrower.firstName;
            //            this.loan.appraisal.lastName = coBorrower.lastName;
            //            this.loan.appraisal.phone = coBorrower.preferredPhone.number;
            //            this.loan.appraisal.phoneType = coBorrower.preferredPhone.type;
            //        }
            //    }
            //    else {//otherwise, reset to blank
            //        this.loanViewModel.appraisal.appraisalContact = new vm.Appraisal;
            //    }
            //}
            //get isBorrowerContact(): boolean {
            //    if (this.loan.appraisal.contactRelation === "borrower" || this.loan.appraisal.contactRelation === "coborrower") {
            //        return true;
            //    }
            //    return false;
            //}
            //get isCoBorrowerContact(): boolean {
            //    return false;
            //}
            //get phoneTypeOptions(): any[] {
            //    return [];
            //}
            ////appraisal payment info section
            //get billingAddress(): srv.IAddressViewModel_OBSOLETE {
            //    return this.loan.appraisal.billingAddress;
            //};
            //set billingAddress(val: srv.IAddressViewModel_OBSOLETE) {
            //    this.loan.appraisal.billingAddress = val;
            //};
            //get ccvNumber(): string {
            //    return this.loan.appraisal.ccvNumber;
            //}
            //set ccvNumber(val: string) {
            //    this.loan.appraisal.ccvNumber = val;
            //}
            //get creditCardExpirationMonth(): string {
            //    return this.loan.appraisal.creditCardExpirationMonth;
            //}
            //set creditCardExpirationMonth(val: string) {
            //    this.loan.appraisal.creditCardExpirationMonth = val;
            //}
            //get creditCardExpirationYear(): string {
            //    return this.loan.appraisal.creditCardExpirationYear;
            //}
            //set creditCardExpirationYear(val: string) {
            //    this.loan.appraisal.creditCardExpirationYear = val;
            //}
            //get creditCardNumber(): string {
            //    return this.loan.appraisal.creditCardNumber;
            //}
            //set creditCardNumber(val: string) {
            //    this.loan.appraisal.creditCardNumber = val;
            //}
            //get creditCardType(): string {
            //    return this.loan.appraisal.creditCardType;
            //}
            //set creditCardType(val: string) {
            //    this.loan.appraisal.creditCardType = val;
            //}
            //get nameOnCreditCard(): string {
            //    return this.loan.appraisal.nameOnCreditCard;
            //}
            //set nameOnCreditCard(val: string) {
            //    this.loan.appraisal.nameOnCreditCard = val;
            //}
            ////appraisal contact section
            //get contactRelation(): string {
            //    return this.loan.appraisal.contactRelation;
            //}
            //setPreferredContact(val: string) {
            //    //this is more work than anticipated, ouch.
            //    this.loan.appraisal.contactRelation = val;
            //}
            //get email(): string {
            //    return this.loan.appraisal.email;
            //}
            //set email(val: string) {
            //    this.loan.appraisal.email = val;
            //}
            //get firstName(): string {
            //    return this.loan.appraisal.firstName;
            //}
            //set firstName(val: string) {
            //    this.loan.appraisal.firstName = val;
            //}
            //get lastName(): string {
            //    return this.loan.appraisal.lastName;
            //}
            //set lastName(val: string) {
            //    this.loan.appraisal.lastName = val;
            //}
            //get phone(): string {
            //    return this.loan.appraisal.phone;
            //}
            //set phone(val: string) {
            //    this.loan.appraisal.phone = val;
            //}
            //get phoneType(): string {
            //    return this.loan.appraisal.phoneType;
            //}
            //set phoneType(val: string) {
            //    this.loan.appraisal.phoneType = val;
            //}
            //get specialInstructions(): string {
            //    return this.loan.appraisal.specialInstructions;
            //}
            //set specialInstructions(val: string) {
            //    this.loan.appraisal.specialInstructions = val;
            //}
            this.placeOrder = function () {
                //temporarily, the appraisal page does not save.
                _this.goToUploadDocuments();
            };
            this.goToUploadDocuments = function () {
                _this.$state.go('consumerSite.myNextStep.documentUpload');
            };
            //by default, the billing address is set to the same as the property
            this.isBillingSameAsProperty = true;
            //@TODO DEMO
            this.demo_appraisalProducts = [
                { name: "Appraisal Product 501", amount: "500" },
                { name: "Appraisal Product 502", amount: "900" }
            ];
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(AppraisalController.prototype, "appraisalProducts", {
            get: function () {
                return this.demo_appraisalProducts;
                //return this.loan.appraisal.appraisalProducts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppraisalController.prototype, "totalProductAmount", {
            get: function () {
                var totalAmount = 0;
                for (var i = 0; i < this.demo_appraisalProducts.length; i++) {
                    totalAmount += +this.demo_appraisalProducts[i].amount;
                }
                return totalAmount;
            },
            enumerable: true,
            configurable: true
        });
        AppraisalController.className = "appraisalController";
        AppraisalController.$inject = ['loan', 'loanAppPageContext', 'applicationData', '$state'];
        return AppraisalController;
    })();
    consumersite.AppraisalController = AppraisalController;
    moduleRegistration.registerController(consumersite.moduleName, AppraisalController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=appraisal.controller.js.map