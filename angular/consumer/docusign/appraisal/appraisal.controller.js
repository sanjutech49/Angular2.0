/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
var docusign;
(function (docusign) {
    var AppraisalController = (function () {
        function AppraisalController(docusignSVC, authenticationContext, loanViewModel, $controller) {
            var _this = this;
            this.docusignSVC = docusignSVC;
            this.authenticationContext = authenticationContext;
            this.loanViewModel = loanViewModel;
            this.$controller = $controller;
            this.isBillingSameAsProperty = true;
            this.init = function () {
                _this.isBorrowerContact();
                _this.phoneTypeOptions = [
                    { id: 0 /* Home */, name: 'Home' },
                    { id: 1 /* Cell */, name: 'Cell' },
                    { id: 2 /* Work */, name: 'Work' },
                    { id: 3 /* Other */, name: 'Other' }
                ];
            };
            this.placeOrder = function () {
                _this.docusignSVC.save().then(function () {
                    _this.openSuccessController();
                });
                _this.docusignSVC.log(_this.loanViewModel.appraisal);
            };
            //Calculates the total Appraisal Product amount based on the given array of values
            this.totalProductAmount = function () {
                var total = 0;
                for (var i = 0; i < _this.loanViewModel.appraisal.appraisalProducts.length; i++) {
                    total += +_this.loanViewModel.appraisal.appraisalProducts[i].amount;
                }
                return total;
            };
            //If the borrower/coborrower is the preferred contact, disabled the input fields as the user does not have the ability to modify them on this page.
            this.isBorrowerContact = function () {
                if (_this.loanViewModel.appraisal.appraisalContact.contactRelation === "borrower" || _this.loanViewModel.appraisal.appraisalContact.contactRelation === "coborrower") {
                    return true;
                }
                return false;
            };
            //Resets the Preferred Contact fields if the user changes back to the borrower or coborrower option
            this.setPreferredContact = function () {
                var preferredContactType = _this.loanViewModel.appraisal.appraisalContact.contactRelation;
                if (_this.isBorrowerContact()) {
                    var borrowers = _this.docusignSVC.getBorrowers(_this.authenticationContext, _this.loanViewModel);
                    var borrower = borrowers[0];
                    var coBorrower = _this.hasCoBorrower ? borrowers[1] : null;
                    if (preferredContactType === "borrower") {
                        _this.loanViewModel.appraisal.appraisalContact.email = borrower.email;
                        _this.loanViewModel.appraisal.appraisalContact.firstName = borrower.firstName;
                        _this.loanViewModel.appraisal.appraisalContact.lastName = borrower.lastName;
                        _this.loanViewModel.appraisal.appraisalContact.phone = borrower.preferredPhone.number;
                        _this.loanViewModel.appraisal.appraisalContact.phoneType = borrower.preferredPhone.type;
                    }
                    if (preferredContactType === "coborrower" && angular.isDefined(coBorrower)) {
                        _this.loanViewModel.appraisal.appraisalContact.email = coBorrower.email;
                        _this.loanViewModel.appraisal.appraisalContact.firstName = coBorrower.firstName;
                        _this.loanViewModel.appraisal.appraisalContact.lastName = coBorrower.lastName;
                        _this.loanViewModel.appraisal.appraisalContact.phone = coBorrower.preferredPhone.number;
                        _this.loanViewModel.appraisal.appraisalContact.phoneType = coBorrower.preferredPhone.type;
                    }
                }
                else {
                    _this.loanViewModel.appraisal.appraisalContact = new srv.cls.AppraisalContactViewModel;
                }
            };
            this.hasCoBorrower = function () {
                if (_this.docusignSVC.getBorrowers(_this.authenticationContext, _this.loanViewModel).length > 1) {
                    return true;
                }
                return false;
            };
            //Opens the Success Modal Popup with the Appraisal Thank You Message displayed.
            this.openSuccessController = function () {
                var templateURL = '/angular/consumer/docusign/esigning/confirmation/success.appraisal.html';
                _this.successController.openSuccessPopUp(templateURL);
            };
            console.log(this.loanViewModel);
            //this.successController = this.$controller('SuccessController');
            this.init();
        }
        AppraisalController.className = 'AppraisalController';
        AppraisalController.$inject = [
            'docusignSVC',
            'authenticationContext',
            'loanViewModel',
            '$controller',
        ];
        return AppraisalController;
    })();
    docusign.AppraisalController = AppraisalController;
    angular.module('docusign').controller('AppraisalController', AppraisalController);
})(docusign || (docusign = {}));
//# sourceMappingURL=appraisal.controller.js.map