using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class CompletedLoansGridSortingCommand : ICommand
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

            /* State retrieval */
            var completedLoansViewModel = 
                _httpContext.Session[ SessionHelper.CompletedLoansViewModel ] != null ? 
                    new CompletedLoansViewModel().FromXml( _httpContext.Session[ SessionHelper.CompletedLoansViewModel ].ToString() ) : 
                    new CompletedLoansViewModel();

            CompletedLoansListState completedLoansListState;
            if ( _httpContext.Session[ SessionHelper.CompletedLoansListState ] != null )
                completedLoansListState = ( CompletedLoansListState )_httpContext.Session[ SessionHelper.CompletedLoansListState ];
            else
                completedLoansListState = new CompletedLoansListState();

            UserAccount user;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( _httpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            /* parameter processing */
            CompletedLoansAttribute newSortColumn;
            if ( !InputParameters.ContainsKey( "Column" ) )
                throw new ArgumentException( "Column value was expected!" );

            newSortColumn = ( CompletedLoansAttribute )Enum.Parse( typeof( CompletedLoansAttribute ), InputParameters[ "Column" ].ToString() );

            // switch direction
            if ( completedLoansListState.SortColumn == newSortColumn && completedLoansListState.SortDirection == "ASC" )
            {
                completedLoansListState.SortDirection = "DESC";
            }
            else
                completedLoansListState.SortDirection = "ASC";

            completedLoansListState.SortColumn = newSortColumn;
            completedLoansListState.CurrentPage = 1;

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

            var completedLoansViewData = CompletedLoansDataHelper.RetrieveCompletedLoansViewModel( completedLoansListState,
                                                                                _httpContext.Session[ SessionHelper.UserAccountIds ] !=
                                                                                null
                                                                                    ? ( List<int> )
                                                                                      _httpContext.Session[
                                                                                          SessionHelper.UserAccountIds ]
                                                                                    : new List<int> { },
                                                                                user.UserAccountId, searchValue, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId );


            if ( completedLoansViewModel != null )
            {
                completedLoansViewModel.CompletedLoansItems = completedLoansViewData.CompletedLoansItems;
                completedLoansViewModel.PageCount = completedLoansViewData.PageCount;
                completedLoansViewModel.TotalItems = completedLoansViewData.TotalItems;

                CompletedLoansGridHelper.ProcessPagingOptions( completedLoansListState, completedLoansViewModel );
            }


            _viewName = "Queues/_completedloans";
            _viewModel = completedLoansViewModel;
            
            /* Persist new state */
            _httpContext.Session[ SessionHelper.CompletedLoansViewModel ] = completedLoansViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CompletedLoansListState ] = completedLoansListState;
        }
    }
}
