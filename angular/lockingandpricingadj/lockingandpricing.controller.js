var lockingandpricingadj;
(function (lockingandpricingadj) {
    // todo - rewrite this class to the TypeScript standards implemented by the document and is used throughout the entire application. 'vm' is not required and needs to be removed.
    var lockingandpricingController = (function () {
        function lockingandpricingController(wrappedLoan, enums, modalPopoverFactory, NavigationSvc, pricingResultsSvc, $filter, $state, simpleModalWindowFactory, lockingPricingService, applicationData, loanEvent, lockingActions) {
            var _this = this;
            this.wrappedLoan = wrappedLoan;
            this.enums = enums;
            this.modalPopoverFactory = modalPopoverFactory;
            this.NavigationSvc = NavigationSvc;
            this.pricingResultsSvc = pricingResultsSvc;
            this.$filter = $filter;
            this.$state = $state;
            this.simpleModalWindowFactory = simpleModalWindowFactory;
            this.lockingPricingService = lockingPricingService;
            this.applicationData = applicationData;
            this.loanEvent = loanEvent;
            this.lockingActions = lockingActions;
            this.rateAndPriceEditDisabled = true;
            this.userHasConcessionPrivileges = false; // Check if user has privileges (if does not have privilege, it shouldn't have deny option as well)
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
            this.getTotalSumOfApprovedRates = function () {
                var sum = 0;
                _this.pricingLockingModel.adjustments.forEach(function (adjustment) {
                    if (adjustment.adjustmentSectionType == 2 /* Sec2Concession */ && !adjustment.isDeleted && adjustment.description == "Approved") {
                        return sum += adjustment.rate;
                    }
                });
                return sum;
            };
            /*
            *@Description - Get Max Allowed Number of concessions - LockingConfiguration table
            */
            this.getMaxAllowedNumberOfPrivileges = function () {
                var maxNumberOfConcessions = 0;
                _this.applicationData.lockingConfigurations.some(function (lockingConfig) {
                    if (lockingConfig.lockingConfigurationKey == 5 /* MaxNumberOfConcessions */) {
                        maxNumberOfConcessions = parseInt(lockingConfig.value);
                    }
                });
                return maxNumberOfConcessions;
            };
            /*
            * @Description - Get total Number of LoanOfficer Concession
            */
            this.getTotalNumberOfLoApprovedConcessions = function () {
                var numberOfLoConcessions = 0;
                _this.pricingLockingModel.adjustments.forEach(function (adjustment) {
                    if (adjustment.adjustmentTypeId == 2 /* Sec2Concession */ && !adjustment.isDeleted && adjustment.description == "Approved") {
                        numberOfLoConcessions++;
                    }
                });
                return numberOfLoConcessions;
            };
            this.modifyArmAdjustmentPeriod = function (armAdjustmentPeriod) {
                if (!armAdjustmentPeriod) {
                    return 12;
                }
                else {
                    return armAdjustmentPeriod;
                }
            };
            this.lockStatusDisplay = function () {
                var vm = _this;
                var lockStatus;
                for (var i = 0; i < vm.applicationData.lookup.lockStatus.length; i++) {
                    if (vm.applicationData.lookup.lockStatus[i].value == vm.wrappedLoan.ref.lockingInformation.lockStatus) {
                        lockStatus = vm.applicationData.lookup.lockStatus[i].text;
                    }
                }
                return lockStatus;
            };
            this.setVisibilityByRoles = function () {
                var vm = _this;
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
            };
            this.setClassesAndPermissionsByPrivilege = function () {
                var vm = _this;
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
                        if (privilege.name == vm.enums.privileges.ConcessionLevel1) {
                            concessionPrivileges.push(7 /* MaxConcessionAmountLevel1 */);
                        }
                        else if (privilege.name == vm.enums.privileges.ConcessionLevel2) {
                            concessionPrivileges.push(8 /* MaxConcessionAmountLevel2 */);
                        }
                        else if (privilege.name == vm.enums.privileges.ConcessionLevel3) {
                            concessionPrivileges.push(9 /* MaxConcessionAmountLevel3 */);
                        }
                        else if (privilege.name == vm.enums.privileges.ConcessionLevel4) {
                            concessionPrivileges.push(10 /* MaxConcessionAmountLevel4 */);
                        }
                        else if (privilege.name == vm.enums.privileges.ConcessionLevel5) {
                            concessionPrivileges.push(11 /* MaxConcessionAmountLevel5 */);
                        }
                    });
                }
                if (concessionPrivileges.length > 0) {
                    vm.userHasConcessionPrivileges = true;
                    if (vm.applicationData.lockingConfigurations) {
                        angular.forEach(concessionPrivileges, function (concessionPrivilege) {
                            vm.applicationData.lockingConfigurations.forEach(function (lockingConfig) {
                                var tempvalue = parseFloat(lockingConfig.value);
                                if (concessionPrivilege == lockingConfig.lockingConfigurationKey && tempvalue > maxValue) {
                                    maxValue = tempvalue;
                                }
                            });
                        });
                    }
                }
                _this.maxConcessionApproveRate = maxValue;
            };
            this.getTotalLoanOfficerAmount = function (adjustments) {
                var total = 0;
                for (var i = 0; i < adjustments.length; i++) {
                    if (adjustments[i].adjustmentSectionType == _this.enums.pricingAdjustmentSectionType.lOPrice && adjustments[i].isDeleted != true) {
                        total += parseFloat(adjustments[i].value);
                    }
                }
                return total;
            };
            this.filterPricingAdjustments = function (wrappedLoan, enumType) {
                var vm = _this;
                var pricing = new cls.PricingAdjustmentsViewModel(wrappedLoan.ref.pricingAdjustments);
                pricing.adjustments = _.filter(wrappedLoan.ref.pricingAdjustments.adjustments, function (adjustment) {
                    adjustment.totalLoanAmount = vm.totalAmountValue;
                    return adjustment.adjustmentSectionType === enumType;
                });
                pricing.defaultAdjustmentTypeId = 1;
                pricing.isDisabled = true;
                return pricing;
            };
            this.getInclude = function () {
                if (_this.isLO && !_this.displayLOSection) {
                    return "angular/lockingandpricingadj/loprice.html";
                }
                else if (_this.displayEnterpriseSection)
                    return "angular/lockingandpricingadj/investorprice.html";
                else
                    return null;
            };
            this.loFilter = function (item) {
                return item.isEditable;
            };
            this.setSellSideInvestorPurchasePrice = function () {
                _this.pricingLockingModel.sellSideInformation.sellSideInvestorPurchasePrice = _this.pricingLockingModel.investorPurchasePrice;
            };
            this.enableSellSide = function () {
                if (_this.pricingLockingModel.sellSideInformation.isDisabledSellSide) {
                    _this.pricingLockingModel.sellSideInformation.isDisabledSellSide = false;
                }
            };
            this.enableRateAndPriceEdit = function () {
                if (_this.rateAndPriceEditDisabled) {
                    _this.rateAndPriceEditDisabled = false;
                }
            };
            this.enableInvestor = function (item) {
                item.isDisabled = !item.isDisabled;
                item.isEditClicked = !item.isEditClicked;
                if (item.isDisabled == false) {
                    item.hoverEdit = true;
                }
            };
            this.hoverInTitle = function (item) {
                item.hoverEdit = true;
            };
            this.hoverOutTitle = function (item) {
                if (item.isDisabled == false) {
                    item.hoverEdit = true;
                }
                else {
                    item.hoverEdit = false;
                }
            };
            this.isDescriptionTextExpired = function (number) {
                if (number > 0) {
                    return false;
                }
                else {
                    return true;
                }
            };
            this.adjustedPointsChange = function () {
                _this.wrappedLoan.ref.financialInfo.adjustedPoints = 100 - _this.pricingLockingModel.finalLoanOfficerPrice;
                _this.loanEvent.broadcastPropertyChangedEvent(23 /* AdjustedPointsChanged */, _this.wrappedLoan.ref.financialInfo.adjustedPoints);
            };
            this.addRow = function (pricingViewModel, secType) {
                var vm = _this;
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
            };
            this.removeRow = function (item, adjustmentsModel) {
                if (adjustmentsModel[adjustmentsModel.indexOf(item)].isEmpty) {
                    adjustmentsModel.splice(adjustmentsModel.indexOf(item), 1);
                }
                else {
                    adjustmentsModel[adjustmentsModel.indexOf(item)].isDeleted = true;
                    _this.wrappedLoan.ref.financialInfo.adjustedPoints += parseFloat(adjustmentsModel[adjustmentsModel.indexOf(item)].value);
                }
            };
            this.getAdjustmentDescription = function (lookupAdjustmentTypes, adjustment) {
                var lookupItem = _.find(lookupAdjustmentTypes, function (item) {
                    return item.value === String(adjustment.adjustmentTypeId);
                });
                return lookupItem ? lookupItem.text : '';
            };
            this.getPaidBy = function (loPricePaidBys, adjustment) {
                var lookupItem = _.find(loPricePaidBys, function (item) {
                    return item.value === String(adjustment.paidBy);
                });
                return lookupItem ? lookupItem.description : '';
            };
            this.editAdjustment = function (adjustment) {
                if (adjustment && adjustment.isEditable && !_this.isDisabled() && (adjustment.description != "Approved" && adjustment.description != "Denied")) {
                    adjustment.editMode = true;
                    adjustment.hoverClick = true;
                    adjustment.hoverEdit = true;
                }
            };
            this.saveAll = function () {
                var vm = _this;
                vm.pricingLockingModel.sellSideInformation.isDisabledSellSide = true;
                vm.rateAndPriceEditDisabled = true;
                vm.savingDataInProgress = true;
                vm.pricingLockingModel.disableFields = true;
                _this.navigationSvc.SaveAndUpdateWrappedLoan(vm.applicationData.currentUserId, vm.wrappedLoan, function (wrappedLoan) {
                    vm.lockingPricingSvc.lockLoan().get({ loanid: vm.wrappedLoan.ref.loanId, useraccountid: vm.applicationData.currentUserId }).$promise.then(function (data) {
                        vm.state.reload();
                        vm.savingDataInProgress = false;
                        vm.pricingLockingModel.disableFields = true;
                    }, function (error) {
                        vm.savingDataInProgress = false;
                        vm.pricingLockingModel.disableFields = false;
                    });
                }, function (error) {
                    vm.savingDataInProgress = false;
                    vm.pricingLockingModel.disableFields = false;
                });
            };
            this.saveOnly = function () {
                var vm = _this;
                vm.savingDataInProgress = true;
                _this.navigationSvc.SaveAndUpdateWrappedLoan(vm.applicationData.currentUserId, vm.wrappedLoan, function (wrappedLoan) {
                    vm.savingDataInProgress = false;
                }, function (error) {
                    vm.savingDataInProgress = false;
                });
            };
            this.cancelChanges = function () {
                var vm = _this;
                vm.savingDataInProgress = false;
                vm.pricingLockingModel.disableFields = false;
                _this.navigationSvc.cancelChanges(vm.wrappedLoan.ref.loanId);
            };
            this.callSaveLockAction = function () {
                var vm = _this;
                if (vm.lockingAction) {
                    switch (vm.lockingAction.value) {
                        case 1:
                            _this.saveOnly();
                            break;
                    }
                }
            };
            this.filterOptionsByRoles = function (item) {
                var vm = _this;
                var hasPrivilege = false;
                if (vm.applicationData.currentUser && !item.saveAction) {
                    hasPrivilege = vm.applicationData.currentUser.hasPrivilege(item.userPrivilege);
                }
                return (hasPrivilege || item.saveAction);
            };
            this.showSaveLockAction = function (item, $event) {
                var vm = _this;
                if (item) {
                    vm.lockingAction = item;
                }
            };
            this.isDisabled = function () {
                return (_this.pricingLockingModel.disableFields || _this.wrappedLoan.ref.lockingInformation.isLocked || _this.savingDataInProgress);
            };
            /*
            * @Description: Filter Adjustment Types by provided enum value (Enterprise Table, Loan Officer table, Investor Purchase table)
            */
            this.adjustmentTypeFilter = function (adjustment) {
                // Data that is going to be available in Adjustment Dropdown
                var adjustmentTypes = [];
                if (adjustment && adjustment.adjustmentSectionType == 2 /* loanOfficer */) {
                    var existingLoanOfficerAdjustments = _this.tableAdjustmentList(2 /* loanOfficer */);
                    if (existingLoanOfficerAdjustments && existingLoanOfficerAdjustments.length > 0) {
                        // Check if we have Concessions with status requested
                        var isConcessionRequested = existingLoanOfficerAdjustments.some(function (adjustment) {
                            return _this.isConessionRequested(adjustment, 2 /* loanOfficer */);
                        });
                        var currentNumberOfLoConcessions = _this.getTotalNumberOfLoApprovedConcessions();
                        // If max number of concessions is reached or concession is requested, concession should be removed from dropdown options for LO
                        var concessionRequested = isConcessionRequested || (_this.maxAllowedNumberOfConcession && _this.maxAllowedNumberOfConcession > 0 && currentNumberOfLoConcessions >= _this.maxAllowedNumberOfConcession);
                        // Concession should be removed from adjustmentTypes if:
                        // 1. Adjustment is new adjustment and LO table of Adjustments does not have Requested Adjustments
                        // 2. Current adjustment type is concession (LO Table of adjustments is section 2) and adjustment is not new adjustment
                        // 3. Current adjustment type is concession (LO Table of adjustments is section 2) and adjustment is new adjustment and LO table of Adjustments has Requested Adjustments
                        if ((adjustment.newAdjustment && !concessionRequested) || (adjustment.adjustmentTypeId == undefined) || (adjustment.adjustmentTypeId == 2 /* Sec2Concession */ && (!adjustment.newAdjustment || (adjustment.newAdjustment && concessionRequested)))) {
                            adjustmentTypes = _this.getLoanOfficerAdjustmentTypes(false);
                        }
                        else {
                            adjustmentTypes = _this.getLoanOfficerAdjustmentTypes(true);
                        }
                    }
                    else {
                        // If LO Table of adjustments does not contain any adjustments, use all available adjustments
                        adjustmentTypes = _this.getLoanOfficerAdjustmentTypes(false);
                    }
                }
                return adjustmentTypes;
            };
            /*
            *@Description: If list of all adjustments for LO contains only concession and concession is already requested, disable button
            */
            this.disableLoAddButton = function () {
                var disableLoAddButton = false;
                // Get all adjustments for table of adjustments
                var loanOfficerAdjustments = _this.tableAdjustmentList(2 /* loanOfficer */);
                if (loanOfficerAdjustments && loanOfficerAdjustments.length > 0) {
                    // Check if LO Table of adjustments contains Requested Concession
                    var isConcessionRequested = loanOfficerAdjustments.some(function (adjustment) {
                        return _this.isConessionRequested(adjustment, 2 /* loanOfficer */);
                    });
                    // If number of concession is not set or it is set to 0, than limit does not exists
                    var adjustmentTypes = [];
                    if (!_this.maxAllowedNumberOfConcession && _this.maxAllowedNumberOfConcession < 1) {
                        // Get all available Adjustment Types for LoanOfficer Table of adjustments
                        adjustmentTypes = (isConcessionRequested) ? _this.getLoanOfficerAdjustmentTypes(true) : _this.getLoanOfficerAdjustmentTypes(false);
                    }
                    else {
                        //If Max allowed number of concessions is set, it is required to check current number of concessions
                        var totalNumberOfLoConcession = _this.getTotalNumberOfLoApprovedConcessions();
                        adjustmentTypes = (isConcessionRequested || (totalNumberOfLoConcession >= _this.maxAllowedNumberOfConcession)) ? _this.getLoanOfficerAdjustmentTypes(true) : _this.getLoanOfficerAdjustmentTypes(false);
                    }
                    disableLoAddButton = !adjustmentTypes || adjustmentTypes.length < 1;
                }
                return disableLoAddButton;
            };
            /*
            * @Description: Check if Concession for specified Table exists
            * tableOfAdjustments - enum(pricingAdjustmentSectionType)
            */
            this.isConessionRequested = function (adjustment, tableOfAdjustments) {
                var isConcessionRequested = false;
                if (tableOfAdjustments && adjustment) {
                    // If table is LoanOfficer and Adjustment belongs to that table
                    if (tableOfAdjustments == 2 /* loanOfficer */ && tableOfAdjustments == adjustment.adjustmentSectionType) {
                        // Since concession can be in section 2 (LoanOfficerTable) and section 3(InverstPurchase) it is required to validate Section 2
                        // Description must be "Requested"
                        // Adjustment may not be deleted
                        isConcessionRequested = adjustment.adjustmentTypeId == 2 /* Sec2Concession */ && !adjustment.isDeleted && adjustment.description == "Requested";
                    }
                }
                return isConcessionRequested;
            };
            /*
            * @Description: Adjustment SubType dropdown options filter
            */
            this.adjustmentsSubTypeFilter = function (adjustment) {
                var adjustmentSubTypes = Array();
                if (adjustment && !adjustment.isDeleted) {
                    //Get all subtypes for adjustment
                    adjustmentSubTypes = _this.filterAdjustmentDescriptions(adjustment, 1 /* SubType */);
                    if (adjustment.adjustmentTypeId == 2 /* Sec2Concession */) {
                        var filteredAdjustmentSubTypes = [];
                        var roles = _this.applicationData.currentUser.roles;
                        if (_this.currentUserRole == _this.enums.userRoles.lockDesk || _this.currentUserRole == _this.enums.userRoles.loanOfficer || _this.currentUserRole == _this.enums.userRoles.secondary || _this.currentUserRole == _this.enums.userRoles.administrator) {
                            filteredAdjustmentSubTypes = _this.getFilteredConcessionSubTypes(adjustment, adjustmentSubTypes);
                        }
                        adjustment.hasSubType = filteredAdjustmentSubTypes.length > 0;
                        return filteredAdjustmentSubTypes;
                    }
                    adjustment.hasSubType = adjustmentSubTypes.length > 0;
                }
                return adjustmentSubTypes;
            };
            /*
            * @Description: Filter Concession Sub Types
            */
            this.getFilteredConcessionSubTypes = function (adjustment, adjustmentSubTypes) {
                var filteredAdjustmentSubTypes = Array();
                if (!adjustment.description) {
                    adjustment.firstLoad = false;
                    filteredAdjustmentSubTypes = adjustmentSubTypes.filter(function (adjustmentSubType) {
                        return adjustmentSubType.text == "Requested";
                    });
                    //If list is > 0 than it means that Requested is valid description
                    if (filteredAdjustmentSubTypes.length > 0) {
                        adjustment.description = "Requested";
                    }
                }
                else if (adjustment.description == "Requested") {
                    if (adjustment.firstLoad == true && _this.currentUserRole != _this.enums.userRoles.loanOfficer && _this.userHasConcessionPrivileges) {
                        var adjustmentRate = adjustment.rate;
                        // If currently approved rate + adjustment rate is > than max allowed approve rate than user can not Approve or Deny
                        filteredAdjustmentSubTypes = ((adjustmentRate + _this.totalApprovedConcessionRates) > _this.maxConcessionApproveRate) ? _this.getAdjustmnetSubTypeByText(adjustmentSubTypes, ["Requested"]) : _this.getAdjustmnetSubTypeByText(adjustmentSubTypes, ["Requested", "Approved", "Denied"]);
                    }
                    else {
                        filteredAdjustmentSubTypes = _this.getAdjustmnetSubTypeByText(adjustmentSubTypes, ["Requested"]);
                    }
                }
                else if (adjustment.description == "Approved" || adjustment.description == "Denied") {
                    filteredAdjustmentSubTypes = _this.getAdjustmnetSubTypeByText(adjustmentSubTypes, ["Requested", "Approved", "Denied"]);
                }
                return filteredAdjustmentSubTypes;
            };
            /*
            *@Desc - return IAdjustmentypesViewModel array, results are depending from inputs
            */
            this.getAdjustmnetSubTypeByText = function (adjustmentSubTypes, filter) {
                var filteringResults = [];
                if (!adjustmentSubTypes || !filter) {
                    return filteringResults;
                }
                var param1 = filter[0];
                if (filter.length == 1) {
                    filteringResults = adjustmentSubTypes.filter(function (adjustmentSubType) {
                        return adjustmentSubType.text == param1;
                    });
                }
                else {
                    var param2 = filter[1];
                    if (filter.length == 2) {
                        filteringResults = adjustmentSubTypes.filter(function (adjustmentSubType) {
                            return adjustmentSubType.text == param1 || adjustmentSubType.text == param2;
                        });
                    }
                    else {
                        var param3 = filter[2];
                        if (filter.length == 3) {
                            filteringResults = adjustmentSubTypes.filter(function (adjustmentSubType) {
                                return adjustmentSubType.text == param1 || adjustmentSubType.text == param2 || adjustmentSubType.text == param3;
                            });
                        }
                    }
                }
                return filteringResults;
            };
            //Adjustments PaidBy dropdown options filter
            this.paidByTypeFilter = function (adjustment) {
                var vm = _this;
                var filteredLookup = [];
                //Get All PaidBy Adjustments
                var filtederdPaidOff = _this.filterAdjustmentDescriptions(adjustment, 2 /* PaidBy */);
                for (var i = 0; i < vm.applicationData.lookup.loPricePaidBy.length; i++) {
                    for (var j = 0; j < filtederdPaidOff.length; j++) {
                        if (vm.applicationData.lookup.loPricePaidBy[i].text == filtederdPaidOff[j].text) {
                            filteredLookup.push(vm.applicationData.lookup.loPricePaidBy[i]);
                        }
                    }
                }
                if (filteredLookup.length > 0) {
                    adjustment.hasPaidByType = true;
                }
                else {
                    adjustment.hasPaidByType = false;
                }
                return filteredLookup;
            };
            /*
            * Filter Adjustment Description based on Section and Type
            */
            this.filterAdjustmentDescriptions = function (adjustment, section) {
                var adjustmentSubTypes = _this.applicationData.adjustmentTypeDescLookupViewModel.adjustmentTypesDescriptions;
                if (!adjustmentSubTypes || !adjustment) {
                    return [];
                }
                return adjustmentSubTypes.filter(function (ajdustmentSubType) {
                    return ajdustmentSubType.type == section && ajdustmentSubType.value == adjustment.adjustmentTypeId;
                });
            };
            // Change name of Last person that has modified adjustment
            this.changeSelection = function (adjustment, dropdownType) {
                if (adjustment) {
                    var vm = _this;
                    adjustment.lastModifiedBy = vm.applicationData.currentUser.firstName + ' ' + vm.applicationData.currentUser.lastName;
                    if (dropdownType == 0 /* Adjustment */) {
                        adjustment.description = '';
                        adjustment.paidBy = -1;
                    }
                    else if (dropdownType == 1 /* SubType */) {
                        if (adjustment.adjustmentTypeId == 2 /* Sec2Concession */ && (adjustment.description == "Approved" || adjustment.description == "Requested")) {
                            // Get all concessions
                            // Get number of allowed concessions
                            // Check if concession is Requested after Approved/Requested value, if it is remove it
                            var totalApprovedConcessions = _this.getTotalNumberOfLoApprovedConcessions();
                            // Requested adjustments are not counted in maxAllowedNumberOfConessions so sepereate if is required
                            if (totalApprovedConcessions >= _this.maxAllowedNumberOfConcession || adjustment.description == "Requested") {
                                var rowsForRemove = [];
                                for (var i = 0; i < _this.pricingLockingModel.adjustments.length; i++) {
                                    var helperAdjustment = _this.pricingLockingModel.adjustments[i];
                                    //Since it is possible to change to requested as well, ignore current adjustment
                                    if (helperAdjustment.adjustmentTypeId == 2 /* Sec2Concession */ && helperAdjustment.description == "Requested" && !helperAdjustment.isDeleted && helperAdjustment != adjustment) {
                                        rowsForRemove.push(i);
                                    }
                                }
                                if (rowsForRemove.length > 0) {
                                    rowsForRemove.forEach(function (row) { return _this.removeRow(_this.pricingLockingModel.adjustments[row], _this.pricingLockingModel.adjustments); });
                                }
                            }
                        }
                    }
                }
            };
            // Set Adjustment note message
            this.adjustNoteMessage = function (adjustment) {
                var message = '';
                if (adjustment && adjustment.description) {
                    message = adjustment.description;
                }
                if (adjustment.adjustmentTypeId == 2 /* Sec2Concession */ && adjustment.lastModifiedBy && adjustment.lastModifiedBy != "OptimalBlue") {
                    if (!message) {
                        message = '{' + adjustment.lastModifiedBy + '}';
                    }
                    else {
                        message = message + ', {' + adjustment.lastModifiedBy + '}';
                    }
                }
                if (adjustment.note) {
                    if (!message) {
                        message = adjustment.note;
                    }
                    else {
                        message = message + ' ' + adjustment.note;
                    }
                }
                return message;
            };
            // Sorted adjustment list
            this.tableAdjustmentList = function (filter) {
                var adjustments = _this.pricingLockingModel.adjustments;
                var filteredList = [];
                var extensionCounter = 0;
                var concessionCounter = 0;
                for (var i = 0; i < adjustments.length; i++) {
                    if (adjustments[i].adjustmentSectionType == filter) {
                        //Cast adjustment to extended view model
                        var adjustment = adjustments[i];
                        !adjustment.adjustmentCounter ? '' : adjustment.adjustmentCounter;
                        if (!adjustment.newAdjustment) {
                            if (!adjustment.sortingNotRequired) {
                                if (adjustment.adjustmentSectionType == 1) {
                                    if (adjustment.adjustmentTypeId == 7 /* Sec1CorporateMargin */) {
                                        adjustment.orderBy = 1;
                                    }
                                    else if (adjustment.adjustmentTypeId == 8 /* Sec1DivisionMargin */) {
                                        adjustment.orderBy = 2;
                                    }
                                    else if (adjustment.adjustmentTypeId == 17 /* Sec1Compensation */) {
                                        adjustment.orderBy = 3;
                                    }
                                    else if (adjustment.adjustmentTypeId == 18 /* Sec1Ipa */) {
                                        adjustment.orderBy = 4;
                                    }
                                    else if (adjustment.adjustmentTypeId == 19 /* Sec1Ira */) {
                                        adjustment.orderBy = 5;
                                    }
                                    else {
                                        adjustment.orderBy = adjustments.length + i;
                                    }
                                }
                                else if (adjustment.adjustmentSectionType == 2) {
                                    if (adjustment.adjustmentTypeId == 1 /* Sec2Llpa */) {
                                        adjustment.orderBy = 1;
                                    }
                                    else if (adjustment.adjustmentTypeId == 20 /* Sec2Llra */) {
                                        adjustment.orderBy = 2;
                                    }
                                    else if (adjustment.adjustmentTypeId == 21 /* Sec2Ipa */) {
                                        adjustment.orderBy = 3;
                                    }
                                    else if (adjustment.adjustmentTypeId == 2 /* Sec2Concession */) {
                                        adjustment.orderBy = 4;
                                        extensionCounter = extensionCounter + 1;
                                        adjustment.adjustmentCounter = extensionCounter.toString();
                                    }
                                    else if (adjustment.adjustmentTypeId == 4 /* Sec2Extension */) {
                                        adjustment.orderBy = 5;
                                        concessionCounter = concessionCounter + 1;
                                        adjustment.adjustmentCounter = concessionCounter.toString();
                                    }
                                    else {
                                        adjustment.orderBy = adjustments.length + i;
                                    }
                                }
                                adjustment.sortingNotRequired = true;
                            }
                        }
                        else {
                            adjustment.orderBy = adjustments.length + i;
                        }
                        filteredList.push(adjustment);
                    }
                }
                //Sort ASC
                var sortedAdjustment = filteredList.sort(function (obj1, obj2) {
                    return obj1.orderBy - obj2.orderBy;
                });
                return sortedAdjustment;
            };
            this.getIntegrationItem = function (itemId, logType) {
                var vm = _this;
                var result = vm.pricingResultsSvc.GetIntegrationLogItem(vm.wrappedLoan.ref.active.getBorrower().userAccount.userAccountId, itemId, logType); //85347, 72436, 'pricing');
            };
            this.openIntegrationXmlMenu = function (event, logListItem, logType) {
                var vm = _this;
                var detailedClosingCostPopup = _this.modalPopoverFactory.openModalPopover('angular/pricingresults/sections/integrationsxmloptions.html', { getIntegrationItem: vm.getIntegrationItem }, { logListItem: logListItem, logType: logType }, event, { className: 'tooltip-arrow-integration-logs', calculateVerticalPositionFromTopBorder: true, verticalPopupPositionPerHeight: 1, horisontalPopupPositionPerWidth: 0.5 });
                detailedClosingCostPopup.result.then(function (data) {
                }, function () {
                });
            };
            var vm = this;
            if (wrappedLoan) {
                vm.wrappedLoan = wrappedLoan;
                vm.enums = enums;
                vm.totalAmountValue = vm.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount; //wrappedLoan.getTotalLoanAmount(vm.wrappedLoan.ref); 
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
        /*
        * @Description: Get Loan Officer Adjustment Types
        * containsRequestedConcession - parameter that tells if current adjustments contain Concession with requested status - if true, concessions will be removed from available options
        */
        lockingandpricingController.prototype.getLoanOfficerAdjustmentTypes = function (containsRequestedConcession) {
            var _this = this;
            if (containsRequestedConcession == true) {
                return this.lookups.loAdjustmentTypes.filter(function (adjustmentType) {
                    return adjustmentType.text != "Concession" && _this.loFilter(adjustmentType);
                });
            }
            else {
                return this.lookups.loAdjustmentTypes.filter(function (adjustmentType) {
                    return _this.loFilter(adjustmentType);
                });
            }
        };
        lockingandpricingController.className = "lockingandpricingController";
        lockingandpricingController.$inject = ['wrappedLoan', 'enums', 'modalPopoverFactory', 'NavigationSvc', 'pricingResultsSvc', '$filter', '$state', 'simpleModalWindowFactory', 'lockingPricingService', 'applicationData', 'loanEvent', 'lockingActions'];
        return lockingandpricingController;
    })();
    lockingandpricingadj.lockingandpricingController = lockingandpricingController;
    angular.module('lockingandpricingadj').controller('lockingandpricingController', lockingandpricingController);
})(lockingandpricingadj || (lockingandpricingadj = {}));
//# sourceMappingURL=lockingandpricing.controller.js.map