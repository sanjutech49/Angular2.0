/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/global/global.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../ts/extendedViewModels/loanApplication.extendedViewModel.ts" />
/// <reference path="../ts/extendedViewModels/borrower.extendedViewModel.ts" />
/// <reference path="../ts/extendedViewModels/address.extendedViewModel.ts" />
/// <reference path="../ts/extendedViewModels/Asset.extendedViewModel.ts" />
/// <reference path="../ts/extendedViewModels/property.extendedViewModel.ts" />

module loanCenter {

    export class LoanWrapperService {

        static $inject = ['loanService', '$filter'];
        static className = 'LoanWrapperService';

        constructor(private loanService, private $filter) {
        }

        // todo: this code is not well thought out and needs to be refactored
        createLoan = (loan: srv.ILoanViewModel): cls.LoanViewModel => {

            var loanClass = new cls.LoanViewModel(loan, this.$filter);

            //var loanApplication = new cls.LoanApplicationViewModel();

            //loanApplication.borrower = new cls.BorrowerViewModel();
            //loanApplication.borrower.currentAddress.address = new cls.AddressViewModel();
            //loanApplication.borrower.previousAddress.address = new cls.AddressViewModel();
            //loanApplication.borrower.mailingAddress.address = new cls.AddressViewModel();

            //loanApplication.borrower.userAccount = new cls.UserAccountViewModel();
            //loanApplication.isPrimary = true;

            //loanApplication.isCoBorrowerSectionShown = false;
            //loanApplication.isSpouseOnTheLoanSelected = false;
            //loanApplication.isSpouseOnTheLoan = false;

            //loanClass.loanApplications = [loanApplication];

            ////Initialize SubjectProperty
            //loanClass.subjectProperty = new cls.PropertyViewModel(loan.subjectProperty);

            //// Get the active loan application.
            //loanClass.active = loan.loanApplications[0];

            //// Get the primary loan.
            //loanClass.primary = loan.loanApplications[0];

            //loanClass.loanPurposeType = 2;

            return loanClass;
        }

        // todo: this code is not well thought out and needs to be refactored
        wrapLoan = (loan: srv.ILoanViewModel): cls.LoanViewModel => {

            var loanClass = new cls.LoanViewModel(loan, this.$filter);

            //var loanApplications = [];
            //for (var i = 0; i < loan.loanApplications.length; i++) {
            //    var loanApplication = new cls.LoanApplicationViewModel(loan.loanApplications[i]);
            //    loanApplication.borrower = new cls.BorrowerViewModel(loanApplication.borrower);
            //    loanApplication.borrower.currentAddress = new cls.BorrowerAddressViewModel(loanApplication.borrower.currentAddress);
            //    loanApplication.borrower.currentAddress.address = new cls.AddressViewModel(loanApplication.borrower.currentAddress.address);
            //    loanApplication.borrower.previousAddress.address = new cls.AddressViewModel(loanApplication.borrower.previousAddress.address);
            //    loanApplication.borrower.mailingAddress.address = new cls.AddressViewModel(loanApplication.borrower.mailingAddress.address);

            //    var incomeInfo = [];
            //    for (var i = 0; i < loanApplication.borrower.incomeInfo.length; i++) {
            //        var income = new cls.IncomeInfoViewModel(loanApplication.borrower.incomeInfo[i]);
            //        incomeInfo.push(income);
            //    }
            //    loanApplication.borrower.incomeInfo = incomeInfo;
            //    loanApplication.borrower.userAccount = new cls.UserAccountViewModel(loanApplication.borrower.userAccount);
            //    loanApplication.borrower.userAccount.originalUsername = loanApplication.borrower.userAccount.username;

            //    var assets = [];
            //    var liabilities = [];
            //    if (loanApplication.borrower.assets.length > 0) {
            //        for (var key in loanApplication.borrower.assets) {
            //            var asset = new cls.AssetViewModel(loanApplication.borrower.assets[key]);
            //            asset.borrowerFullName = loanApplication.borrower.fullName;
            //            assets.push(asset);
            //        }
            //        loanApplication.borrower.assets = assets;
            //    }
            //    if (loanApplication.borrower.liabilities.length > 0) {
            //        for (var key in loanApplication.borrower.liabilities) {
            //            var liability = new cls.LiabilityViewModel(loanApplication.borrower.liabilities[key]);
            //            liability.borrowerFullName = loanApplication.borrower.fullName;
            //            liabilities.push(liability);
            //        }
            //        loanApplication.borrower.liabilities = liabilities;
            //    }

            //    if (loanApplication.coBorrower) {
            //        loanApplication.coBorrower = new cls.BorrowerViewModel(loanApplication.coBorrower);
            //        loanApplication.coBorrower.currentAddress.address = new cls.AddressViewModel(loanApplication.coBorrower.currentAddress.address);
            //        loanApplication.coBorrower.previousAddress.address = new cls.AddressViewModel(loanApplication.coBorrower.previousAddress.address);
            //        loanApplication.coBorrower.mailingAddress.address = new cls.AddressViewModel(loanApplication.coBorrower.mailingAddress.address);
            //        var incomeInfo = [];
            //        for (var i = 0; i < loanApplication.coBorrower.incomeInfo.length; i++) {
            //            var income = new cls.IncomeInfoViewModel(loanApplication.coBorrower.incomeInfo[i]);
            //            incomeInfo.push(income);
            //        }
            //        loanApplication.coBorrower.incomeInfo = incomeInfo;

            //        loanApplication.coBorrower.userAccount = new cls.UserAccountViewModel(loanApplication.coBorrower.userAccount);

            //        var assets = [];
            //        var liabilities = [];
            //        if (loanApplication.coBorrower.assets.length > 0) {
            //            for (var key in loanApplication.coBorrower.assets) {
            //                var asset = new cls.AssetViewModel(loanApplication.coBorrower.assets[key]);
            //                asset.borrowerFullName = loanApplication.coBorrower.fullName;
            //                assets.push(asset);
            //            }
            //            loanApplication.coBorrower.assets = assets;
            //        }

            //        if (loanApplication.coBorrower.liabilities.length > 0) {
            //            for (var key in loanApplication.coBorrower.liabilities) {
            //                var liability = new cls.LiabilityViewModel(loanApplication.coBorrower.liabilities[key]);
            //                liability.borrowerFullName = loanApplication.coBorrower.fullName;
            //                liabilities.push(liability);
            //            }
            //            loanApplication.coBorrower.liabilities = liabilities;
            //        }

            //    }

            //    for (var i = 0; i < loanApplication.realEstate.pledgedAssets.length; i++) {
            //        loanApplication.realEstate.pledgedAssets[i].property = new cls.PropertyViewModel(loanApplication.realEstate.pledgedAssets[i].property, 0);
            //    }

            //    loanApplications.push(loanApplication);
            //}
            //loanClass.loanApplications = loanApplications;

            ////Initialize SubjectProperty
            //loanClass.subjectProperty = new cls.PropertyViewModel(loan.subjectProperty, loan.homeBuyingType);


            //// temp

            //// Get the active loan application.
            //loanClass.active = this.loanService.getActiveLoanApplication(loan);

            //// Get the primary loan.
            //loanClass.primary = this.loanService.getPrimaryLoan(loan);

            return loanClass;
        }
    }
}

moduleRegistration.registerService(moduleNames.services, loanCenter.LoanWrapperService);

