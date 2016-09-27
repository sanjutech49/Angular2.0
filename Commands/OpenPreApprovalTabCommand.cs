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
    /// Opens Pre Approval tab showing PreApproval grid with state that is preserved in session
    /// </summary>
    public class OpenPreApprovalTabCommand : ICommand
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

            PreApprovalListState preApprovalListState = null;

            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.PreApprovalListState ] != null ) )
                preApprovalListState = ( PreApprovalListState )_httpContext.Session[ SessionHelper.PreApprovalListState ];
            else
                preApprovalListState = new PreApprovalListState();

            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                userFilterViewModel.FilterContext = FilterContextEnum.PreApproval;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel
                                          {
                                              FilterContext = FilterContextEnum.PreApproval
                                          };
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";
            // reset Page Number to 1st on Tab change
            if ( !refresh )
                preApprovalListState.CurrentPage = 1;

            UserAccount user = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );

            var preApprovalViewModel = new PreApprovalViewModel();

            preApprovalViewModel = PreApprovalDataHelper.RetrievePreApprovalViewModel( preApprovalListState,
                                                          _httpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                              ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                                                              : new List<int> { }, user.UserAccountId, searchValue,
                                                              userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId);

            _viewName = "Queues/_preapproval";
            _viewModel = preApprovalViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.PreApprovalViewModel ] = preApprovalViewModel.ToXml();
            _httpContext.Session[ SessionHelper.PreApprovalListState ] = preApprovalListState;
            _httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.PreApproval;
        }

   }
}