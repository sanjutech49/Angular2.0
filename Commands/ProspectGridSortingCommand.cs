using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Common.Helpers;
using System.Web.WebPages.Html;

namespace MML.Web.LoanCenter.Commands
{
    public class ProspectGridSortingCommand : ICommand
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
            ContactViewModel contactViewModel = null;
            if (_httpContext.Session["ContactViewModel"] != null)
                contactViewModel = new ContactViewModel().FromXml(_httpContext.Session["ContactViewModel"].ToString());
            else
                contactViewModel = new ContactViewModel();

            ContactListState contactListState = null;
            if (_httpContext.Session["ContactListState"] != null)
                contactListState = (ContactListState)_httpContext.Session["ContactListState"];
            else
                contactListState = new ContactListState();

            UserAccount user = null;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = (UserAccount)_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            /* parameter processing */
            ContactViewAttribute newSortColumn;
            if (!InputParameters.ContainsKey("Column"))
                throw new ArgumentException("Column value was expected!");
            else
                newSortColumn = (ContactViewAttribute)Enum.Parse(typeof(ContactViewAttribute), InputParameters["Column"].ToString());

            // switch direction
            if (contactListState.SortColumn == newSortColumn)
            {
                if (contactListState.SortDirection == "DESC")
                    contactListState.SortDirection = "ASC";
                else
                    contactListState.SortDirection = "DESC";
            }
            else if ( String.IsNullOrEmpty( contactListState.SortDirection ) )
            {
                contactListState.SortDirection = "DESC";
            }

            contactListState.SortColumn = newSortColumn;
            
            String searchValue = CommonHelper.GetSearchValue( _httpContext );

            /* Command processing */
            contactViewModel = ContactDataHelper.RetrieveContactViewModel( contactListState, _httpContext.Session[ "UserAccountIds" ] != null ? ( List<int> )_httpContext.Session[ "UserAccountIds" ] : new List<int> { }, user.UserAccountId, _httpContext, searchValue );

            _viewName = "Queues/_contact";
            _viewModel = contactViewModel;

            /* Persist new state */
            _httpContext.Session["ContactViewModel"] = contactViewModel.ToXml();
            _httpContext.Session["ContactListState"] = contactListState;
        }
    }
}