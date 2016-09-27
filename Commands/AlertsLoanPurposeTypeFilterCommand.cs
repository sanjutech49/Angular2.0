using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Commands
{
    public class AlertsLoanPurposeTypeFilterCommand : ICommand
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
            String searchValue = CommonHelper.GetSearchValue(_httpContext);

            AlertsViewModel alertsViewModel = _httpContext.Session[SessionHelper.AlertViewModel] != null ?
                                                              new AlertsViewModel().FromXml(_httpContext.Session[SessionHelper.AlertViewModel].ToString()) :
                                                              new AlertsViewModel();


            AlertsListState alertsListState = _httpContext.Session[SessionHelper.AlertsListState] != null ?
                                                        (AlertsListState)_httpContext.Session[SessionHelper.AlertsListState] :
                                                         new AlertsListState();

            if (!InputParameters.ContainsKey("LoanPurposeFilter"))
                throw new ArgumentException("LoanPurposeFilter was expected!");

            alertsListState.LoanPurposeFilter = InputParameters["LoanPurposeFilter"].ToString() == "0" ? "" : InputParameters["LoanPurposeFilter"].ToString();

            UserAccount user = _httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name
                                   ? (UserAccount) _httpContext.Session[SessionHelper.UserData]
                                   : UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            // on date filter change, reset page number
            alertsListState.CurrentPage = 1;

            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }

            alertsViewModel = AlertsDataHelper.RetrieveAlertViewModel(alertsListState,
                                                                            _httpContext.Session[SessionHelper.UserAccountIds] != null
                                                                            ? (List<int>)_httpContext.Session[SessionHelper.UserAccountIds]
                                                                            : new List<int> { }, alertsListState.BoundDate, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );


            _viewName = "Queues/_alerts";
            _viewModel = alertsViewModel;

            /* Persist new state */
            _httpContext.Session[SessionHelper.AlertViewModel] = alertsViewModel.ToXml();
            _httpContext.Session[SessionHelper.AlertsListState] = alertsListState;
        }
    }
}
