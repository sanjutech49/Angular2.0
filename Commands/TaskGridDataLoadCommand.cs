using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Common.Helpers;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;
using MML.Web.LoanCenter.Helpers.Enums;
namespace MML.Web.LoanCenter.Commands
{
    /// <summary>
    /// Command loads Task grid data with default options (Default OfficerTaskListState values)
    /// </summary>
    public class TaskGridDataLoadCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;

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

        public void Execute()
        {
            /* State retrieval */
            UserAccount user = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );

            OfficerTasksViewModel taskViewModel = null;
            if ( _httpContext.Session[ "OfficerTaskViewModel" ] != null )
                taskViewModel = new OfficerTasksViewModel().FromXml( _httpContext.Session[ "OfficerTaskViewModel" ].ToString() );
            else
                taskViewModel = new OfficerTasksViewModel();

            OfficerTaskListState taskListState = null;
            if ( _httpContext.Session[ "OfficerTaskListState" ] != null )
                taskListState = ( OfficerTaskListState )_httpContext.Session[ "OfficerTaskListState" ];
            else
                taskListState = new OfficerTaskListState();

            // Generate list of user account for retrieveing Tasks since this is the command that loads Task grid for the first time
            List<int> userAccountIds = PopulateUserAccountIdsByUserRole( user );

            var result = TaskServiceFacade.GetTasks( userAccountIds,
                                                    taskListState.BoundDate,
                                                    taskListState.CurrentPage,
                                                    EnumHelper.GetStringValue( taskListState.SortColumn ),
                                                    taskListState.SortDirection,
                                                    user.UserAccountId
                                                    );

            taskViewModel.TaskOwners = PopulateTaskOwners();

            if ( result != null )
            {
                taskViewModel.OfficerTasks = result.OfficerTasks;
                taskViewModel.PageCount = result.TotalPages;
                taskViewModel.TotalItems = result.TotalItems;
                taskViewModel.CurrentPage = taskListState.CurrentPage;
            }

            OfficerTaskGridHelper.ProcessPagingOptions( taskListState, taskViewModel );

            OfficerTaskGridHelper.ApplyClassCollection( taskViewModel );

            _viewName = "_officertask";
            _viewModel = taskViewModel;

            /* Persist new state */
            _httpContext.Session[ "OfficerTaskViewModel" ] = taskViewModel.ToXml();
            _httpContext.Session[ "OfficerTaskListState" ] = taskListState;
            _httpContext.Session[ "UserAccountIds" ] = userAccountIds;
            _httpContext.Session[ "CurrentTab" ] = LoanCenterTab.OfficerTask;
        }

        private List<System.Web.WebPages.Html.SelectListItem> PopulateTaskOwners()
        {
            if ( ( _httpContext != null ) && ( _httpContext.Session[ "FilterViewModel" ] != null ) )
            {
                var filterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ "FilterViewModel" ].ToString() );
                return filterViewModel.Users.Where( item => Convert.ToInt32( item.Value ) > 0 ).ToList();
            }
            else return new List<System.Web.WebPages.Html.SelectListItem>();
        }

        private List<int> PopulateUserAccountIdsByUserRole( UserAccount user )
        {
            List<int> userAccountIds = new List<int>();

            if ( _httpContext.Session[ "UserAccountIds" ] == null )
            {
                if ( user.Roles.Any( r => r.RoleName.Equals( "Administrator" ) ) )
                {
                    userAccountIds.Add( -1 ); // no default users for administrator
                }
                else if ( user.Roles.Any( r => r.RoleName.Equals( "Branch Manager" ) ) )
                {
                    userAccountIds.Add( user.UserAccountId ); // default to branch manager, after that load by user filter
                }
                else if ( user.Roles.Any( r => r.RoleName.Equals( "Loan Officer" ) ) ||
                         user.Roles.Any( r => r.RoleName.Equals( "Concierge" ) ) )
                {
                    userAccountIds.Add( user.UserAccountId ); // default to loan officer
                }
                else if ( user.Roles.Any( r => r.RoleName.Equals( "Loan Officer Assistant" ) ) )
                {
                    // add related loan officers to dropdown list
                    var relatedUsersIds = from los in user.RelatedUsers
                                          where los.Roles.Any( r => r.RoleName.Equals( "Loan Officer" ) || r.RoleName.Equals( "Concierge" ) )
                                          select los.UserAccountId;

                    userAccountIds.AddRange(relatedUsersIds);
                }
            }
            else
            {
                userAccountIds = ( List<int> )_httpContext.Session[ "UserAccountIds" ];
            }

            return userAccountIds;
        }
    }
}