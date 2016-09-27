var loanCenter;
(function (loanCenter) {
    'use strict';
    var Personal = (function () {
        function Personal() {
            this.concatenateFullName = function (firstName, middleName, lastName) { return concatenateFullName(firstName, middleName, lastName); };
            this.getBorrowerAndCoBorrowerNames = function (borrower, coBorrower, isSpouseOnTheLoan, isSpouseOnTheTitle, nameOfPartner) { return getBorrowerAndCoBorrowerNames(borrower, coBorrower, isSpouseOnTheLoan, isSpouseOnTheTitle, nameOfPartner); };
            this.showNamesAndManner = function (loanApplication) { return showNamesAndManner(loanApplication); };
            this.onTitleHeldInChange = function (loanApplication) { return onTitleHeldInChange(loanApplication); };
            this.onConfirmEmailBlur = function (model) {
                var areEmailsValid = !model.invalidEmails;
                if (areEmailsValid && model.isEmailChanged) {
                    model.sendActivationEmail = true;
                }
            };
            this.onEmailBlur = function (model, isSpouseOnTheLoan, loanId, loanUserAccountIdBorrower, loanUserAccountIdCoBorrower) {
                var coBorrowerNoAccount;
                if (!isSpouseOnTheLoan) {
                    coBorrowerNoAccount = true;
                }
                else {
                    coBorrowerNoAccount = loanUserAccountIdBorrower <= 0;
                }
                if (model.username === model.originalUsername || (loanUserAccountIdCoBorrower <= 0 && coBorrowerNoAccount)) {
                    model.usernameTaken = false;
                    return;
                }
                var areEmailsValid = !model.invalidEmails;
                //this.manageAccountSvc.isUsernameAvailable(model.username, loanId).then((response: any) => {
                //    var isEmailAvailable = response.data;
                //    model.usernameTaken = !isEmailAvailable;
                //    model.emailFieldDisabled = model.isOnlineUser && model.username.trim() !== '';
                //    if (areEmailsValid && model.isEmailChanged) {
                //        model.sendActivationEmail = true;
                //    }
                //});
            };
        }
        Personal.$inject = [];
        return Personal;
    })();
    angular.module('loanCenter').service('personalUtilities', Personal);
    //concatenate full name from first, last and middle name
    function concatenateFullName(firstName, middleName, lastName) {
        var fullName = '';
        if (firstName != null && firstName != "") {
            fullName += firstName + " ";
        }
        if (middleName != null && middleName != "") {
            fullName += middleName + " ";
        }
        if (lastName != null && lastName != "") {
            fullName += lastName;
        }
        else {
            fullName = fullName.substring(0, fullName.length - 1);
        }
        return fullName;
    }
    //get title for borrower and co-borrower based on whether spouse on the loan is selected and/or on the title
    function getBorrowerAndCoBorrowerNames(borrower, coBorrower, isSpouseOnTheLoan, isSpouseOnTheTitle, nameOfPartner) {
        var borrowerName = '';
        var coBorrowerName = '';
        var titleResult = '';
        //set borrower full name
        if (borrower) {
            borrowerName = concatenateFullName(borrower.firstName, borrower.middleName, borrower.lastName);
        }
        //set co-borrower full name
        if (coBorrower) {
            coBorrowerName = concatenateFullName(coBorrower.firstName, coBorrower.middleName, coBorrower.lastName);
        }
        if (borrowerName != '') {
            titleResult = borrowerName;
        }
        if (isSpouseOnTheLoan) {
            if (borrowerName != '' && coBorrowerName != '') {
                titleResult += ", " + coBorrowerName;
            }
            else if (coBorrowerName != '') {
                titleResult = coBorrowerName;
            }
        }
        else {
            //check if is spouse on the title is selected
            if (isSpouseOnTheTitle) {
                if (nameOfPartner != null && nameOfPartner != "") {
                    if (borrowerName != '') {
                        titleResult += ", " + nameOfPartner;
                    }
                    else {
                        titleResult = nameOfPartner;
                    }
                }
            }
        }
        return titleResult;
    }
    //show names and manner in the title info section
    function showNamesAndManner(loanApplication) {
        var showNamesAndManner = false;
        if (!loanApplication.titleInfo)
            return;
        if (loanApplication.titleInfo.titleHeldIn == 0) {
            showNamesAndManner = true;
            loanApplication.titleInfo.namesOnTitle = getBorrowerAndCoBorrowerNames(loanApplication.getBorrower(), loanApplication.getCoBorrower(), loanApplication.isSpouseOnTheLoan, loanApplication.isSpouseOnTheTitle, loanApplication.titleInfo.nameOfPartner);
        }
        else {
            loanApplication.titleInfo.namesOnTitle = "";
        }
        return showNamesAndManner;
    }
    //when title held in changes, change manner title
    function onTitleHeldInChange(loanApplication) {
        var namesAndMannner = showNamesAndManner(loanApplication);
        if (!loanApplication.getBorrower() || !loanApplication.titleInfo)
            return;
        switch (loanApplication.getBorrower().maritalStatus.toString()) {
            case '0':
                loanApplication.titleInfo.mannerTitleHeld = '1';
                break;
            case '2':
                loanApplication.titleInfo.mannerTitleHeld = '6';
                break;
            case '1':
            default:
                loanApplication.titleInfo.mannerTitleHeld = '9'; //Default value is "To Be Decided in Escrow"
                break;
        }
        return namesAndMannner;
    }
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=personal.js.map