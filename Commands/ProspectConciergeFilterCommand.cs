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
    public class ProspectConciergeFilterCommand : ICommand
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
            var user = AccountHelper.GetUserAccount( HttpContext );
            ContactListState contactListState;
            if ( _httpContext.Session[ SessionHelper.ContactListState ] != null )
                contactListState = ( ContactListState )_httpContext.Session[ SessionHelper.ContactListState ];
            else
                contactListState = new ContactListState();

            if ( !InputParameters.ContainsKey( "ConciergeFilter" ) )
                throw new ArgumentException( "StatusFilter was expected!" );

            int conciergeFilter = -1;
            if ( !int.TryParse( InputParameters[ "ConciergeFilter" ].ToString(), out conciergeFilter ) )
                conciergeFilter = 0;

            contactListState.ConciergeFilter = conciergeFilter;


            // on date filter change, reset page number
            contactListState.CurrentPage = 1;

            String searchValue = CommonHelper.GetSearchValue( _httpContext );

            ContactViewModel contactViewModel = ContactDataHelper.RetrieveContactViewModel( contactListState,
                                                                                            _httpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                                                                ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                                                                                                : new List<int> { }, user.UserAccountId, _httpContext, searchValue );

            ContactDataHelper contactDataHelper = new ContactDataHelper();
            contactDataHelper.PopulateConciergeFilterList( contactListState, _httpContext, contactViewModel );

            _viewName = "Queues/_contact";
            _viewModel = contactViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.ContactViewModel ] = contactViewModel.ToXml();
            _httpContext.Session[ SessionHelper.ContactListState ] = contactListState;
        }
    }
}