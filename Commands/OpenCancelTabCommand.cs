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
    /// Opens Pipeline tab showing Pipeline grid with state that is preserved in session
    /// </summary>
    public class OpenCancelTabCommand : ICommand
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

            CancelLoanListState cancelListState;

            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.CancelListState ] != null ) )
                cancelListState = ( CancelLoanListState )_httpContext.Session[ SessionHelper.CancelListState ];
            else
                cancelListState = new CancelLoanListState();

            bool refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";

            // reset Page Number to 1st on Tab change
            if ( !refresh )
                cancelListState.CurrentPage = 1;

            FilterViewModel userFilterViewModel;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                userFilterViewModel.FilterContext = FilterContextEnum.Cancel;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel { FilterContext = FilterContextEnum.Cancel };
            }

            UserAccount user;
            if ( _httpContext != null && _httpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );



            CancelViewModel cancelViewModel = CancelDataHelper.RetrieveCancelViewModel( cancelListState,
                                                                            _httpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                                            ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                                                                            : new List<int> { }, cancelListState.BoundDate, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );

            _viewName = "Queues/_cancel";
            _viewModel = cancelViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.CancelViewModel ] = cancelViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CancelListState ] = cancelListState;
            _httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.Cancelled;
        }
    }
}