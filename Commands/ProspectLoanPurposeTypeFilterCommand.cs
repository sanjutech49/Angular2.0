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
    public class ProspectLoanPurposeTypeFilterCommand : ICommand
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
            if ( _httpContext.Session[ "ContactViewModel" ] != null )
                contactViewModel = new ContactViewModel().FromXml( _httpContext.Session[ "ContactViewModel" ].ToString() );
            else
                contactViewModel = new ContactViewModel();

            ContactListState contactListState = null;
            if ( _httpContext.Session[ "ContactListState" ] != null )
                contactListState = ( ContactListState )_httpContext.Session[ "ContactListState" ];
            else
                contactListState = new ContactListState();

            if ( !InputParameters.ContainsKey( "LoanPurposeFilter" ) )
                throw new ArgumentException( "LoanPurposeFilter was expected!" );

            if ( InputParameters[ "LoanPurposeFilter" ].ToString() == "0" )
                contactListState.LoanPurposeFilter = "";
            else
                contactListState.LoanPurposeFilter = InputParameters[ "LoanPurposeFilter" ].ToString();

            UserAccount user = null;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = (UserAccount)_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            
            // on date filter change, reset page number
            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }
            contactListState.CurrentPage = 1;

            contactViewModel = ContactDataHelper.RetrieveContactViewModel( contactListState, _httpContext.Session[ "UserAccountIds" ] != null ? ( List<int> )_httpContext.Session[ "UserAccountIds" ] : new List<int> { }, user.UserAccountId, _httpContext, CommonHelper.GetSearchValue( _httpContext ) );

            _viewName = "Queues/_contact";
            _viewModel = contactViewModel;

            /* Persist new state */
            _httpContext.Session["ContactViewModel"] = contactViewModel.ToXml();
            _httpContext.Session[ "ContactListState" ] = contactListState;
        }
    }
}