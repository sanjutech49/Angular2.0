using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.WebPages.Html;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Commands
{
    public class UserFilterLoadUsersCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel;
        private Dictionary<string, object> _inputParameters;
        private HttpContextBase _httpContext;

        public string ViewName
        {
            get { return _viewName; }
        }

        public dynamic ViewData
        {
            get { return _viewModel; }
        }

        public Dictionary<string, object> InputParameters
        {
            get
            {
                return _inputParameters;
            }
            set
            {
                _inputParameters = value;
            }
        }

        public HttpContextBase HttpContext
        {
            get { return _httpContext; }
            set { _httpContext = value; }
        }

        private static SelectListItem _genericItem = new SelectListItem()
        {
            Text = "(Select One)",
            Value = "-1"
        };

        private static SelectListItem _emptyItem = new SelectListItem()
        {
            Text = " ",
            Value = "0"
        };


        private static SelectListItem _viewAllItem = new SelectListItem()
        {
            Text = "View All",
            Value = "0"
        };

        private static SelectListItem _viewAllItemGuid = new SelectListItem()
        {
            Text = "View All",
            Value = Guid.Empty.ToString()
        };

        public void Execute()
        {
            TraceHelper.Information( TraceCategory.LoanCenter, "UserFilterLoadUsersCommand Execute started!" );

            Stopwatch swatch = Stopwatch.StartNew();

            UserAccount user;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( _httpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
            }

            /* parameter processing */
            Guid branchId = Guid.Empty;
            if ( !InputParameters.ContainsKey( "BranchId" ) )
                throw new ArgumentException( "BranchId was expected!" );

            bool branchesResetOccurred = false;

            if ( InputParameters[ "BranchId" ].ToString() == "0" || InputParameters[ "BranchId" ].ToString().Equals( "-1" ) )
            {
                branchesResetOccurred = true;
                _httpContext.Session[ SessionHelper.BranchId ] = null;
            }
            else
            {

                branchId = Guid.Parse( InputParameters[ "BranchId" ].ToString() );
                _httpContext.Session[ SessionHelper.BranchId ] = branchId;
            }
            
            // select company
            userFilterViewModel.BranchId = branchId;

            userFilterViewModel.Users.Clear();
            userFilterViewModel.Users.Add( _viewAllItem );
            userFilterViewModel.UserId = 0;

            userFilterViewModel.UsersForProspect.Clear();
            userFilterViewModel.UsersForProspect.Add( _emptyItem );

            if ( !branchesResetOccurred )
            {
                /* Command processing */
                var result = UserAccountServiceFacade.GetUsersFullName( branchId, false );

                var usersList = new List<int>();

                foreach ( var userAccount in result.OrderBy(r => r.FullName) )
                {
                    userFilterViewModel.Users.Add( new SelectListItem()
                    {
                        Text = userAccount.FullName,
                        Value = userAccount.UserAccountId.ToString(),
                        Selected = ( userAccount.UserAccountId == userFilterViewModel.UserId )
                    } );

                    userFilterViewModel.UsersForProspect.Add( new SelectListItem()
                        {
                            Text = userAccount.FullName,
                            Value = userAccount.UserAccountId.ToString()
                        } );

                    usersList.Add( userAccount.UserAccountId );
                }

              

                _httpContext.Session[ SessionHelper.UserAccountIds ] = usersList;
            }
            else
            {
                bool hasPrivilegeForManagingQueues = ( _httpContext.Session[ SessionHelper.PrivilegeForManagingQueues ] is bool && ( bool )_httpContext.Session[ SessionHelper.PrivilegeForManagingQueues ] );

                if ( user.Roles != null && !user.Roles.Any( r => r.RoleName.Equals( RoleName.Administrator ) ) && 
                    !user.Roles.Any( r => r.RoleName.Equals( RoleName.BranchManager ) ) && 
                    !user.Roles.Any( r => r.RoleName.Equals( RoleName.TeamLeader ) ) &&
                     !user.Roles.Any( r => r.RoleName.Equals( RoleName.DivisionManager ) ) &&
                    !hasPrivilegeForManagingQueues )
                {
                    // Show only records where user is assigned to (either if it's as LO/Concierge, LOA or Loan Processor )
                    _httpContext.Session[ SessionHelper.UserAccountIds ] = new List<int> { user.UserAccountId };
                }
                else
                {
                    // Don't filter result list
                    _httpContext.Session[ SessionHelper.UserAccountIds ] = null;
                }
            }
     
            _viewName = "_userfilter";
            _viewModel = userFilterViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();

            swatch.Stop();
            TraceHelper.Information( TraceCategory.LoanCenter, "UserFilterLoadUsersCommand Execute completed! Time elapsed (ms): " + swatch.ElapsedMilliseconds );
        }
    }
}
