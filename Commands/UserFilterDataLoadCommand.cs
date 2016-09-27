using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using System.Web.WebPages.Html;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class UserFilterDataLoadCommand : CommandsBaseUserFilter
    {
        public override void Execute()
        {
            base.Execute();

            bool hasPrivilegeForManagingQueues = ( base.HttpContext.Session[ SessionHelper.PrivilegeForManagingQueues ] is bool && ( bool )base.HttpContext.Session[ SessionHelper.PrivilegeForManagingQueues ] );
            bool hasPrivilegeForManagingAppraisalQueues = ( base.HttpContext.Session[ SessionHelper.DisplayAppraisalQueues ] is bool && ( bool )base.HttpContext.Session[ SessionHelper.DisplayAppraisalQueues ] );
            bool hasPrivilegeForViewQueuesFilter = ( base.HttpContext.Session[ SessionHelper.ViewQueuesFilter ] is bool && ( bool )base.HttpContext.Session[ SessionHelper.ViewQueuesFilter ] );

            FilterViewModel userFilterViewModel = new FilterViewModel();
            userFilterViewModel.CompanyId = Guid.Empty;
            userFilterViewModel.ChannelId = 0;
            userFilterViewModel.DivisionId = 0;
            userFilterViewModel.BranchId = Guid.Empty;
            userFilterViewModel.UserId = 0;

            userFilterViewModel.Users.Clear();
            userFilterViewModel.Users.Add( base.ViewAllItem );

            /* Command processing */
            if ( base.User.Roles.Any( r => r.RoleName.Equals( RoleName.Administrator ) ) || hasPrivilegeForManagingAppraisalQueues || hasPrivilegeForViewQueuesFilter )
            {
                if ( User.Roles.Any( r => r.RoleName.Equals( RoleName.Administrator ) ) || User.Roles.Any( r => r.RoleName.Equals( RoleName.Hvm ) ))
                    HttpContext.Session[ SessionHelper.UserAccountIds ] = null;
                // start filling user filters by loading companies
                LoadCompanies( userFilterViewModel );
            }
            else if ( base.User.Roles.Any( r => r.RoleName.Equals( RoleName.BranchManager ) ) || base.User.Roles.Any( r => r.RoleName.Equals( RoleName.TeamLeader ) ) || hasPrivilegeForManagingQueues )
            {
                // load only related users
                LoadRelatedUsers( userFilterViewModel, base.User );
            }
            else if ( base.User.Roles.Any( r => r.RoleName.Equals( RoleName.LoanOfficer ) ) ||
                     base.User.Roles.Any( r => r.RoleName.Equals( RoleName.Concierge ) ) )
            {
                AddCurrentUserToFilterModel( userFilterViewModel, base.User );
            }
            else if ( base.User.Roles.Any( r => r.RoleName.Equals( RoleName.LoanOfficerAssistant ) ) )
            {
                AddRelatedLoanOfficers( userFilterViewModel, base.User );
            }

            userFilterViewModel.Users = userFilterViewModel.Users.OrderBy( u => u.Text ).ToList();

            base.ViewName = "_userfilter";
            base.ViewData = userFilterViewModel;

            /* Persist new state */
            base.HttpContext.Session[ "FilterViewModel" ] = userFilterViewModel.ToXml();
        }

        private void AddRelatedLoanOfficers( FilterViewModel userFilterViewModel, UserAccount user )
        {
            if ( user != null )
            {
                userFilterViewModel.Users.Clear();

                // add related loan officers to dropdown list
                var relatedUsers = from los in user.RelatedUsers
                                   where los.Roles.Any( r => r.RoleName.Equals( "Loan Officer" ) )
                                   select los;

                foreach ( var relatedUser in relatedUsers )
                {
                    userFilterViewModel.Users.Add( new System.Web.WebPages.Html.SelectListItem()
                    {
                        Text = relatedUser.Party.FirstName + " " + relatedUser.Party.LastName,
                        Value = relatedUser.UserAccountId.ToString(),
                        Selected = ( relatedUser.UserAccountId == userFilterViewModel.UserId )
                    } );
                }

            }
        }

        private void AddCurrentUserToFilterModel( FilterViewModel userFilterViewModel, UserAccount user )
        {
            userFilterViewModel.Users.Clear();
            userFilterViewModel.Users.Add( new SelectListItem()
                {
                    Text = user.Party.FirstName + " " + user.Party.LastName,
                    Value = user.UserAccountId.ToString(),
                    Selected = true
                } );
        }

        private void LoadRelatedUsers( FilterViewModel userFilterViewModel, UserAccount user )
        {
            // for branch manager role, we need to fetch only users who belong to this branch in a company
            // from relatedusers property select LO/Concierge Users
            if ( user != null )
            {
               

                var result = UserAccountServiceFacade.GetUsersFullName( user.BranchId, false );

                var userAccountIdsList = new List<int>();
                userAccountIdsList.Add( user.UserAccountId );

                foreach ( var userAccount in result.OrderBy( r => r.FullName ) )
                {
                    //if ( user.UserAccountId == userAccount.UserAccountId )
                    //    continue;

                    userFilterViewModel.Users.Add( new SelectListItem()
                    {
                        Text = userAccount.FullName,
                        Value = userAccount.UserAccountId.ToString(),
                        Selected = ( userAccount.UserAccountId == userFilterViewModel.UserId )
                    } );

                    if ( userFilterViewModel.UsersForProspect == null )
                        userFilterViewModel.UsersForProspect = new List<SelectListItem>();

                    userFilterViewModel.UsersForProspect.Add( new SelectListItem()
                    {
                        Text = userAccount.FullName,
                        Value = userAccount.UserAccountId.ToString()
                    } );

                    if ( user.UserAccountId != userAccount.UserAccountId )
                        userAccountIdsList.Add( userAccount.UserAccountId );
                }

                // TODO: Refactor:
                // Branch Manager, Team Leader and Division Manager roles filter WQ recoeds by assigned branch(es).
                // For others we filter by users which are currently in selected branch.
                if ( user.Roles.Any( r => r.RoleName.Equals( RoleName.BranchManager ) ) ||
                    user.Roles.Any( r => r.RoleName.Equals( RoleName.TeamLeader ) ) ||
                    user.Roles.Any( r => r.RoleName.Equals( RoleName.DivisionManager ) ) )
                {
                    userAccountIdsList.Clear();
                }

                base.HttpContext.Session[ SessionHelper.UserAccountIds ] = userAccountIdsList;
            }
        }

        private void LoadCompanies( FilterViewModel userFilterViewModel )
        {
            userFilterViewModel.Companies.Clear();

            if ( !userFilterViewModel.Companies.Any( c => c.Text.Equals( base.ViewAllItemGuid.Text ) ) )
                userFilterViewModel.Companies.Add( base.ViewAllItemGuid);
            if ( !userFilterViewModel.Channels.Any( ch => ch.Text.Equals( base.ViewAllItem.Text ) ))
                userFilterViewModel.Channels.Add( base.ViewAllItem );
            if ( !userFilterViewModel.Divisions.Any( d => d.Text.Equals( base.ViewAllItem.Text ) ))
                userFilterViewModel.Divisions.Add( base.ViewAllItem );
            if ( !userFilterViewModel.Branches.Any( b => b.Text.Equals( base.ViewAllItemGuid.Text ) ) )
                userFilterViewModel.Branches.Add( base.ViewAllItemGuid );
            if ( !userFilterViewModel.Users.Any( u => u.Text.Equals( base.ViewAllItem.Text ) ))
                userFilterViewModel.Users.Add( base.ViewAllItem );

            // for administrator role, we need to fetch all companies from the system 
            var companies = MML.Web.Facade.UserAccountServiceFacade.GetAllCompanies();
            if ( companies == null )
                return;

            foreach ( Company c in companies.OrderBy( c => c.Name ) )
            {
                userFilterViewModel.Companies.Add( new SelectListItem()
                {
                    Text = c.Name,
                    Value = c.CompanyId.ToString(),
                    Selected = ( HttpContext.Session[ SessionHelper.CompanyProfileId ] != null && c.CompanyId.Equals( ( Guid )HttpContext.Session[ SessionHelper.CompanyProfileId ] ) )
                } );
            }

            if ( userFilterViewModel.CompanyId == null || userFilterViewModel.CompanyId == Guid.Empty )
            {

                CompanyProfile companyProfile = CompanyProfileServiceFacade.RetrieveCompanyProfile();
                if ( companyProfile != null )
                    userFilterViewModel.CompanyId = companyProfile.CompanyProfileId;


            }

            var resultChannels = UserAccountServiceFacade.GetChannels( userFilterViewModel.CompanyId );
            if ( resultChannels != null )
                foreach ( Channel channel in resultChannels.OrderBy( r => r.Name ) )
                {
                    userFilterViewModel.Channels.Add( new SelectListItem()
                    {
                        Text = channel.Name,
                        Value = channel.ChannelId.ToString(),
                        Selected = false
                    } );
                }
        }
    }
}
