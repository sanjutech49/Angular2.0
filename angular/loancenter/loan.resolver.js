(function () {
    'use strict';

    angular.module('loanCenter')
        .provider('loanResolver', loanResolver);

    function loanResolver() {
        this.$get = function () {
            return resolver;
        };

        function resolver(loanService, $filter, $stateParams, HttpUIStatusService, BroadcastSvc, LoanCalculator, applicationData, commonModalWindowFactory, modalWindowType, $modalStack, $modal, digitaldocSvc, encompassSvc, NavigationSvc, costDetailsHelpers) {

            console.log('loading loan: ' + $stateParams.loanId ? $stateParams.loanId : '(new)');

            return HttpUIStatusService.load('Loading Loan...', function (happyPath, unhappyPath) {
                return loanService.loan().get({ loanId: $stateParams.loanId, userAccountId: applicationData.currentUserId }).$promise.then(happyPath, unhappyPath);
            }, function (loan) {

                // this should be passed into the service, but what else is new?...
                if (loan && $stateParams.loanPurposeType)
                    loan.loanPurposeType = $stateParams.loanPurposeType;

                var wrappedLoan = new lib.referenceWrapper(new cls.LoanViewModel(loan, $filter, applicationData.currentUser.isWholesale));             
                console.log('loan successfully created = ' + ($stateParams.loanId ? $stateParams.loanId : '(new)'));
                if (!$stateParams.loanId || !loan.loanPurposeType)
                {
                    wrappedLoan.ref.isNewProspectSaved = false;
                    populateDefaultValues($stateParams, wrappedLoan, applicationData);
                }
                $stateParams.loanId = wrappedLoan.ref.loanId;
                NavigationSvc.lastRepricing.timestamp = 0;
                loanService.wrappedLoan = wrappedLoan;

                costDetailsHelpers.initializeCostService(wrappedLoan, applicationData);
                costDetailsHelpers.getCostDetailsData();

                BroadcastSvc.broadcastLoanChanged(wrappedLoan, applicationData);
                LoanCalculator.bindToCalculator(wrappedLoan, applicationData);

                // Control Acquired?
                // If you want to enforce control you must give me the status
                if (!wrappedLoan.ref.controlStatus) {
                    wrappedLoan.ref.controlStatus = {
                        isAcquired: true,
                    };
                }
                wrappedLoan.canSave = function () {
                    return wrappedLoan.ref.controlStatus.isAcquired;
                }
                if (!wrappedLoan.ref.controlStatus.isAcquired) {
                    wrappedLoan.ref.controlStatus.lockAcquiredAtStr = new Date(wrappedLoan.ref.controlStatus.lockAcquiredAt).toLocaleTimeString("en-us");
                }

                return wrappedLoan;
            }, function (error) {
                console.log('loan load failure: ' + $stateParams.loanId + ' ' + error);
            }, $stateParams.loanId != null);

        }

        function populateDefaultValues($stateParams, wrappedLoan, applicationData) {
            wrappedLoan.ref.loanNumber = 'Pending';
            if ($stateParams.loanPurposeType)
                wrappedLoan.ref.loanPurposeType = $stateParams.loanPurposeType;
            else
                if (!wrappedLoan.ref.loanPurposeType)
                    wrappedLoan.ref.loanPurposeType = 2;
            wrappedLoan.ref.status = 2; //InProgress
            wrappedLoan.ref.companyId = applicationData.companyProfile.companyProfileId;
            wrappedLoan.ref.channelId = applicationData.currentUser.channelId && applicationData.currentUser.channelId != -1 ? applicationData.currentUser.channelId : null;
            wrappedLoan.ref.isWholeSale = applicationData.currentUser.isWholesale;
            wrappedLoan.ref.divisionId = applicationData.currentUser.divisionId && applicationData.currentUser.divisionId != -1 ? applicationData.currentUser.divisionId : null;
            wrappedLoan.ref.branchId = applicationData.currentUser.branchId;
            if (!wrappedLoan.ref.currentMilestone) { 
                if (wrappedLoan.ref.isWholeSale)
                    wrappedLoan.ref.currentMilestone = srv.milestoneStatus.unsubmitted;
                else
                    wrappedLoan.ref.currentMilestone = srv.milestoneStatus.prospect;
            }
            //default home buying type on get started to GetPreApproved for purchase loans
            if (wrappedLoan.ref.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase) {                
                wrappedLoan.ref.homeBuyingType = srv.HomeBuyingType.GetPreApproved;
                wrappedLoan.ref.getSubjectProperty().streetName = 'TBD';
            }

            if (applicationData.currentUser.isInRole('Concierge') || applicationData.currentUser.isInRole('Loan Officer')) {
                wrappedLoan.ref.conciergeId = applicationData.currentUser.userAccountId;
                wrappedLoan.ref.conciergeFullName = applicationData.currentUser.fullName;
                wrappedLoan.ref.loaId = applicationData.currentUser.loaId;
                wrappedLoan.ref.callCenterId = applicationData.currentUser.loanProcessorId;
                wrappedLoan.ref.salesManagerId = applicationData.currentUser.salesManagerId;
                wrappedLoan.ref.teamLeaderId = applicationData.currentUser.teamLeaderId;
            }

            if (!wrappedLoan.ref.closingDate) {
                wrappedLoan.ref.closingDate = new srv.cls.LoanDateViewModel();
            }
            wrappedLoan.ref.closingDate.dateValue = moment().add(30, 'days').format("YYYY-MM-DDTHH:mm:ss");
        }
    }
})();