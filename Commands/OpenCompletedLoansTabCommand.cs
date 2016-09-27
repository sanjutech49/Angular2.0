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
    /// Opens Completed Loans tab showing Completed Loans grid with state that is preserved in session
    /// </summary>
    public class OpenCompletedLoansTabCommand : ICommand
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
            var searchValue = CommonHelper.GetSearchValue( _httpContext );

            CompletedLoansListState completedLoansListState = null;

            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.CompletedLoansListState ] != null ) )
                completedLoansListState = ( CompletedLoansListState )_httpContext.Session[ SessionHelper.CompletedLoansListState ];
            else
                completedLoansListState = new CompletedLoansListState();

            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                userFilterViewModel.FilterContext = FilterContextEnum.CompletedLoans;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel
                                          {
                                              FilterContext = FilterContextEnum.CompletedLoans
                                          };
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";
            // reset Page Number to 1st on Tab change
            if ( !refresh )
                completedLoansListState.CurrentPage = 1;

            UserAccount user;
            if ( _httpContext != null && _httpContext.Session[ SessionHelper.UserData ] != null )
                    user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
                else throw new InvalidOperationException( "UserData is null" );

                var completedLoansViewModel = CompletedLoansDataHelper.RetrieveCompletedLoansViewModel( completedLoansListState,
                        _httpContext.Session[ SessionHelper.UserAccountIds ] != null
                            ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                            : new List<int> { }, user.UserAccountId, searchValue, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId );

            _viewName = "Queues/_completedloans";
            _viewModel = completedLoansViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.CompletedLoansViewModel ] = completedLoansViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CompletedLoansListState ] = completedLoansListState;
            _httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.CompletedLoans;
        }

   }
}