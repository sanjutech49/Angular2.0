module loan {

    export class AssignmentsController {
        static className = "AssignmentsController";
        navigationSvc: any;
        state: any;

        loanNumber: any;
        losFolderId: any;
        channelId: any;
        channels: srv.ICollection<srv.IChannelViewModel>;
        divisionId: any;
        divisions: srv.ICollection<srv.IDivisionViewModel>;
        branchId: any;
        branches: srv.ICollection<srv.IBranchViewModel>;
        conciergeId: any;
        conciergeFullName: string;
        concierges: any;
        salesManagerId: number;
        salesManagers: srv.ICollection<srv.IUserAccountViewModel>;
        teamLeaderId: number;
        teamLeaders: srv.ICollection<srv.IUserAccountViewModel>;
        LOAId: any;
        LOAFullName: string;
        LOAs: any;
        loanProcessorId: any;
        loanProcessors: srv.ICollection<srv.IUserAccountViewModel>;
        nmlsNumber: any;
        enableDigitalDocsCall: any;
        isCurrentUserAdmin: boolean = false;
        loanAssignmentUserAccounts: srv.ICollection<srv.IUserAccountViewModel>;

        isCurrentUserLoOrConcierge: boolean = false;
        public static $inject = ['wrappedLoan', 'enums', 'NavigationSvc', '$state', '$modalInstance', 'applicationData'];

        constructor(private wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, public enums, private NavigationSvc,
            private $state, private $modalInstance: angular.ui.bootstrap.IModalServiceInstance, private applicationData) {

            this.navigationSvc = NavigationSvc;
            this.loanAssignmentUserAccounts = applicationData.companyEmployees.userAccounts;
            this.init();
        }

        init = () => {
            this.isCurrentUserAdmin = _.some(this.applicationData.currentUser.roles, function (role: any) { return (role.roleName == "Administrator"); });

            this.enableDigitalDocsCall = this.wrappedLoan.ref.enableDigitalDocsCall;
            this.loanNumber = this.wrappedLoan.ref.loanNumber;
            this.losFolderId = this.wrappedLoan.ref.losFolderId;
            this.channelId = this.wrappedLoan.ref.channelId;
            this.divisionId = this.wrappedLoan.ref.divisionId;
            this.branchId = this.wrappedLoan.ref.branchId;
            this.conciergeId = this.wrappedLoan.ref.conciergeId;
            this.conciergeFullName = this.wrappedLoan.ref.conciergeFullName;
            this.salesManagerId = this.wrappedLoan.ref.salesManagerId;
            this.teamLeaderId = this.wrappedLoan.ref.teamLeaderId;
            this.LOAId = this.wrappedLoan.ref.loaId;
            this.LOAFullName = this.wrappedLoan.ref.loaFullName;
            this.loanProcessorId = this.wrappedLoan.ref.callCenterId;
            this.channels = this.applicationData.companyProfile.channels;
            this.getDivisionsByChannelId(this.channelId);
            this.getBranchesByDivisionId(this.divisionId);
            this.getChannelManager();
            this.getDivisionManager();
            this.getBranchManager();
            this.getConcierges();
            this.getSalesManagers();
            this.getTeamLeaders();
            this.getLOAs();
            this.getLoanProcessors();
        }

        assignValuesFromUserAccount = (selectedConcierge) => {
            if (angular.isDefined(this.wrappedLoan.ref.loaId) && angular.isDefined(selectedConcierge.loaId)) {
                if (!this.wrappedLoan.ref.loaId || this.wrappedLoan.ref.loaId == -1) {
                    this.wrappedLoan.ref.loaId = selectedConcierge.loaId;
                    this.LOAId = selectedConcierge.loaId;
                }
            }
            if (angular.isDefined(this.wrappedLoan.ref.callCenterId) && angular.isDefined(selectedConcierge.loanProcessorId)){
                if (!this.wrappedLoan.ref.callCenterId || this.wrappedLoan.ref.callCenterId == -1) {
                    this.wrappedLoan.ref.callCenterId = selectedConcierge.loanProcessorId;
                    this.loanProcessorId = selectedConcierge.loanProcessorId;
                }
            }
            if (angular.isDefined(this.wrappedLoan.ref.salesManagerId) && angular.isDefined(selectedConcierge.salesManagerId)) {
                if (!this.wrappedLoan.ref.salesManagerId || this.wrappedLoan.ref.salesManagerId == -1) {
                    this.wrappedLoan.ref.salesManagerId = selectedConcierge.salesManagerId;
                    this.salesManagerId = selectedConcierge.salesManagerId;
                }
            }
            if (angular.isDefined(this.wrappedLoan.ref.teamLeaderId) && angular.isDefined(selectedConcierge.teamLeaderId)) {
                if (!this.wrappedLoan.ref.teamLeaderId || this.wrappedLoan.ref.teamLeaderId == -1) {
                    this.wrappedLoan.ref.teamLeaderId = selectedConcierge.teamLeaderId;
                    this.teamLeaderId = selectedConcierge.teamLeaderId;
                }
            }
        }
        getDivisionsByChannelId = (channelId: number) => {
            var divisions: any;
            if (channelId && channelId != -1) {
                var channel: any = _.findWhere(this.applicationData.companyProfile.channels, { channelId: channelId });
                divisions = channel.divisions;
            }
            this.divisions = divisions;
        }

        getBranchesByDivisionId = (divisionId: number) => {
            var branches: any;
            if (divisionId && divisionId != -1) {
                var division: any = _.findWhere(this.divisions, { divisionId: divisionId });
                branches = division.branches;
            }
            this.branches = branches;
        }

        getChannelManager = (): string => {
            var channel = this.getSection(this.channels,(channel: srv.IChannelViewModel) => { return channel.channelId == this.channelId });
            if (channel)
                return this.getManager((m: srv.IUserAccountViewModel) => { return m.userAccountId == channel.channelManagerId });
        }

        getDivisionManager = (): string => {

            var division = this.getSection(this.divisions,(division: srv.IDivisionViewModel) => { return division.divisionId == this.divisionId });
            if (division) {
                return this.getManager((m: srv.IUserAccountViewModel) => { return m.userAccountId == division.divisionManagerId });
            }
        }

        getBranchManager = (): string => {
            
            var branch = this.getSection(this.branches,(branch: srv.IBranchViewModel) => { return branch.branchId == this.branchId });
            if (branch) {
               return this.getManager((m: srv.IUserAccountViewModel) => { return m.userAccountId == branch.branchManager });
            }
        }

        getSection = <T> (coll: srv.ICollection<T>, predicate: lib.IPredicate<any>) => {
            return <T>_.find(coll,predicate);
        }

        getManager = (predicate: lib.IPredicate<any>): string => {

                var managerRetrieved: srv.IUserAccountViewModel = _.find(this.loanAssignmentUserAccounts, predicate);
                if (managerRetrieved) {
                    return managerRetrieved.firstName + ' ' + managerRetrieved.lastName;
                }
            return '';
        }

        onChannelChange = () => {
            this.divisionId = 0;
            this.branchId = 0;
            this.conciergeId = 0;
            this.conciergeFullName = '';
            this.LOAId = 0;
            this.LOAFullName = '';
            this.nmlsNumber = undefined;
            this.getDivisionsByChannelId(this.channelId);
            this.getBranchesByDivisionId(this.divisionId);
            this.getConcierges();
            this.getLOAs();
            this.getChannelManager();
            this.getDivisionManager();
            this.getBranchManager();
        }

        onDivisionChange = () => {
            this.branchId = 0;
            this.conciergeId = 0;
            this.conciergeFullName = '';
            this.LOAId = 0;
            this.LOAFullName = '';
            this.nmlsNumber = undefined;
            this.getBranchesByDivisionId(this.divisionId);
            this.getConcierges();
            this.getLOAs();
            this.getDivisionManager();
            this.getBranchManager();
        }

        onBranchChange = () => {
            this.conciergeId = 0;
            this.conciergeFullName = '';
            this.LOAId = 0;
            this.LOAFullName = '';
            this.nmlsNumber = undefined;
            this.getConcierges();
            this.getLOAs();
            this.getBranchManager();
        }

        onLOAChange = () => {
            if (this.LOAId) {
                var selectedLOA: any = this.getUserByAccountId(this.LOAs, this.LOAId);//_.find(this.concierges,(user: any) => { return user.userAccountId == this.conciergeId });
                if (selectedLOA) {
                    this.LOAFullName = selectedLOA.firstName + ' ' + (selectedLOA.middleName != '' ? (selectedLOA.middleName + " ") : '') + selectedLOA.lastName;
                    this.wrappedLoan.ref.loaId = this.LOAId;
                } 
            }
        }
        onLoanProcessorChange = () => {
            if (this.loanProcessorId) {
                var selectedLoanProcessor: any = this.getUserByAccountId(this.loanProcessors, this.loanProcessorId);//_.find(this.concierges,(user: any) => { return user.userAccountId == this.conciergeId });
                if (selectedLoanProcessor) {
                    this.wrappedLoan.ref.callCenterId = this.loanProcessorId;
                }
            }
        }
        onConciergeChange = () => {
            if (this.conciergeId) {
                var selectedConcierge: any = this.getUserByAccountId(this.concierges, this.conciergeId);//_.find(this.concierges,(user: any) => { return user.userAccountId == this.conciergeId });
                if (selectedConcierge) {
                    this.conciergeFullName = selectedConcierge.firstName + ' ' + (selectedConcierge.middleName != '' ? (selectedConcierge.middleName + " ") : '') + selectedConcierge.lastName;
                    this.nmlsNumber = selectedConcierge.nmlsNumber;
                    this.assignValuesFromUserAccount(selectedConcierge);
                }
            }
        }

        getUserByAccountId = (listOfUsers: any, userAccountId: any) => {
            if (userAccountId) {
                return _.find(listOfUsers,(user: any) => { return user.userAccountId == userAccountId });
            }
        }

        getBranchIdByAccountId = (listOfUsers: any, userAccountId: any) => {
            if (userAccountId) {
                var userAccount = this.getUserByAccountId(listOfUsers, userAccountId)
                if (userAccount)
                    return userAccount.branchId;
            }
        }

        getUserByBranchId = (listOfUsers: any, branchId: any) => {
            if (branchId) {
                return _.find(listOfUsers,(user: any) => { return user.branchId == branchId });
            }
        }

        getConcierges = () => {
            var concierges: any;
            concierges = _.filter(this.loanAssignmentUserAccounts, (user: any) => { return user.isActivated == true && user.nmlsNumber != null && user.nmlsNumber != '' && user.nmlsNumber != 'Pending' && this.isUserStateLicensedForLoan(user) && _.some(user.roles, function (role: any) { return (role.roleName == "Concierge" || role.roleName == "Loan Officer"); }) });

            if (concierges) {
                if (this.branchId && this.branchId !== '00000000-0000-0000-0000-000000000000')
                    concierges = _.filter(concierges,(user: any) => { return user.branchId == this.branchId });
                else if (this.divisionId && this.divisionId != -1)
                    concierges = _.filter(concierges,(user: any) => { return user.divisionId == this.divisionId });
                else if (this.channelId && this.channelId != -1)
                    concierges = _.filter(concierges,(user: any) => { return user.channelId == this.channelId });

                this.concierges = concierges;
                this.onConciergeChange();
            }

        }

        getSalesManagers = (): void => {
            this.salesManagers = this.retrieveRolesByRoleName((user: srv.IUserAccountViewModel) => { return user.isActivated == true && _.some(user.roles, function (role: any) { return (role.roleName == 'Sales Manager'); }) });
        }

        getTeamLeaders = (): void => {
            this.teamLeaders = this.retrieveRolesByRoleName((user: srv.IUserAccountViewModel) => { return user.isActivated == true && _.some(user.roles, function (role: any) { return (role.roleName == 'Team Leader'); }) });
        }

        getLoanProcessors = (): void => {
            this.loanProcessors =  this.retrieveRolesByRoleName((user: srv.IUserAccountViewModel) => { return user.isActivated == true && _.some(user.roles, function (role: any) { return (role.roleName == 'Loan Processor'); }) });
        }

        retrieveRolesByRoleName = (predicate: lib.IPredicate<any>): srv.ICollection<srv.IUserAccountViewModel> => {

            var retrievedRoles: srv.ICollection<srv.IUserAccountViewModel> = _.filter(this.loanAssignmentUserAccounts, predicate);

            return retrievedRoles.length != 0 ? retrievedRoles : [];
        }

        getLOAs = () => {
           this.LOAs = this.retrieveRolesByRoleName((user: srv.IUserAccountViewModel) => { return user.isActivated == true && _.some(user.roles, function (role: any) { return (role.roleName == 'Loan Officer Assistant'); }) });
        }

        isUserStateLicensedForLoan = (userAccount:any) => {
            var stateId;
            if (this.wrappedLoan.ref.getSubjectProperty().stateId)
                stateId = this.wrappedLoan.ref.getSubjectProperty().stateId;
            else
                stateId = 4;
            var userLicensed = _.some(userAccount.licenses, function (license: any) { return (license.stateId == stateId && (!license.expireDate || new Date(license.expireDate) > new Date())); });

            var branchLicensed;
            if (userAccount.branchId) {
                var userChannel;
                var userDivision;
                var userBranch;

                userChannel = _.find(this.applicationData.companyProfile.channels,(channel: any) => { return channel.channelId == userAccount.channelId });
                if (userChannel)
                    userDivision = _.find(userChannel.divisions,(division: any) => { return division.divisionId == userAccount.divisionId });
                if(userDivision)
                    userBranch = _.find(userDivision.branches,(branch: any) => { return branch.branchId == userAccount.branchId });

                if (userBranch) {
                    if (_.some(userBranch.licenses, function (license: any) { return license.stateId == stateId && license.branchId == userAccount.branchId; }))
                        branchLicensed = true;
                }
            }

            return userLicensed && branchLicensed;

        }

        close = (): void => {
            this.$modalInstance.dismiss('cancel');
        }

        applyChanges = () => {
            var branchIdTemp: any;

            if (this.loanNumber && this.loanNumber != '')
                this.wrappedLoan.ref.loanNumber = this.loanNumber;
            this.wrappedLoan.ref.conciergeId = this.conciergeId;
            this.wrappedLoan.ref.conciergeFullName = this.conciergeFullName;
            this.wrappedLoan.ref.salesManagerId = this.salesManagerId;
            this.wrappedLoan.ref.teamLeaderId = this.teamLeaderId;
            this.wrappedLoan.ref.loaId = this.LOAId;
            this.wrappedLoan.ref.loaFullName = this.LOAFullName;
            this.wrappedLoan.ref.enableDigitalDocsCall = this.enableDigitalDocsCall;
            this.wrappedLoan.ref.losFolderId = this.losFolderId;

            if (this.loanProcessorId) {
                this.wrappedLoan.ref.callCenterId = this.loanProcessorId;
            }


            if (this.conciergeId) {
                branchIdTemp = this.getBranchIdByAccountId(this.loanAssignmentUserAccounts, this.conciergeId);
                if (this.wrappedLoan.ref.branchId == '00000000-0000-0000-0000-000000000000')
                    this.wrappedLoan.ref.branchId = branchIdTemp;
            }
            else if (this.LOAId) {
                branchIdTemp = this.getBranchIdByAccountId(this.loanAssignmentUserAccounts, this.LOAId);
                if (this.wrappedLoan.ref.branchId == '00000000-0000-0000-0000-000000000000')
                    this.wrappedLoan.ref.branchId = branchIdTemp;
            }


            if (this.channelId && this.channelId != -1 && this.divisionId && this.divisionId != -1 && this.branchId && this.branchId !== '00000000-0000-0000-0000-000000000000') {
                this.wrappedLoan.ref.channelId = this.channelId;
                this.wrappedLoan.ref.divisionId = this.divisionId;
                this.wrappedLoan.ref.branchId = this.branchId;
            }
            else if (branchIdTemp) {
                var userTemp: any;
                if (this.conciergeId)
                    userTemp = this.getUserByBranchId(this.concierges, branchIdTemp);
                else if (this.LOAId)
                    userTemp = this.getUserByBranchId(this.LOAs, branchIdTemp);

                this.wrappedLoan.ref.channelId = userTemp.channelId;
                this.wrappedLoan.ref.divisionId = userTemp.divisionId;
            }
            this.applicationData.lookup.currentLoanLicensedStatesForLO = this.wrappedLoan.ref.getLicencedStates(this.applicationData);
            this.saveAll();
            this.close();
        }

        save = (): void => {
            //call restful service to save here
        }

        saveAndClose = (): void => {
            this.save();
            this.close();
        }

        saveAll = (): void => {
            this.navigationSvc.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan);
        }
        isEditable = () => {
            return this.applicationData.currentUser.hasPrivilege(this.enums.privileges.EditLoanAssignments);
        }
    }

    angular.module('assignments').controller('AssignmentsController', AssignmentsController);
}