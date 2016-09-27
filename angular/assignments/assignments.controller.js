var loan;
(function (loan) {
    var AssignmentsController = (function () {
        function AssignmentsController(wrappedLoan, enums, NavigationSvc, $state, $modalInstance, applicationData) {
            var _this = this;
            this.wrappedLoan = wrappedLoan;
            this.enums = enums;
            this.NavigationSvc = NavigationSvc;
            this.$state = $state;
            this.$modalInstance = $modalInstance;
            this.applicationData = applicationData;
            this.isCurrentUserAdmin = false;
            this.isCurrentUserLoOrConcierge = false;
            this.init = function () {
                _this.isCurrentUserAdmin = _.some(_this.applicationData.currentUser.roles, function (role) {
                    return (role.roleName == "Administrator");
                });
                _this.enableDigitalDocsCall = _this.wrappedLoan.ref.enableDigitalDocsCall;
                _this.loanNumber = _this.wrappedLoan.ref.loanNumber;
                _this.losFolderId = _this.wrappedLoan.ref.losFolderId;
                _this.channelId = _this.wrappedLoan.ref.channelId;
                _this.divisionId = _this.wrappedLoan.ref.divisionId;
                _this.branchId = _this.wrappedLoan.ref.branchId;
                _this.conciergeId = _this.wrappedLoan.ref.conciergeId;
                _this.conciergeFullName = _this.wrappedLoan.ref.conciergeFullName;
                _this.salesManagerId = _this.wrappedLoan.ref.salesManagerId;
                _this.teamLeaderId = _this.wrappedLoan.ref.teamLeaderId;
                _this.LOAId = _this.wrappedLoan.ref.loaId;
                _this.LOAFullName = _this.wrappedLoan.ref.loaFullName;
                _this.loanProcessorId = _this.wrappedLoan.ref.callCenterId;
                _this.channels = _this.applicationData.companyProfile.channels;
                _this.getDivisionsByChannelId(_this.channelId);
                _this.getBranchesByDivisionId(_this.divisionId);
                _this.getChannelManager();
                _this.getDivisionManager();
                _this.getBranchManager();
                _this.getConcierges();
                _this.getSalesManagers();
                _this.getTeamLeaders();
                _this.getLOAs();
                _this.getLoanProcessors();
            };
            this.assignValuesFromUserAccount = function (selectedConcierge) {
                if (angular.isDefined(_this.wrappedLoan.ref.loaId) && angular.isDefined(selectedConcierge.loaId)) {
                    if (!_this.wrappedLoan.ref.loaId || _this.wrappedLoan.ref.loaId == -1) {
                        _this.wrappedLoan.ref.loaId = selectedConcierge.loaId;
                        _this.LOAId = selectedConcierge.loaId;
                    }
                }
                if (angular.isDefined(_this.wrappedLoan.ref.callCenterId) && angular.isDefined(selectedConcierge.loanProcessorId)) {
                    if (!_this.wrappedLoan.ref.callCenterId || _this.wrappedLoan.ref.callCenterId == -1) {
                        _this.wrappedLoan.ref.callCenterId = selectedConcierge.loanProcessorId;
                        _this.loanProcessorId = selectedConcierge.loanProcessorId;
                    }
                }
                if (angular.isDefined(_this.wrappedLoan.ref.salesManagerId) && angular.isDefined(selectedConcierge.salesManagerId)) {
                    if (!_this.wrappedLoan.ref.salesManagerId || _this.wrappedLoan.ref.salesManagerId == -1) {
                        _this.wrappedLoan.ref.salesManagerId = selectedConcierge.salesManagerId;
                        _this.salesManagerId = selectedConcierge.salesManagerId;
                    }
                }
                if (angular.isDefined(_this.wrappedLoan.ref.teamLeaderId) && angular.isDefined(selectedConcierge.teamLeaderId)) {
                    if (!_this.wrappedLoan.ref.teamLeaderId || _this.wrappedLoan.ref.teamLeaderId == -1) {
                        _this.wrappedLoan.ref.teamLeaderId = selectedConcierge.teamLeaderId;
                        _this.teamLeaderId = selectedConcierge.teamLeaderId;
                    }
                }
            };
            this.getDivisionsByChannelId = function (channelId) {
                var divisions;
                if (channelId && channelId != -1) {
                    var channel = _.findWhere(_this.applicationData.companyProfile.channels, { channelId: channelId });
                    divisions = channel.divisions;
                }
                _this.divisions = divisions;
            };
            this.getBranchesByDivisionId = function (divisionId) {
                var branches;
                if (divisionId && divisionId != -1) {
                    var division = _.findWhere(_this.divisions, { divisionId: divisionId });
                    branches = division.branches;
                }
                _this.branches = branches;
            };
            this.getChannelManager = function () {
                var channel = _this.getSection(_this.channels, function (channel) {
                    return channel.channelId == _this.channelId;
                });
                if (channel)
                    return _this.getManager(function (m) {
                        return m.userAccountId == channel.channelManagerId;
                    });
            };
            this.getDivisionManager = function () {
                var division = _this.getSection(_this.divisions, function (division) {
                    return division.divisionId == _this.divisionId;
                });
                if (division) {
                    return _this.getManager(function (m) {
                        return m.userAccountId == division.divisionManagerId;
                    });
                }
            };
            this.getBranchManager = function () {
                var branch = _this.getSection(_this.branches, function (branch) {
                    return branch.branchId == _this.branchId;
                });
                if (branch) {
                    return _this.getManager(function (m) {
                        return m.userAccountId == branch.branchManager;
                    });
                }
            };
            this.getSection = function (coll, predicate) {
                return _.find(coll, predicate);
            };
            this.getManager = function (predicate) {
                var managerRetrieved = _.find(_this.loanAssignmentUserAccounts, predicate);
                if (managerRetrieved) {
                    return managerRetrieved.firstName + ' ' + managerRetrieved.lastName;
                }
                return '';
            };
            this.onChannelChange = function () {
                _this.divisionId = 0;
                _this.branchId = 0;
                _this.conciergeId = 0;
                _this.conciergeFullName = '';
                _this.LOAId = 0;
                _this.LOAFullName = '';
                _this.nmlsNumber = undefined;
                _this.getDivisionsByChannelId(_this.channelId);
                _this.getBranchesByDivisionId(_this.divisionId);
                _this.getConcierges();
                _this.getLOAs();
                _this.getChannelManager();
                _this.getDivisionManager();
                _this.getBranchManager();
            };
            this.onDivisionChange = function () {
                _this.branchId = 0;
                _this.conciergeId = 0;
                _this.conciergeFullName = '';
                _this.LOAId = 0;
                _this.LOAFullName = '';
                _this.nmlsNumber = undefined;
                _this.getBranchesByDivisionId(_this.divisionId);
                _this.getConcierges();
                _this.getLOAs();
                _this.getDivisionManager();
                _this.getBranchManager();
            };
            this.onBranchChange = function () {
                _this.conciergeId = 0;
                _this.conciergeFullName = '';
                _this.LOAId = 0;
                _this.LOAFullName = '';
                _this.nmlsNumber = undefined;
                _this.getConcierges();
                _this.getLOAs();
                _this.getBranchManager();
            };
            this.onLOAChange = function () {
                if (_this.LOAId) {
                    var selectedLOA = _this.getUserByAccountId(_this.LOAs, _this.LOAId); //_.find(this.concierges,(user: any) => { return user.userAccountId == this.conciergeId });
                    if (selectedLOA) {
                        _this.LOAFullName = selectedLOA.firstName + ' ' + (selectedLOA.middleName != '' ? (selectedLOA.middleName + " ") : '') + selectedLOA.lastName;
                        _this.wrappedLoan.ref.loaId = _this.LOAId;
                    }
                }
            };
            this.onLoanProcessorChange = function () {
                if (_this.loanProcessorId) {
                    var selectedLoanProcessor = _this.getUserByAccountId(_this.loanProcessors, _this.loanProcessorId); //_.find(this.concierges,(user: any) => { return user.userAccountId == this.conciergeId });
                    if (selectedLoanProcessor) {
                        _this.wrappedLoan.ref.callCenterId = _this.loanProcessorId;
                    }
                }
            };
            this.onConciergeChange = function () {
                if (_this.conciergeId) {
                    var selectedConcierge = _this.getUserByAccountId(_this.concierges, _this.conciergeId); //_.find(this.concierges,(user: any) => { return user.userAccountId == this.conciergeId });
                    if (selectedConcierge) {
                        _this.conciergeFullName = selectedConcierge.firstName + ' ' + (selectedConcierge.middleName != '' ? (selectedConcierge.middleName + " ") : '') + selectedConcierge.lastName;
                        _this.nmlsNumber = selectedConcierge.nmlsNumber;
                        _this.assignValuesFromUserAccount(selectedConcierge);
                    }
                }
            };
            this.getUserByAccountId = function (listOfUsers, userAccountId) {
                if (userAccountId) {
                    return _.find(listOfUsers, function (user) {
                        return user.userAccountId == userAccountId;
                    });
                }
            };
            this.getBranchIdByAccountId = function (listOfUsers, userAccountId) {
                if (userAccountId) {
                    var userAccount = _this.getUserByAccountId(listOfUsers, userAccountId);
                    if (userAccount)
                        return userAccount.branchId;
                }
            };
            this.getUserByBranchId = function (listOfUsers, branchId) {
                if (branchId) {
                    return _.find(listOfUsers, function (user) {
                        return user.branchId == branchId;
                    });
                }
            };
            this.getConcierges = function () {
                var concierges;
                concierges = _.filter(_this.loanAssignmentUserAccounts, function (user) {
                    return user.isActivated == true && user.nmlsNumber != null && user.nmlsNumber != '' && user.nmlsNumber != 'Pending' && _this.isUserStateLicensedForLoan(user) && _.some(user.roles, function (role) {
                        return (role.roleName == "Concierge" || role.roleName == "Loan Officer");
                    });
                });
                if (concierges) {
                    if (_this.branchId && _this.branchId !== '00000000-0000-0000-0000-000000000000')
                        concierges = _.filter(concierges, function (user) {
                            return user.branchId == _this.branchId;
                        });
                    else if (_this.divisionId && _this.divisionId != -1)
                        concierges = _.filter(concierges, function (user) {
                            return user.divisionId == _this.divisionId;
                        });
                    else if (_this.channelId && _this.channelId != -1)
                        concierges = _.filter(concierges, function (user) {
                            return user.channelId == _this.channelId;
                        });
                    _this.concierges = concierges;
                    _this.onConciergeChange();
                }
            };
            this.getSalesManagers = function () {
                _this.salesManagers = _this.retrieveRolesByRoleName(function (user) {
                    return user.isActivated == true && _.some(user.roles, function (role) {
                        return (role.roleName == 'Sales Manager');
                    });
                });
            };
            this.getTeamLeaders = function () {
                _this.teamLeaders = _this.retrieveRolesByRoleName(function (user) {
                    return user.isActivated == true && _.some(user.roles, function (role) {
                        return (role.roleName == 'Team Leader');
                    });
                });
            };
            this.getLoanProcessors = function () {
                _this.loanProcessors = _this.retrieveRolesByRoleName(function (user) {
                    return user.isActivated == true && _.some(user.roles, function (role) {
                        return (role.roleName == 'Loan Processor');
                    });
                });
            };
            this.retrieveRolesByRoleName = function (predicate) {
                var retrievedRoles = _.filter(_this.loanAssignmentUserAccounts, predicate);
                return retrievedRoles.length != 0 ? retrievedRoles : [];
            };
            this.getLOAs = function () {
                _this.LOAs = _this.retrieveRolesByRoleName(function (user) {
                    return user.isActivated == true && _.some(user.roles, function (role) {
                        return (role.roleName == 'Loan Officer Assistant');
                    });
                });
            };
            this.isUserStateLicensedForLoan = function (userAccount) {
                var stateId;
                if (_this.wrappedLoan.ref.getSubjectProperty().stateId)
                    stateId = _this.wrappedLoan.ref.getSubjectProperty().stateId;
                else
                    stateId = 4;
                var userLicensed = _.some(userAccount.licenses, function (license) {
                    return (license.stateId == stateId && (!license.expireDate || new Date(license.expireDate) > new Date()));
                });
                var branchLicensed;
                if (userAccount.branchId) {
                    var userChannel;
                    var userDivision;
                    var userBranch;
                    userChannel = _.find(_this.applicationData.companyProfile.channels, function (channel) {
                        return channel.channelId == userAccount.channelId;
                    });
                    if (userChannel)
                        userDivision = _.find(userChannel.divisions, function (division) {
                            return division.divisionId == userAccount.divisionId;
                        });
                    if (userDivision)
                        userBranch = _.find(userDivision.branches, function (branch) {
                            return branch.branchId == userAccount.branchId;
                        });
                    if (userBranch) {
                        if (_.some(userBranch.licenses, function (license) {
                            return license.stateId == stateId && license.branchId == userAccount.branchId;
                        }))
                            branchLicensed = true;
                    }
                }
                return userLicensed && branchLicensed;
            };
            this.close = function () {
                _this.$modalInstance.dismiss('cancel');
            };
            this.applyChanges = function () {
                var branchIdTemp;
                if (_this.loanNumber && _this.loanNumber != '')
                    _this.wrappedLoan.ref.loanNumber = _this.loanNumber;
                _this.wrappedLoan.ref.conciergeId = _this.conciergeId;
                _this.wrappedLoan.ref.conciergeFullName = _this.conciergeFullName;
                _this.wrappedLoan.ref.salesManagerId = _this.salesManagerId;
                _this.wrappedLoan.ref.teamLeaderId = _this.teamLeaderId;
                _this.wrappedLoan.ref.loaId = _this.LOAId;
                _this.wrappedLoan.ref.loaFullName = _this.LOAFullName;
                _this.wrappedLoan.ref.enableDigitalDocsCall = _this.enableDigitalDocsCall;
                _this.wrappedLoan.ref.losFolderId = _this.losFolderId;
                if (_this.loanProcessorId) {
                    _this.wrappedLoan.ref.callCenterId = _this.loanProcessorId;
                }
                if (_this.conciergeId) {
                    branchIdTemp = _this.getBranchIdByAccountId(_this.loanAssignmentUserAccounts, _this.conciergeId);
                    if (_this.wrappedLoan.ref.branchId == '00000000-0000-0000-0000-000000000000')
                        _this.wrappedLoan.ref.branchId = branchIdTemp;
                }
                else if (_this.LOAId) {
                    branchIdTemp = _this.getBranchIdByAccountId(_this.loanAssignmentUserAccounts, _this.LOAId);
                    if (_this.wrappedLoan.ref.branchId == '00000000-0000-0000-0000-000000000000')
                        _this.wrappedLoan.ref.branchId = branchIdTemp;
                }
                if (_this.channelId && _this.channelId != -1 && _this.divisionId && _this.divisionId != -1 && _this.branchId && _this.branchId !== '00000000-0000-0000-0000-000000000000') {
                    _this.wrappedLoan.ref.channelId = _this.channelId;
                    _this.wrappedLoan.ref.divisionId = _this.divisionId;
                    _this.wrappedLoan.ref.branchId = _this.branchId;
                }
                else if (branchIdTemp) {
                    var userTemp;
                    if (_this.conciergeId)
                        userTemp = _this.getUserByBranchId(_this.concierges, branchIdTemp);
                    else if (_this.LOAId)
                        userTemp = _this.getUserByBranchId(_this.LOAs, branchIdTemp);
                    _this.wrappedLoan.ref.channelId = userTemp.channelId;
                    _this.wrappedLoan.ref.divisionId = userTemp.divisionId;
                }
                _this.applicationData.lookup.currentLoanLicensedStatesForLO = _this.wrappedLoan.ref.getLicencedStates(_this.applicationData);
                _this.saveAll();
                _this.close();
            };
            this.save = function () {
                //call restful service to save here
            };
            this.saveAndClose = function () {
                _this.save();
                _this.close();
            };
            this.saveAll = function () {
                _this.navigationSvc.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan);
            };
            this.isEditable = function () {
                return _this.applicationData.currentUser.hasPrivilege(_this.enums.privileges.EditLoanAssignments);
            };
            this.navigationSvc = NavigationSvc;
            this.loanAssignmentUserAccounts = applicationData.companyEmployees.userAccounts;
            this.init();
        }
        AssignmentsController.className = "AssignmentsController";
        AssignmentsController.$inject = ['wrappedLoan', 'enums', 'NavigationSvc', '$state', '$modalInstance', 'applicationData'];
        return AssignmentsController;
    })();
    loan.AssignmentsController = AssignmentsController;
    angular.module('assignments').controller('AssignmentsController', AssignmentsController);
})(loan || (loan = {}));
//# sourceMappingURL=assignments.controller.js.map