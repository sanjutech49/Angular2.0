using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Common.Helpers;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Commands
{
    /// <summary>
    /// Opens Pending Approval tab showing Pending Approval grid with state that is preserved in session
    /// </summary>
    public class OpenPendingApprovalTabCommand : ICommand
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

            PendingApprovalListState pendingApprovalListState = null;

            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.PendingApprovalListState ] != null ) )
                pendingApprovalListState = ( PendingApprovalListState )_httpContext.Session[ SessionHelper.PendingApprovalListState ];
            else
                pendingApprovalListState = new PendingApprovalListState();

            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                userFilterViewModel.FilterContext = FilterContextEnum.PendingApproval;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel
                                          {
                                              FilterContext = FilterContextEnum.PendingApproval
                                          };
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";
            // reset Page Number to 1st on Tab change
            if ( !refresh )
                pendingApprovalListState.CurrentPage = 1;

            UserAccount user = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );

            var pendingApprovalViewModel = new PendingApprovalViewModel();

            pendingApprovalViewModel = PendingApprovalDataHelper.RetrievePendingApprovalViewModel( pendingApprovalListState,
                                                          _httpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                              ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                                                              : new List<int> { }, user.UserAccountId, searchValue, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId );

            _viewName = "Queues/_pendingapproval";
            _viewModel = pendingApprovalViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.PendingApprovalViewModel ] = pendingApprovalViewModel.ToXml();
            _httpContext.Session[ SessionHelper.PendingApprovalListState ] = pendingApprovalListState;
            _httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.PendingApproval;
        }

   }
}