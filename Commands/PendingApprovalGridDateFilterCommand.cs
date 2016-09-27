using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class PendingApprovalGridDateFilterCommand : ICommand
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
            PendingApprovalViewModel pendingApprovalViewModel = null;
            if ( _httpContext.Session[ SessionHelper.PendingApprovalViewModel ] != null )
                pendingApprovalViewModel = new PendingApprovalViewModel().FromXml( _httpContext.Session[ SessionHelper.PendingApprovalViewModel ].ToString() );
            else
                pendingApprovalViewModel = new PendingApprovalViewModel();

            PendingApprovalListState pendingApprovalListState = null;
            if ( _httpContext.Session[ SessionHelper.PendingApprovalListState ] != null )
                pendingApprovalListState = ( PendingApprovalListState )_httpContext.Session[ SessionHelper.PendingApprovalListState ];
            else
                pendingApprovalListState = new PendingApprovalListState();

            UserAccount user = null;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            /* parameter processing */
            if ( !InputParameters.ContainsKey( "ActivityFilter" ) )
                throw new ArgumentException( "ActivityFilter value was expected!" );

            var newActivityFilterValue = ( GridActivityTypeFilter )Enum.Parse( typeof( GridActivityTypeFilter ), InputParameters[ "ActivityFilter" ].ToString() );

            pendingApprovalListState.ActivityType = newActivityFilterValue;
            
            // on date filter change, reset page number
            pendingApprovalListState.CurrentPage = 1;
            
            /* Command processing */
            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }
            pendingApprovalViewModel = PendingApprovalDataHelper.RetrievePendingApprovalViewModel( pendingApprovalListState,
                                                                          _httpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                                              ? (List<int>)
                                                                                _httpContext.Session[ SessionHelper.UserAccountIds ]
                                                                              : new List<int> {},
                                                                          user.UserAccountId, searchValue, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId );

            _viewName = "Queues/_pendingApproval";
            _viewModel = pendingApprovalViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.PendingApprovalViewModel ] = pendingApprovalViewModel.ToXml();
            _httpContext.Session[ SessionHelper.PendingApprovalListState ] = pendingApprovalListState;
        }
    }
}