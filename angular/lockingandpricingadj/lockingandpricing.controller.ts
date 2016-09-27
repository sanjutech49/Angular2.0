module lockingandpricingadj {

    // todo - rewrite this class to the TypeScript standards implemented by the document and is used throughout the entire application. 'vm' is not required and needs to be removed.
    export class lockingandpricingController {


        static className = "lockingandpricingController";
        pricingLockingModel: srv.IPricingAdjustmentsViewModel;
        investorPricingModel: srv.IPricingAdjustmentsViewModel;
        loanOfficerModel: srv.IPricingAdjustmentsViewModel;
        investorBasePurchaseModel: srv.IPricingAdjustmentsViewModel;
        lookups: srv.cls.LockingPricingLookupViewModel;
        savingDataInProgress: boolean;
        navigationSvc: any;
        filter: any;
        state: any;
        lockingPricingSvc: any;
        displaySellSide: boolean;
        displayPricingInfoEditButton: boolean;
        displayEnterpriseSection: boolean;
        displayInvestorPurchasePrice: boolean;
        displayLOSection: boolean;
        displayOptimalBlueXML: boolean;
        isLO: boolean;
        contextualMenuClass: string;
        totalAmountValue: number;
        rateAndPriceEditDisabled: boolean = true;
        loanLockStatus: String;
        currentUserRole: String;
        lockingAction: any;
        userHasConcessionPrivileges: boolean = false; // Check if user has privileges (if does not have privilege, it shouldn't have deny option as well)
        maxConcessionApproveRate: number; // Max Allowed Approve Rate set in LockingConfiguration
        totalApprovedConcessionRates: number; // Total value of Approved Concession Rates
        totalNumberOfAddedConcessions: number; // Total number of concession (doesn't meter if approved,denied or requested)
        maxAllowedNumberOfConcession: number; // Max allowed number of concessions - LockingConfiguration (if number is not set or 0, concessions are unlimited)

        public static $inject = ['wrappedLoan',
                                 'enums',
                                 'modalPopoverFactory',
                                 'NavigationSvc',
                                 'pricingResultsSvc',
                                 '$filter',
                                 '$state',
                                 'simpleModalWindowFactory',
                                 'lockingPricingService',
                                 'applicationData',
                                 'loanEvent',
                                 'lockingActions'];

        constructor(private wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, public enums, private modalPopoverFactory: any, private NavigationSvc, private pricingResultsSvc, private $filter, private $state,
            private simpleModalWindowFactory, private lockingPricingService, private applicationData, private loanEvent, private lockingActions) {

            var vm = this;

            if (wrappedLoan) {

                vm.wrappedLoan = wrappedLoan;
                vm.enums = enums;

                vm.totalAmountValue = vm.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount;//wrappedLoan.getTotalLoanAmount(vm.wrappedLoan.ref); 
                wrappedLoan.ref.pricingAdjustments = new cls.PricingAdjustmentsViewModel(wrappedLoan.ref.pricingAdjustments);
                vm.pricingLockingModel = wrappedLoan.ref.pricingAdjustments;
                vm.loanLockStatus = vm.lockStatusDisplay();

                vm.investorPricingModel = this.filterPricingAdjustments(vm.wrappedLoan, enums.pricingAdjustmentSectionType.investor);
                vm.loanOfficerModel = this.filterPricingAdjustments(vm.wrappedLoan, enums.pricingAdjustmentSectionType.loanOfficer);
                vm.investorBasePurchaseModel = this.filterPricingAdjustments(vm.wrappedLoan, enums.pricingAdjustmentSectionType.investorBasePurchase);
                vm.pricingLockingModel.totalLoanPrice = vm.getTotalLoanOfficerAmount(vm.pricingLockingModel.adjustments);

                vm.pricingLockingModel.sellSideInformation.isDisabledSellSide = true;
                vm.pricingLockingModel.sellSideInformation.sellSideInvestorPurchasePrice = this.pricingLockingModel.investorPurchasePrice;

                vm.pricingLockingModel.investorPrice = 100 - vm.wrappedLoan.ref.financialInfo.adjustedPoints - vm.pricingLockingModel.totalLoanPrice;
                vm.getIntegrationItem = vm.getIntegrationItem;

                vm.currentUserRole;
                vm.contextualMenuClass = "dropdown-menu";
            }

            if (applicationData) {
                vm.lookups = applicationData.lockingPricingLookup;
                vm.applicationData = applicationData;
                vm.displaySellSide = false;
                vm.displayPricingInfoEditButton = false;
                vm.displayInvestorPurchasePrice = false;
                vm.displayEnterpriseSection = false;
                vm.displayLOSection = false;
                vm.displayOptimalBlueXML = false;
                vm.setVisibilityByRoles();
            }

            vm.wrappedLoan.ref.loanLock.armAdjustmentPeriod = this.modifyArmAdjustmentPeriod(vm.wrappedLoan.ref.loanLock.armAdjustmentPeriod);
            vm.lockingPricingSvc = lockingPricingService;
            vm.navigationSvc = NavigationSvc;
            vm.state = $state;
            vm.simpleModalWindowFactory = simpleModalWindowFactory;

            vm.lockingActions = lockingActions;
            //Until rest of PBI's are implemented default value for locking action button will be "Save Only"
            vm.lockingAction = lockingActions[0];
            //vm.getDefaultLockingAction();
            vm.maxAllowedNumberOfConcession = this.getMaxAllowedNumberOfPrivileges();

            vm.setClassesAndPermissionsByPrivilege();
            vm.totalApprovedConcessionRates = this.getTotalSumOfApprovedRates();
            vm.displayOptimalBlueXML = vm.applicationData.currentUser.hasPrivilege(vm.enums.privileges.ViewOptimalBlueXML);

            NavigationSvc.contextualType = enums.ContextualTypes.LockingPricing;
        }

        //getDefaultLockingAction = () : String => {
        //    var vm = this;

        //    for (var i = 0; i < vm.lockingActions.length; i++) {
        //        if (vm.currentUserRole == vm.enums.userRoles.loanOfficer && vm.lockingActions[i].userPrivilege == vm.enums.privileges.SubmitLock) {
        //            return vm.lockingAction = vm.lockingActions[i];
        //        }
        //        else if (vm.currentUserRole == vm.enums.userRoles.lockDesk && vm.lockingActions[i].userPrivilege == vm.enums.privileges.AcceptLock) {
        //            return vm.lockingAction = vm.lockingActions[i];
        //        }
        //    }
        //}
        
        /*
        *@Description - Return sum of all approved concession rates
        */
        getTotalSumOfApprovedRates = (): number =>
        {
            var sum = 0;
            this.pricingLockingModel.adjustments.forEach((adjustment) =>
            {
                if (adjustment.adjustmentSectionType == srv.LoanPricingAdjustmentTypeEnum.Sec2Concession &&
                    !adjustment.isDeleted && adjustment.description == "Approved")
                {
                    return sum += adjustment.rate;
                }
            });

            return sum;
        }

        /*
        *@Description - Get Max Allowed Number of concessions - LockingConfiguration table
        */
        getMaxAllowedNumberOfPrivileges = (): number =>
        {
            var maxNumberOfConcessions = 0;
            this.applicationData.lockingConfigurations.some((lockingConfig) =>
            {
                if (lockingConfig.lockingConfigurationKey == srv.LockingConfigurationEnum.MaxNumberOfConcessions)
                {
                    maxNumberOfConcessions = parseInt(lockingConfig.value);
                }
            });

            return maxNumberOfConcessions;
        }

        /*
        * @Description - Get total Number of LoanOfficer Concession
        */
        getTotalNumberOfLoApprovedConcessions = (): number =>
        {
            var numberOfLoConcessions = 0;
            this.pricingLockingModel.adjustments.forEach((adjustment) =>
            {
                if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Concession && !adjustment.isDeleted && adjustment.description == "Approved")
                {
                    numberOfLoConcessions++;
                }
            });

            return numberOfLoConcessions;
        }

        modifyArmAdjustmentPeriod = (armAdjustmentPeriod) => {
            if (!armAdjustmentPeriod) {
                return 12;
            }
            else {
                return armAdjustmentPeriod;
            }
        }

        lockStatusDisplay = () => {
            var vm = this;
            var lockStatus;

            for (var i = 0; i < vm.applicationData.lookup.lockStatus.length; i++) {
                if (vm.applicationData.lookup.lockStatus[i].value == vm.wrappedLoan.ref.lockingInformation.lockStatus) {
                    lockStatus = vm.applicationData.lookup.lockStatus[i].text;
                }
            }

            return lockStatus;
        }

        setVisibilityByRoles = () => {
            var vm = this;
            
            if (vm.applicationData.currentUser && vm.applicationData.currentUser.roles) {
                angular.forEach(vm.applicationData.currentUser.roles, function (role) {
                    if (role.roleName == vm.enums.userRoles.loanOfficer || role.roleName == vm.enums.userRoles.administrator) {
                        vm.displayEnterpriseSection = true;  
                        vm.isLO = true;
                        vm.currentUserRole = vm.enums.userRoles.loanOfficer;
                    }
                    if (role.roleName == vm.enums.userRoles.secondary || role.roleName == vm.enums.userRoles.administrator) {
                        vm.displayEnterpriseSection = true;
                        vm.displayLOSection = true;
                        vm.currentUserRole = vm.enums.userRoles.secondary;
                    }
                    if (role.roleName == vm.enums.userRoles.lockDesk || role.roleName == vm.enums.userRoles.administrator) {
                        vm.displaySellSide = true;
                        vm.displayPricingInfoEditButton = true;
                        vm.displayInvestorPurchasePrice = true;
                        vm.displayEnterpriseSection = true;
                        vm.displayLOSection = true;
                        vm.currentUserRole = vm.enums.userRoles.lockDesk;
                    }
                });
            }
        }

       setClassesAndPermissionsByPrivilege = () => {
            var vm = this;
            var maxValue = 0;
            var concessionPrivileges = [];

            if (vm.applicationData.currentUser && vm.applicationData.currentUser.privileges) {
                angular.forEach(vm.applicationData.currentUser.privileges, function (privilege) {
                    if (privilege.name == vm.enums.privileges.AcceptLock) {
                        vm.contextualMenuClass += " accept-lock";
                    }
                    if (privilege.name == vm.enums.privileges.SubmitLock) {
                        vm.contextualMenuClass += " submit-lock";
                    }

                    //LockingConfiguration
                    if (privilege.name == vm.enums.privileges.ConcessionLevel1){
                        concessionPrivileges.push(srv.LockingConfigurationEnum.MaxConcessionAmountLevel1)
                    } else if (privilege.name == vm.enums.privileges.ConcessionLevel2){
                        concessionPrivileges.push(srv.LockingConfigurationEnum.MaxConcessionAmountLevel2)
                    } else if (privilege.name == vm.enums.privileges.ConcessionLevel3){
                        concessionPrivileges.push(srv.LockingConfigurationEnum.MaxConcessionAmountLevel3)
                    } else if (privilege.name == vm.enums.privileges.ConcessionLevel4){
                        concessionPrivileges.push(srv.LockingConfigurationEnum.MaxConcessionAmountLevel4)
                    } else if (privilege.name == vm.enums.privileges.ConcessionLevel5){
                        concessionPrivileges.push(srv.LockingConfigurationEnum.MaxConcessionAmountLevel5)
                       
                    }
                });
            }

            if (concessionPrivileges.length > 0)
            {
                vm.userHasConcessionPrivileges = true;

                if (vm.applicationData.lockingConfigurations)
                {
                    angular.forEach(concessionPrivileges,(concessionPrivilege) =>
                    {
                        vm.applicationData.lockingConfigurations.forEach((lockingConfig) =>
                        {
                            var tempvalue = parseFloat(lockingConfig.value);
                            if (concessionPrivilege == lockingConfig.lockingConfigurationKey && tempvalue > maxValue)
                            {
                                maxValue = tempvalue;
                            }
                        });
                    });
                }
            }

            this.maxConcessionApproveRate = maxValue;
        }

        getTotalLoanOfficerAmount = (adjustments) =>
        {
            var total = 0;
            for (var i = 0; i < adjustments.length; i++){
                if (adjustments[i].adjustmentSectionType == this.enums.pricingAdjustmentSectionType.lOPrice && adjustments[i].isDeleted != true) {
                    total += parseFloat(adjustments[i].value);
                }
            }
            return total;
        }
        
        filterPricingAdjustments = (wrappedLoan, enumType) => {
            var vm = this;
            var pricing = new cls.PricingAdjustmentsViewModel(wrappedLoan.ref.pricingAdjustments);
           
            pricing.adjustments = _.filter(wrappedLoan.ref.pricingAdjustments.adjustments, function (adjustment: cls.AdjustmentsViewModel) {
                adjustment.totalLoanAmount = vm.totalAmountValue;                
                return adjustment.adjustmentSectionType === enumType;
            });

            pricing.defaultAdjustmentTypeId = 1;
            pricing.isDisabled = true;

            return pricing;
        }

        getInclude = () => {
            if (this.isLO && !this.displayLOSection) {
                return "angular/lockingandpricingadj/loprice.html";
            }
            else if (this.displayEnterpriseSection)
                    return "angular/lockingandpricingadj/investorprice.html";
            else return null;    
        }

        loFilter = (item) => {
            return item.isEditable;
        }        

        setSellSideInvestorPurchasePrice = () => {
            this.pricingLockingModel.sellSideInformation.sellSideInvestorPurchasePrice = this.pricingLockingModel.investorPurchasePrice;
        }

        enableSellSide = () => {
            if (this.pricingLockingModel.sellSideInformation.isDisabledSellSide) {
                this.pricingLockingModel.sellSideInformation.isDisabledSellSide = false;
            }
        }

        enableRateAndPriceEdit = () => {
            if (this.rateAndPriceEditDisabled) {
                this.rateAndPriceEditDisabled = false;
            }
            }

        enableInvestor = (item) => {
            item.isDisabled = !item.isDisabled;
            item.isEditClicked = !item.isEditClicked;
            if (item.isDisabled == false) {
                item.hoverEdit = true;
            }
        }

        hoverInTitle = (item) => {
            item.hoverEdit = true;
        }

        hoverOutTitle = (item) => {
            if (item.isDisabled == false) {
                item.hoverEdit = true;
            }
            else { item.hoverEdit = false; }
        }

        isDescriptionTextExpired = (number) => {
            if (number > 0) {
                return false;
            }
            else {
                return true;
            }
        }

        adjustedPointsChange = () => {
            this.wrappedLoan.ref.financialInfo.adjustedPoints = 100 - this.pricingLockingModel.finalLoanOfficerPrice;
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.AdjustedPointsChanged, this.wrappedLoan.ref.financialInfo.adjustedPoints);
        }

        addRow = (pricingViewModel: cls.PricingAdjustmentsViewModel, secType: number) => {
            var vm = this;
            var newItem = new cls.AdjustmentsViewModel();

            newItem.editMode = true;
            newItem.hoverClick = true;
            newItem.hoverEdit = true;
            newItem.loanId = vm.wrappedLoan.ref.loanId;
            newItem.isDeleted = false;
            newItem.adjustmentSectionType = secType;
            newItem.adjustmentTypeId = pricingViewModel.defaultAdjustmentTypeId;
            newItem.newAdjustment = true;
            newItem.lastModifiedBy = vm.applicationData.currentUser.firstName + ' ' + vm.applicationData.currentUser.lastName;
            newItem.sortingNotRequired = true;
            pricingViewModel.adjustments.push(newItem);
        }

        removeRow = (item, adjustmentsModel) => {
            if (adjustmentsModel[adjustmentsModel.indexOf(item)].isEmpty) {
                adjustmentsModel.splice(adjustmentsModel.indexOf(item), 1);
            }
            else {
                adjustmentsModel[adjustmentsModel.indexOf(item)].isDeleted = true;
                this.wrappedLoan.ref.financialInfo.adjustedPoints += parseFloat(adjustmentsModel[adjustmentsModel.indexOf(item)].value);
            }
        }

        getAdjustmentDescription = (lookupAdjustmentTypes: cls.LookupItem[], adjustment: cls.AdjustmentsViewModel) => {
            var lookupItem = _.find(lookupAdjustmentTypes, function (item: cls.LookupItem) {
                return item.value === String(adjustment.adjustmentTypeId);
            });

            return lookupItem ? lookupItem.text : '';
        }       

        getPaidBy = (loPricePaidBys: cls.LookupItem[], adjustment: cls.AdjustmentsViewModel) => {
            var lookupItem = _.find(loPricePaidBys, function (item: cls.LookupItem) {               
                return item.value === String(adjustment.paidBy);
            });

            return lookupItem ? lookupItem.description : '';
        }

        editAdjustment = (adjustment: cls.AdjustmentsViewModel) => {
            if (adjustment && adjustment.isEditable && !this.isDisabled() &&
                (adjustment.description != "Approved" && adjustment.description != "Denied"))
            {
                adjustment.editMode = true;
                adjustment.hoverClick = true;
                adjustment.hoverEdit = true;
            }
        }

        saveAll = () => {
            var vm = this;
            vm.pricingLockingModel.sellSideInformation.isDisabledSellSide = true;
            vm.rateAndPriceEditDisabled = true;
            vm.savingDataInProgress = true;
            vm.pricingLockingModel.disableFields = true;

            this.navigationSvc.SaveAndUpdateWrappedLoan(vm.applicationData.currentUserId, vm.wrappedLoan, function (wrappedLoan) {
                vm.lockingPricingSvc.lockLoan().get({ loanid: vm.wrappedLoan.ref.loanId, useraccountid: vm.applicationData.currentUserId }).$promise.then(function (data) {
                    vm.state.reload();
                    vm.savingDataInProgress = false;
                    vm.pricingLockingModel.disableFields = true;
                },
                    function (error) {
                        vm.savingDataInProgress = false;
                        vm.pricingLockingModel.disableFields = false;
                    });

            }, function (error) {
                    vm.savingDataInProgress = false;
                    vm.pricingLockingModel.disableFields = false;
                });
        }

        saveOnly = () => {
            var vm = this;
            vm.savingDataInProgress = true;

            this.navigationSvc.SaveAndUpdateWrappedLoan(vm.applicationData.currentUserId, vm.wrappedLoan, function (wrappedLoan) {
                vm.savingDataInProgress = false;
            }, function (error) {
                    vm.savingDataInProgress = false;
                });
        }

        cancelChanges = () => {
            var vm = this;
            vm.savingDataInProgress = false;
            vm.pricingLockingModel.disableFields = false;
            this.navigationSvc.cancelChanges(vm.wrappedLoan.ref.loanId);
        }

        callSaveLockAction = (): void => {
            var vm = this;
            
            if (vm.lockingAction) {
                switch (vm.lockingAction.value) {
                    case 1: //Save only
                        this.saveOnly();
                        break;
                }
            }
        }

        filterOptionsByRoles = (item): boolean => {
            var vm = this;
            var hasPrivilege = false;

            if (vm.applicationData.currentUser && !item.saveAction) {
                hasPrivilege = vm.applicationData.currentUser.hasPrivilege(item.userPrivilege);
            }

            return (hasPrivilege || item.saveAction)
        }
        
        showSaveLockAction = (item, $event) :void => {
            var vm = this;
            if (item) {
                vm.lockingAction = item;
            }
        };

        isDisabled = () => {
            return (this.pricingLockingModel.disableFields || this.wrappedLoan.ref.lockingInformation.isLocked || this.savingDataInProgress);
        }

        /*
        * @Description: Get Loan Officer Adjustment Types
        * containsRequestedConcession - parameter that tells if current adjustments contain Concession with requested status - if true, concessions will be removed from available options
        */
        getLoanOfficerAdjustmentTypes(containsRequestedConcession: boolean)
        {
            if (containsRequestedConcession == true) {
                return this.lookups.loAdjustmentTypes.filter((adjustmentType) => { return adjustmentType.text != "Concession" && this.loFilter(adjustmentType) });
            }
            else {
                return this.lookups.loAdjustmentTypes.filter((adjustmentType) => { return this.loFilter(adjustmentType) });
            }
        }
        
        /*
        * @Description: Filter Adjustment Types by provided enum value (Enterprise Table, Loan Officer table, Investor Purchase table)
        */
        adjustmentTypeFilter = (adjustment: cls.AdjustmentsViewModel) =>
        {
            // Data that is going to be available in Adjustment Dropdown
            var adjustmentTypes = [];

            if (adjustment && adjustment.adjustmentSectionType == srv.pricingAdjustmentSectionType.loanOfficer)
            {
                var existingLoanOfficerAdjustments = this.tableAdjustmentList(srv.pricingAdjustmentSectionType.loanOfficer);
                if (existingLoanOfficerAdjustments && existingLoanOfficerAdjustments.length > 0)
                {
                    // Check if we have Concessions with status requested
                    var isConcessionRequested = existingLoanOfficerAdjustments.some((adjustment) => { return this.isConessionRequested(adjustment, srv.pricingAdjustmentSectionType.loanOfficer) });
                    var currentNumberOfLoConcessions = this.getTotalNumberOfLoApprovedConcessions();

                    // If max number of concessions is reached or concession is requested, concession should be removed from dropdown options for LO
                    var concessionRequested = isConcessionRequested || (this.maxAllowedNumberOfConcession && this.maxAllowedNumberOfConcession > 0 && currentNumberOfLoConcessions >= this.maxAllowedNumberOfConcession);

                    // Concession should be removed from adjustmentTypes if:
                    // 1. Adjustment is new adjustment and LO table of Adjustments does not have Requested Adjustments
                    // 2. Current adjustment type is concession (LO Table of adjustments is section 2) and adjustment is not new adjustment
                    // 3. Current adjustment type is concession (LO Table of adjustments is section 2) and adjustment is new adjustment and LO table of Adjustments has Requested Adjustments
                    if ((adjustment.newAdjustment && !concessionRequested) || (adjustment.adjustmentTypeId == undefined) || (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Concession && (!adjustment.newAdjustment || (adjustment.newAdjustment && concessionRequested))))
                    {
                        adjustmentTypes = this.getLoanOfficerAdjustmentTypes(false);
                    }
                    else
                    {
                        adjustmentTypes = this.getLoanOfficerAdjustmentTypes(true);
                    }
                }
                else
                {
                    // If LO Table of adjustments does not contain any adjustments, use all available adjustments
                    adjustmentTypes = this.getLoanOfficerAdjustmentTypes(false);
                }
            }

            return adjustmentTypes;
        }

        /*
        *@Description: If list of all adjustments for LO contains only concession and concession is already requested, disable button
        */
        disableLoAddButton = () =>
        {
            var disableLoAddButton = false;

            // Get all adjustments for table of adjustments
            var loanOfficerAdjustments = this.tableAdjustmentList(srv.pricingAdjustmentSectionType.loanOfficer);
            if (loanOfficerAdjustments && loanOfficerAdjustments.length > 0)
            {
                // Check if LO Table of adjustments contains Requested Concession
                var isConcessionRequested = loanOfficerAdjustments.some((adjustment) => { return this.isConessionRequested(<cls.AdjustmentsViewModel> adjustment, srv.pricingAdjustmentSectionType.loanOfficer) });

                // If number of concession is not set or it is set to 0, than limit does not exists
                var adjustmentTypes = [];
                if (!this.maxAllowedNumberOfConcession && this.maxAllowedNumberOfConcession < 1)
                {
                    // Get all available Adjustment Types for LoanOfficer Table of adjustments
                    adjustmentTypes = (isConcessionRequested) ? this.getLoanOfficerAdjustmentTypes(true) : this.getLoanOfficerAdjustmentTypes(false);
                }
                else
                {
                    //If Max allowed number of concessions is set, it is required to check current number of concessions
                    var totalNumberOfLoConcession = this.getTotalNumberOfLoApprovedConcessions();
                    adjustmentTypes = (isConcessionRequested || (totalNumberOfLoConcession >= this.maxAllowedNumberOfConcession)) ? this.getLoanOfficerAdjustmentTypes(true) : this.getLoanOfficerAdjustmentTypes(false);
                }

                disableLoAddButton = !adjustmentTypes || adjustmentTypes.length < 1;
            }

            return disableLoAddButton;
        }

        /*
        * @Description: Check if Concession for specified Table exists
        * tableOfAdjustments - enum(pricingAdjustmentSectionType)
        */
        isConessionRequested = (adjustment: cls.AdjustmentsViewModel, tableOfAdjustments: number) =>
        {
            var isConcessionRequested = false;
            if (tableOfAdjustments && adjustment)
            {
                // If table is LoanOfficer and Adjustment belongs to that table
                if (tableOfAdjustments == srv.pricingAdjustmentSectionType.loanOfficer && tableOfAdjustments == adjustment.adjustmentSectionType)
                {
                    // Since concession can be in section 2 (LoanOfficerTable) and section 3(InverstPurchase) it is required to validate Section 2
                    // Description must be "Requested"
                    // Adjustment may not be deleted
                    isConcessionRequested = adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Concession && !adjustment.isDeleted && adjustment.description == "Requested";
                }
            }

            return isConcessionRequested;
        }

        /*
        * @Description: Adjustment SubType dropdown options filter
        */
        adjustmentsSubTypeFilter = (adjustment: cls.AdjustmentsViewModel) =>
        {
            var adjustmentSubTypes = Array<srv.IAdjustmentTypesViewModel>();
            if (adjustment && !adjustment.isDeleted)
            {
                //Get all subtypes for adjustment
                adjustmentSubTypes = this.filterAdjustmentDescriptions(adjustment, srv.LoanPricingAdjustmentDropDownTypeEnum.SubType);

                if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Concession)
                {
                    var filteredAdjustmentSubTypes = [];
                    var roles = this.applicationData.currentUser.roles;

                    if (this.currentUserRole == this.enums.userRoles.lockDesk || this.currentUserRole == this.enums.userRoles.loanOfficer
                        || this.currentUserRole == this.enums.userRoles.secondary || this.currentUserRole == this.enums.userRoles.administrator)
                    {
                        filteredAdjustmentSubTypes = this.getFilteredConcessionSubTypes(adjustment, adjustmentSubTypes);
                    }

                    adjustment.hasSubType = filteredAdjustmentSubTypes.length > 0;
                    return filteredAdjustmentSubTypes;
                }

                adjustment.hasSubType = adjustmentSubTypes.length > 0;
            }

            return adjustmentSubTypes;
        }

        /*
        * @Description: Filter Concession Sub Types
        */
        getFilteredConcessionSubTypes = (adjustment: cls.AdjustmentsViewModel, adjustmentSubTypes: Array<srv.IAdjustmentTypesViewModel>) =>
        {
            var filteredAdjustmentSubTypes = Array<srv.IAdjustmentTypesViewModel>();

            if (!adjustment.description)
            {
                adjustment.firstLoad = false;
                filteredAdjustmentSubTypes = adjustmentSubTypes.filter((adjustmentSubType) => { return adjustmentSubType.text == "Requested" });

                //If list is > 0 than it means that Requested is valid description
                if (filteredAdjustmentSubTypes.length > 0)
                {
                    adjustment.description = "Requested";
                }
            }
            else if (adjustment.description == "Requested")
            {
                if (adjustment.firstLoad == true && this.currentUserRole != this.enums.userRoles.loanOfficer && this.userHasConcessionPrivileges)
                {
                    var adjustmentRate = adjustment.rate;

                    // If currently approved rate + adjustment rate is > than max allowed approve rate than user can not Approve or Deny
                    filteredAdjustmentSubTypes = ((adjustmentRate + this.totalApprovedConcessionRates) > this.maxConcessionApproveRate) ?
                        this.getAdjustmnetSubTypeByText(adjustmentSubTypes, ["Requested"]) :
                        this.getAdjustmnetSubTypeByText(adjustmentSubTypes, ["Requested","Approved","Denied"]);
                }
                else
                {
                    filteredAdjustmentSubTypes = this.getAdjustmnetSubTypeByText(adjustmentSubTypes, ["Requested"]);
                }
            }
            else if (adjustment.description == "Approved" || adjustment.description == "Denied")
            {
                filteredAdjustmentSubTypes = this.getAdjustmnetSubTypeByText(adjustmentSubTypes, ["Requested","Approved", "Denied"]);
            }

            return filteredAdjustmentSubTypes;
        }

        /*
        *@Desc - return IAdjustmentypesViewModel array, results are depending from inputs
        */
        getAdjustmnetSubTypeByText = (adjustmentSubTypes: srv.IAdjustmentTypesViewModel[], filter: string[]): srv.IAdjustmentTypesViewModel[] =>
        {
            var filteringResults = [];
            if (!adjustmentSubTypes || !filter)
            {
                return filteringResults;
            }

            var param1 = filter[0];
            if (filter.length == 1)
            {
                filteringResults = adjustmentSubTypes.filter((adjustmentSubType) => { return adjustmentSubType.text == param1 })
            }
            else
            {
                var param2 = filter[1];
                if (filter.length == 2)
                {
                    filteringResults = adjustmentSubTypes.filter((adjustmentSubType) => { return adjustmentSubType.text == param1 || adjustmentSubType.text == param2 });
                }
                else
                {
                    var param3 = filter[2];
                    if (filter.length == 3)
                    {
                        filteringResults = adjustmentSubTypes.filter((adjustmentSubType) => { return adjustmentSubType.text == param1 || adjustmentSubType.text == param2 || adjustmentSubType.text == param3 });
                    }
                }
            }

            return filteringResults;
        }

        //Adjustments PaidBy dropdown options filter
        paidByTypeFilter = (adjustment: cls.AdjustmentsViewModel) => {
            var vm = this;
            var filteredLookup = [];

            //Get All PaidBy Adjustments
            var filtederdPaidOff = this.filterAdjustmentDescriptions(adjustment, srv.LoanPricingAdjustmentDropDownTypeEnum.PaidBy);

            for (var i = 0; i < vm.applicationData.lookup.loPricePaidBy.length; i++) {
                for (var j = 0; j < filtederdPaidOff.length; j++) {
                    if (vm.applicationData.lookup.loPricePaidBy[i].text == filtederdPaidOff[j].text) {
                        filteredLookup.push(vm.applicationData.lookup.loPricePaidBy[i]);
                    }
                }
            }

            if (filteredLookup.length > 0) { adjustment.hasPaidByType = true; }
            else { adjustment.hasPaidByType = false; }

            return filteredLookup;
        }
        
        /*
        * Filter Adjustment Description based on Section and Type
        */
        filterAdjustmentDescriptions = (adjustment: cls.AdjustmentsViewModel, section: number) =>
        {
            var adjustmentSubTypes = this.applicationData.adjustmentTypeDescLookupViewModel.adjustmentTypesDescriptions;
            if (!adjustmentSubTypes || !adjustment){ return []; }

            return adjustmentSubTypes.filter((ajdustmentSubType) => { return ajdustmentSubType.type == section && ajdustmentSubType.value == adjustment.adjustmentTypeId });
        }

        // Change name of Last person that has modified adjustment
        changeSelection = (adjustment: cls.AdjustmentsViewModel, dropdownType: number) => {
            if (adjustment) {
                var vm = this;
                adjustment.lastModifiedBy = vm.applicationData.currentUser.firstName + ' ' + vm.applicationData.currentUser.lastName;

                if (dropdownType == srv.LoanPricingAdjustmentDropDownTypeEnum.Adjustment)
                {
                    adjustment.description = '';
                    adjustment.paidBy = -1;
                }// If Loan Officer Table Of Adjustments Concession
                else if (dropdownType == srv.LoanPricingAdjustmentDropDownTypeEnum.SubType)
                {
                    if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Concession && (adjustment.description == "Approved" || adjustment.description == "Requested"))
                    {
                        // Get all concessions
                        // Get number of allowed concessions
                        // Check if concession is Requested after Approved/Requested value, if it is remove it
                        var totalApprovedConcessions = this.getTotalNumberOfLoApprovedConcessions();

                        // Requested adjustments are not counted in maxAllowedNumberOfConessions so sepereate if is required
                        if (totalApprovedConcessions >= this.maxAllowedNumberOfConcession || adjustment.description == "Requested")
                        {
                            var rowsForRemove = [];
                            for (var i = 0; i < this.pricingLockingModel.adjustments.length; i++)
                            {
                                var helperAdjustment = this.pricingLockingModel.adjustments[i];

                                //Since it is possible to change to requested as well, ignore current adjustment
                                if (helperAdjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Concession &&
                                    helperAdjustment.description == "Requested" && !helperAdjustment.isDeleted && helperAdjustment != adjustment)
                                {
                                    rowsForRemove.push(i);
                                }
                            }

                            if (rowsForRemove.length > 0)
                            {
                                rowsForRemove.forEach((row) => this.removeRow(this.pricingLockingModel.adjustments[row], this.pricingLockingModel.adjustments));
                            }
                        }
                    }
                }
            }
        }

        // Set Adjustment note message
        adjustNoteMessage = (adjustment: cls.AdjustmentsViewModel) => {
            var message = '';
            if (adjustment && adjustment.description) {
                message = adjustment.description;
            }

            if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Concession && adjustment.lastModifiedBy && adjustment.lastModifiedBy != "OptimalBlue") {
                if (!message) {
                    message = '{' + adjustment.lastModifiedBy + '}';
                } else {
                    message = message + ', {' + adjustment.lastModifiedBy + '}';
                }
            }

            if (adjustment.note) {
                if (!message) {
                    message = adjustment.note
                } else {
                    message = message + ' ' + adjustment.note;
                }
            }

            return message;
        }

        // Sorted adjustment list
        tableAdjustmentList = (filter: number) => {
            var adjustments = this.pricingLockingModel.adjustments;
            var filteredList = [];
            var extensionCounter = 0;
            var concessionCounter = 0;

            for (var i = 0; i < adjustments.length; i++) {
                if (adjustments[i].adjustmentSectionType == filter) {
                    //Cast adjustment to extended view model
                    var adjustment = <cls.AdjustmentsViewModel>adjustments[i];
                    !adjustment.adjustmentCounter? '' : adjustment.adjustmentCounter;

                    if (!adjustment.newAdjustment)
                    {
                        if (!adjustment.sortingNotRequired)
                        {
                            if (adjustment.adjustmentSectionType == 1)
                            {
                                if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec1CorporateMargin) { adjustment.orderBy = 1; }
                                else if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec1DivisionMargin) { adjustment.orderBy = 2; }
                                else if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec1Compensation) { adjustment.orderBy = 3; }
                                else if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec1Ipa) { adjustment.orderBy = 4; }
                                else if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec1Ira) { adjustment.orderBy = 5; }
                                else { adjustment.orderBy = adjustments.length + i; }
                            }
                            else if (adjustment.adjustmentSectionType == 2)
                            {
                                if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Llpa) { adjustment.orderBy = 1; }
                                else if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Llra) { adjustment.orderBy = 2; }
                                else if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Ipa) { adjustment.orderBy = 3; }
                                else if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Concession) {
                                    adjustment.orderBy = 4;
                                    extensionCounter = extensionCounter + 1;
                                    adjustment.adjustmentCounter = extensionCounter.toString();
                                }
                                else if (adjustment.adjustmentTypeId == srv.LoanPricingAdjustmentTypeEnum.Sec2Extension)
                                {
                                    adjustment.orderBy = 5;
                                    concessionCounter = concessionCounter + 1;
                                    adjustment.adjustmentCounter = concessionCounter.toString();
                                }
                                else
                                {
                                    adjustment.orderBy = adjustments.length + i;
                                }
                            }
                            adjustment.sortingNotRequired = true;
                        }
                    }
                    else
                    {
                        adjustment.orderBy = adjustments.length + i;
                    }

                    filteredList.push(adjustment);
                }
            }

            //Sort ASC
            var sortedAdjustment = filteredList.sort(function (obj1, obj2) { return obj1.orderBy - obj2.orderBy });
            return sortedAdjustment;
        }

        getIntegrationItem = (itemId, logType) => {
            var vm = this;
            var result = vm.pricingResultsSvc.GetIntegrationLogItem(vm.wrappedLoan.ref.active.getBorrower().userAccount.userAccountId, itemId, logType);//85347, 72436, 'pricing');
        };
        
        openIntegrationXmlMenu = (event, logListItem, logType) => {
            var vm = this;
            var detailedClosingCostPopup = this.modalPopoverFactory.openModalPopover('angular/pricingresults/sections/integrationsxmloptions.html', { getIntegrationItem: vm.getIntegrationItem }, { logListItem: logListItem, logType: logType }, event, { className: 'tooltip-arrow-integration-logs', calculateVerticalPositionFromTopBorder: true, verticalPopupPositionPerHeight: 1, horisontalPopupPositionPerWidth: 0.5 });
            detailedClosingCostPopup.result.then(function (data) {

            }, function () {

                });
        }
    }

    angular.module('lockingandpricingadj').controller('lockingandpricingController', lockingandpricingController);
}
