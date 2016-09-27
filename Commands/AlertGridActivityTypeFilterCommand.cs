using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class AlertGridActivityTypeFilterCommand : ICommand
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
            String searchValue = CommonHelper.GetSearchValue( _httpContext );

            /* State retrieval */
            AlertsViewModel alertsViewModel = null;
            if ( _httpContext.Session[ SessionHelper.AlertViewModel ] != null )
                alertsViewModel = new AlertsViewModel().FromXml( _httpContext.Session[ SessionHelper.AlertViewModel ].ToString() );
            else
                alertsViewModel = new AlertsViewModel();

            AlertsListState alertListState = null;
            if ( _httpContext.Session[ SessionHelper.AlertsListState ] != null )
                alertListState = ( AlertsListState )_httpContext.Session[ SessionHelper.AlertsListState ];
            else
                alertListState = new AlertsListState();

            if ( !InputParameters.ContainsKey( "ActivityTypeFilter" ) )
                throw new ArgumentException( "ActivityTypeFilter was expected!" );

            if ( InputParameters[ "ActivityTypeFilter" ].ToString() == "0" )
                alertListState.ActivityTypeFilter = "";
            else
                alertListState.ActivityTypeFilter = InputParameters[ "ActivityTypeFilter" ].ToString();

            UserAccount user = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )_httpContext.Session[ SessionHelper.UserData ] ).Username == _httpContext.User.Identity.Name )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( _httpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );


            // on date filter change, reset page number
            alertListState.CurrentPage = 1;

            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }

            alertsViewModel = AlertsDataHelper.RetrieveAlertViewModel( alertListState,
                                                                            _httpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                                            ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                                                                            : new List<int> { }, alertListState.BoundDate, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );



            _viewName = "Queues/_alerts";
            _viewModel = alertsViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.AlertViewModel ] = alertsViewModel.ToXml();
            _httpContext.Session[ SessionHelper.AlertsListState ] = alertListState;
        }
    }
}
