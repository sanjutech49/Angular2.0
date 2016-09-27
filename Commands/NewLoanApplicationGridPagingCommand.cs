using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;
using System.Web.WebPages.Html;

namespace MML.Web.LoanCenter.Commands
{
    public class NewLoanApplicationGridPagingCommand : ICommand
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
            NewLoanApplicationViewModel newLoanApplicationViewModel = null;
            if ( _httpContext.Session[ SessionHelper.NewLoanApplicationViewModel ] != null )
                newLoanApplicationViewModel = new NewLoanApplicationViewModel().FromXml( _httpContext.Session[ SessionHelper.NewLoanApplicationViewModel ].ToString() );
            else
                newLoanApplicationViewModel = new NewLoanApplicationViewModel();

            NewLoanApplicationListState newLoanApplicationListState = null;
            if ( _httpContext.Session[ SessionHelper.NewLoanApplicationListState ] != null )
                newLoanApplicationListState = ( NewLoanApplicationListState )_httpContext.Session[ SessionHelper.NewLoanApplicationListState ];
            else
                newLoanApplicationListState = new NewLoanApplicationListState();

            UserAccount user = null;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            /* parameter processing */
            Int32 newPageNumber = 0;
            if (!InputParameters.ContainsKey("Page"))
                throw new ArgumentException("Page number was expected!");
            else
                newPageNumber = Convert.ToInt32(InputParameters["Page"]);

            newLoanApplicationListState.CurrentPage = newPageNumber;

            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }
            newLoanApplicationViewModel = NewLoanApplicationDataHelper.RetrieveNewApplicationViewModel( newLoanApplicationListState,
                                                          _httpContext.Session[ "UserAccountIds" ] != null
                                                              ? ( List<int> )_httpContext.Session[ "UserAccountIds" ]
                                                              : new List<int> { }, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );

            _viewName = "Queues/_newLoanApplication";
            _viewModel = newLoanApplicationViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.NewLoanApplicationViewModel ] = newLoanApplicationViewModel.ToXml();
            _httpContext.Session[ SessionHelper.NewLoanApplicationListState ] = newLoanApplicationListState;
        }
    }
}