(function () {
    'use strict';

    var enums = {
        AddressTypes: {
            Default: 0,
            Present: 1,
            Former: 2,
            Mailing: 3,
            Billing: 4,
            GovernmentMonitoring: 5,
            RealEstate: 6
        },
        DebtsAccountOwnershipType:
        {
            Borrower: 0,
            CoBorrower: 1,
            Joint: 2,
            BorrowerWithOther: 3,
            CoBorrowerWithOther: 4
        },
        employmentStatus: {
            none: 0,
            current: 1,
            previous: 2
        },
        employmentType: {
            activeMilitaryDuty: 0,
            salariedEmployee: 1,
            selfEmployed: 2,
            retired: 3,
            otherUnemployed: 4,
        },
        IncomeTotals: {
            CurrentBorrower: 0,
            AdditionalBorrower: 1,
            CurrentCoBorrower: 2,
            AdditionalCoBorrower: 3,
            Other: 4,
        },
        incomeTypeEnum: {
            baseEmploymentIncome: 0,
            militaryBasePay: 11,
            partTime: 13,
            selfEmployedIncome: 16
        },
        LoanApplicationTabs: {
            Personal: "Personal",
            Property: "Property",
            Assets: "Assets",
            Credit: "Credit",
            Declarations: "Declarations",
            Income: "Income"
        },
        DocumentsTabs: {
            NeedsList: "NeedsList",
            DocVault: "DocVault"
        },
        LoanTransactionTypes: {
            None: 0,
            Purchase: 1,
            Refinance: 2
        },
        MiscellaneousDebtTypes: {
            ChildCareExpensesForVALoansOnly: 1,
            Expenses2106FromTaxReturns: 2
        },
        OccupancyTypes: {
            PrimaryResidence: "1",
            InvestmentProperty: "2",
            SecondVacationHome: "3"
        },
        PledgedAssetComment: {
            DoNotPayoff: 0,
            PaidOffFreeAndClear: 1,
            PayoffAtClose: 2,
            PayoffAtClosingAndDontCloseAccount: 3,
            PayoffAtClosingAndCloseAccount: 4,
            Sold: 5,
            NotMyLoan: 6,
            PendingSale: 7,
            NotAMortgage: 8
        },
        PledgedAssetLoanType: {
            None: 0,
            Fixed: 1,
            Heloc: 2
        },
        preferredPaymentPeriods: {
            none: 0,
            monthly: 1,
            annual: 2
        },
        pricingAdjustmentSectionType: {
            enterprise: 1,
            lOPrice: 2,
            finalPrice: 3,
           
        },
        ContextualTypes: {
            None: 0,
            LoanApplication: 1,
            LoanDetails: 2,
            CostDetails: 3,
            LoanScenario: 4,
            DocVault: 5,
            Aus: 6,
            PricingResults: 7,
            ComplianceEase: 8,
            Conditions: 9,
            LockingPricing : 10,
            MessageCenter: 11,
            Queue: 12,
            ComplianceCenter: 13,
            PreApprovalLetters: 14,
            Appraisal: 15,
            Documents: 16,
            ShopForRates: 17,
            MailRoomWorkbench: 18,
            FhaCenter: 19,
            VaCenter: 20,
            NetTangibleBenefit: 21,
            Integrations: 22,
            USDACenter: 23
        },
        iconColors: {
            active: "#1fb25a", 
            expired: "#E73302", 
            add: "#208DDC", 
            del: "#DD3131", 
            disabled: "#797979"
        },
        LiabilitiesDebtComment: {
            Agree: 0,
            Disagree: 1,
            PaidOff: 3,
            PayoffAtClose: 4,
            AcctNotMine: 5,
            Duplicate: 6,
            NotMyLoan: 7,
            SomeoneElsePays: 8
        },
        DebtComment: {
            Agree: 0,
            Disagree: 1,
            PaidOff: 3,
            PayoffAtClose: 4,
            Duplicate: 5
        },
        PaidBy: {
            LenderRebate: 5
        },
        CostContainer: {
            LoanCosts: 1,
            OtherCosts: 2,
            LenderCredits: 3
        },
        BankStatementsIncomeType: {
            NA: 0,
            Months6:1,
            Months12:2,
            Months24:3
        },
        AusType: {
            DU: 1,
            LP: 2,
            InvestorAUS: 3,
            ManualTraditional: 4,
            GUS: 5
        },
        AmortizationType: {
            None: 0,
            Fixed: 1,
            ARM: 2,
            GPM: 3,
            Other: 4
        },
        MortageType: {
            Conventional: 0,
            FHA: 1,
            ConventionalJumbo: 2,
            ConventionalSuperJumbo: 3,
            VA: 4,
            USDA: 5
        },
        uploadedFileStatus: {
            none: 0,
            uploaded: 1,
            inReview: 2,
            received: 3,
            faxed: 4,
            removed: 5,
            rejected: 6,
            needed: 7,
            exported: 8,
            exportFailed: 9,
            delivered: 10,
            signed: 11,
            sent: 12,
            pending: 13,
            submitted: 14
        },
        DocumentContentType: {
            Unknown: "",
            pdf: "pdf",
            doc: "doc",
            docx: "docx",
            xls: "xls",
            xlsx: "xlsx",
            jpg: "jpg",
            xml: "xml",
            zip: "zip",
            txt: "txt",
            png: "png",
            gif: "gif",
            html: "html",
            tif: "tif",
            rtf: "rtf",
            rar : "rar"
        },
        creditReportStatus: {
            undefined: 0,
            retrieving: 1,
            retrieved: 2,
            error: 3
        },
        myListQueue: {
            openLoans: 1,
            closedLoans: 2,
            cancelledLoans: 3,
            prospects: 4,
            unsubmitted: 5,
            registered: 6,
            submitted: 7,
            opening: 8,
            preApproval: 9,
            approved: 10,
            docsOut: 11,
            funding: 12,
            mailRoom: 13,
            pendingEConsent: 14,
            orderRequested: 15,
            orderProcessed: 16,
            delivered: 17,
            exceptions: 18,
            incomplete: 19,
            adverse: 20,
            processing: 21,
            pendingDisclosures: 22
        },
        userRoles: {
            loanOfficer: 'Loan Officer',
            secondary: 'Secondary',
            lockDesk: 'Lock Desk',
            administrator: 'Administrator'
        },
        accountOptions: {
            jointWithBorrower: 1,
            separateFromBorrower: 2
        },
        lookupAccountOptions: {
            jointWithBorrower: "Joint with Borrower",
            separateFromBorrower: "Separate from Borrower"
        },
        timeInterval: {
            years: "years",
            months: "months",
            weeks: "weeks",
            days: "days",
            hours: "hours",
            minutes: "minutes",
            seconds: "seconds",
        },
        CostTypeEnum: {
            EstimatedLenderCosts : 0,
            EstimatedThirdPartyCosts : 1,
            Prepaids : 2,
            EstimatedReservesDepositedwithLender : 3,
        },
        costPaymentTypes: {
            borrowerPaid: "borrowerPaid",
            sellerPaid: "sellerPaid",
            otherPaid: "otherPaid"
        },
        costPaidWhenTypes: {
            atClosing: "atClosing",
            beforeClosing: "beforeClosing"
        },
        disclosureStatus: {
            NotNeeded: 1,
            InitialDisclosureRequired: 2,
            ReDisclosureRequired: 3,
            RequestInProgress: 4,
            DisclosuresCreated: 5
        },
        contextualBarDropDownTypes :{
            milestoneStatus: 0,
            leadStatus: 1
        },
        requestDisclosureAction: {
            SaveLoanAplication: 1,
            ComplianceCheck: 2,
            CreateGFE: 3,
            CreateTRID: 4,
            CreateGFELock: 5,
            CreateTRIDLock: 6
        },
        requestExportToEncompassAction: {
            ExportToEncompass: 1,
            UpdateEncompass: 2,
            UpdateiMP: 3
        },
        milestoneStatus: {
            prospect: 1,
            incomplete: 2,
            processing: 3,
            preApproved: 4,
            approved: 5,
            docsOut: 6,
            funded: 8,
            cancelled: 9,
            unsubmitted: 10,
            registered: 11,   
            submitted: 12,
            rejected: 13,
            adverse: 14,
            appCompleted: 15
        },
        privileges: {
            AUSEditCaseKeyID: "AUS - Edit Case/Key ID",
            AUSInitiateintegration: "AUS - Initiate integration",
            AUSViewtab: "AUS - View tab",
            AccesstoActivities: "Access to Activities",
            AddNewBorrowerPair: "Add New Borrower Pair",
            AppraisedValue: "Appraised Value",
            BranchManagerTaskFilter: "Branch Manager Task Filter",
            CanEditEscrowsPeriodPayments: "Can Edit Escrows Period Payments",
            ChangeClosingDate: "Change Closing Date",
            ChangeLoanNumber: "Change Loan Number",
            ClosingCostsR: "Closing Costs - Read Only",
            ClosingCostsRW: "Closing Costs - Read Write",
            ConcessionLOPrice: "Concession LO Price",
            ConditionsChangeItemStatus: "Conditions - Change Item Status",
            ConditionsDelete: "Conditions - Delete",
            ConditionsViewTab: "Conditions - View Tab",
            CorporateMarginEnterprise: "Corporate Margin Enterprise",
            CreateTask: "Create Task",
            DisplayAppraisalQueues: "Display Appraisal Queues",
            DivisionMarginEnterprise: "Division Margin Enterprise",
            DocVaultViewTab: "DocVault - View Tab",
            EditEventTrigger: "Edit Event Trigger",
            EditLoanApplicationDate: "Edit Loan Application Date",
            EnableManageAppraisal: "Enable Manage Appraisal",
            EnableSubmitAppraisalOrder: "Enable Submit Appraisal Order",
            EnableSubmittoLenderX: "Enable Submit to LenderX",
            ExcessPricingEnterprise: "Excess Pricing Enterprise",
            ExcessPricingFinalPrice: "Excess Pricing Final Price",
            ExcessPricingLOPrice: "Excess Pricing LO Price",
            ExportCreditReport: "Export Credit Report",
            ExtensionEnterprise: "Extension Enterprise",
            ExtensionFinalPrice: "Extension Final Price",
            ExtensionLOPrice: "Extension LO Price",
            ImportLoan: "Import Loan",
            IntegrationServices: "Integration Services",
            IssuePreApprovalLetter: "Issue PreApproval Letter",
            LLPALOPrice: "LLPA LO Price",
            LoanApplicationChanges: "Loan Application Changes",
            LoanCenter: "Loan Center",
            LoanOfficerCompensationEnterprise: "Loan Officer Compensation Enterprise",
            LoanRequestTestingTool: "Loan Request Testing Tool",
            LoanServicesTabRetryAction: "Loan Services Tab Retry Action",
            LoanServicesTabView: "Loan Services Tab View",
            LockFee: "Lock Fee",            
            MailRoomQueue: "Mail Room Queue",
            MailroomWorkbench: "Mailroom Workbench",
            ManagingQueues: "Managing Queues",
            ModifyIntentToProceed: "Modify Intent To Proceed",
            ModifyMilestone: "Modify Milestone",
            Modifyandchange: "Modify and change",
            ObtainingLoanApplicationinformation: "Obtaining Loan Application information",
            PermissionToChangeRates: "Permission To Change Rates",
            Permissionforpricingloan: "Permission for pricing loan",
            PricingAdjustmentsAllowed: "Pricing Adjustments Allowed",
            RemovingActivity: "Removing Activity",
            RenegotiationFinalPrice: "Renegotiation Final Price",
            RenegotiationLOPrice: "Renegotiation LO Price",
            ReviewPendingDisclosures: "Review Pending Disclosures",
            ReviewPreApprovalQueue: "Review PreApproval Queue",
            ShoppingCartTestingTools: "Shopping Cart Testing Tools",
            ShoppingCartTooltip: "Shopping Cart Tooltip",
            ShowAffinityConfiguration: "Show Affinity Configuration",
            StartanewProspect: "Start a new Prospect",
            SystemAdminALL: "SystemAdmin.ALL",
            SystemAdminBusinessAffiliatesALL: "SystemAdmin.BusinessAffiliates.ALL",
            SystemAdminBusinessAffiliatesParentProfiles: "SystemAdmin.BusinessAffiliates.ParentProfiles",
            SystemAdminBusinessAffiliatesProfiles: "SystemAdmin.BusinessAffiliates.Profiles",
            SystemAdminCompanyProfileALL: "SystemAdmin.CompanyProfile.ALL",
            SystemAdminConfigurationALL: "SystemAdmin.Configuration.ALL",
            SystemAdminContacts: "SystemAdmin.Contacts",
            SystemAdminDBLoggingALL: "SystemAdmin.DBLogging.ALL",
            SystemAdminDBLoggingLogData: "SystemAdmin.DBLogging.LogData",
            SystemAdminGeneralSettingALL: "SystemAdmin.GeneralSetting.ALL",
            SystemAdminIntegrationsAndVendorsALL: "SystemAdmin.IntegrationsAndVendors.ALL",
            SystemAdminIntegrationsAndVendorsAppraisalFee: "SystemAdmin.IntegrationsAndVendors.AppraisalFee",
            SystemAdminIntegrationsAndVendorsAppraisalProduct: "SystemAdmin.IntegrationsAndVendors.AppraisalProduct",
            SystemAdminUserAccountsALL: "SystemAdmin.UserAccounts.ALL",
            ViewAllLoans: "View All Loans",
            ViewAppraisalFormData: "ViewAppraisalFormData",
            ViewAppraisalLists: "View Appraisal Lists",
            ViewConciergeHome: "ViewConciergeHome",
            ViewEventTriggers: "View Event Triggers",
            ViewInitiateTestEventCommand: "View Initiate Test Event Command",
            ViewStandardList: "View Standard Lists",
            ViewDisclosuresList: "View Disclosures List",
            ViewLoanCenter30: "View Loan Center 3.0",
            ViewPipeline: "View Pipeline",
            ViewQueuesFilter: "View Queues Filter",
            ViewSystemAdmin: "ViewSystemAdmin",
            ViewTaskDetails: "View Task Details",
            ViewUnmaskedCreditCard: "View Unmasked Credit Card",
            WorstCasePricingFinalPrice: "Worst-Case Pricing Final Price",
            WorstCasePricingLOPrice: "Worst-Case Pricing LO Price",
            ViewOptimalBlueXML: "View Optimal Blue XML",
            SubmitLock: "Submit Lock",
            AcceptLock: "Accept Lock",
            EditLoanAssignments: "Edit Loan Assignments",
            ConcessionLevel1: "Concession Level 1",
            ConcessionLevel2: "Concession Level 2",
            ConcessionLevel3: "Concession Level 3",
            ConcessionLevel4: "Concession Level 4",
            ConcessionLevel5: "Concession Level 5"
        },
        housingExpenses: {
            homeOwnerExpense: 1,
            floodInsuranceExpense: 2,
            mortgageInsuranceExpense: 3,
            propertyTaxExpense: 4,
            HOAExpense: 5
        },
        certificationId: {
		    selectOne: 0,
		    validStateDriverLicense: 1,
		    validStateIdentificationCard: 2,
		    militaryIdentificationCard: 3,
		    militaryDependentsPhotoID: 4,
		    uSPassport: 5,
		    nonUSPassport: 6,
		    residentAlienCard: 7,
		    departmentOfPublicWelfarePhotoID: 8,
		    studentPhotoID: 9,
		    workIDWithPhoto: 10,
		    medicareCard: 11,
		    customerIDValidationCheck: 12,
		    closingCertification: 13,
		    other: 14
        },
        loanOriginatorSource: {
            faceToFaceInterview: 0
        }
    };

    var modalWindowType = {
        loader: 0,
        error: 1,
        success: 2,
        unsuccess: 3,
        confirmation: 4
    };
    var discloseActions = [
        { name: 'Save Loan Application', value: 1 },
        { name: 'Run Compliance Check', value: 2 },
        //{ name: 'Create GFE Disclosures', value: 3 },
        { name: 'Create Initial Disclosures', value: 4 },
        //{ name: "Create GFE Lock Disclosures", value: 5 },
        { name: "Create Initial Lock Disclosures", value: 6 }
    ];

    var exportToEncompassActions = [
        { name: 'Export to Encompass', value: 1, disabled: false },
        { name: 'Update Encompass', value: 2, disabled: false },
        { name: "Update iMP", value: 3, disabled: false }
    ];

    var lockingActions = [
        { name: 'Save Only', saveAction: true, value: 1 },

       // { name: 'Submit Registration Request', userPrivilege: enums.privileges.SubmitLock, value: 2 },
        { name: 'Submit Lock Request', userPrivilege: enums.privileges.SubmitLock, value: 3 },
       // { name: 'Submit Change Request', userPrivilege: enums.privileges.SubmitLock, value: 4 },
       // { name: 'Submit Lock Cancellation', userPrivilege: enums.privileges.SubmitLock, value: 5 },
       // { name: 'Cancel Request', userPrivilege: enums.privileges.SubmitLock, value: 6 },

       // { name: 'Accept Registration Request', userPrivilege: enums.privileges.AcceptLock, value: 7 },
        { name: 'Accept Lock Request', userPrivilege: enums.privileges.AcceptLock, value: 8 },
        { name: 'Deny Lock', userPrivilege: enums.privileges.AcceptLock, value: 9 }
       // { name: 'Accept Change Request', userPrivilege: enums.privileges.AcceptLock, value: 10 },
       // { name: 'Accept Lock Cancellation', userPrivilege: enums.privileges.AcceptLock, value: 11 }
    ];
    angular.module('util')
        .constant('enums', enums)
        .constant('modalWindowType', modalWindowType)
        .constant('guidEmpty', '00000000-0000-0000-0000-000000000000')
        .constant('discloseActions', discloseActions)
        .constant('exportToEncompassActions', exportToEncompassActions)
        .constant('lockingActions', lockingActions);
    //.constant('pi', 3.14);

})();
