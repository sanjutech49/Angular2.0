using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Common.Helpers;
using MML.Web.LoanCenter.ViewModels;
using System.Web.WebPages.Html;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Commands
{
    /// <summary>
    /// Opens Prospect tab showing Prospect grid with state that is preserved in session (Contact list state, page number reset to 1)
    /// </summary>
    public class OpenProspectTabCommand : ICommand
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


            ContactListState contactListState;

            if ((_httpContext != null) && (_httpContext.Session[SessionHelper.ContactListState] != null))
                contactListState = (ContactListState)_httpContext.Session[SessionHelper.ContactListState];
            else
                contactListState = new ContactListState();

            FilterViewModel userFilterViewModel;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                userFilterViewModel.FilterContext = FilterContextEnum.Contact;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
                userFilterViewModel.FilterContext = FilterContextEnum.Contact;
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";
            // reset Page Number to 1st on Tab change
            if ( !refresh )
                contactListState.CurrentPage = 1;

            UserAccount user;
            if (_httpContext.Session[SessionHelper.UserData] != null)
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException("UserData is null");

            var contactViewData = ContactServiceFacade.RetrieveContactsView( _httpContext.Session[ SessionHelper.UserAccountIds ] != null ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ] : new List<int> { },
                                                                                            contactListState.BoundDate,
                                                                                            contactListState.CurrentPage,
                                                                                            contactListState.SortColumn.GetStringValue(),
                                                                                            contactListState.SortDirection,
                                                                                            user.UserAccountId,
                                                                                            searchValue, contactListState.ContactStatusFilter,
                                                                                            userFilterViewModel.CompanyId,
                                                                                            userFilterViewModel.ChannelId,
                                                                                            userFilterViewModel.DivisionId,
                                                                                            contactListState.LoanPurposeFilter,
                                                                                            userFilterViewModel.BranchId,
                                                                                            contactListState.ConciergeFilter
                                                                                            );

            if ( contactViewData != null && contactViewData.ContactsItems != null && contactViewData.ContactsItems.Count == 0 && contactListState.CurrentPage > 1 )
            {
                contactListState.CurrentPage--;

                if ( _httpContext != null )
                    _httpContext.Session[ SessionHelper.ContactListState ] = contactListState;

                contactViewData = ContactServiceFacade.RetrieveContactsView( (_httpContext != null && _httpContext.Session[ SessionHelper.UserAccountIds ] != null) ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ] : new List<int> { },
                                                                                            contactListState.BoundDate,
                                                                                            contactListState.CurrentPage,
                                                                                            contactListState.SortColumn.GetStringValue(),
                                                                                            contactListState.SortDirection,
                                                                                            user.UserAccountId,
                                                                                            searchValue, contactListState.ContactStatusFilter,
                                                                                            userFilterViewModel.CompanyId,
                                                                                            userFilterViewModel.ChannelId,
                                                                                            userFilterViewModel.DivisionId,
                                                                                            contactListState.LoanPurposeFilter,
                                                                                            userFilterViewModel.BranchId,
                                                                                            contactListState.ConciergeFilter
                                                                                            );
            }

            ContactViewModel contactViewModel = new ContactViewModel();

            if (contactViewData != null)
            {
                contactViewModel.Contacts = contactViewData.ContactsItems;
                contactViewModel.PageCount = contactViewData.TotalPages;
                contactViewModel.TotalItems = contactViewData.TotalItems;

                ContactGridHelper.ProcessPagingOptions(contactListState, contactViewModel);
                ContactGridHelper.ApplyClassCollection( contactViewModel );
            }

            contactViewModel.ProspectLOConciergeList = ContactViewModelHelper.PopulateProspectLoanOfficers( userFilterViewModel, _httpContext );

            // populate prospect statuses
            ContactViewModelHelper.PopulateProspectStatuses(contactViewModel);

            contactViewModel.ProspectStatusList = ContactViewModelHelper.PopulateProspectStatusList( contactViewModel );

            contactViewModel.LoanPurposeList = new List<LoanTransactionType>( Enum.GetValues( typeof( LoanTransactionType ) ).Cast<LoanTransactionType>().Skip( 1 ) );

            ContactDataHelper contactDataHelper = new ContactDataHelper();
            contactDataHelper.PopulateConciergeFilterList( contactListState, _httpContext, contactViewModel );

            _viewName = "Queues/_contact";
            _viewModel = contactViewModel;

            /* Persist new state */
            _httpContext.Session[SessionHelper.ContactViewModel] = contactViewModel.ToXml();
            _httpContext.Session[SessionHelper.ContactListState] = contactListState;
            _httpContext.Session[SessionHelper.FilterViewModel] = userFilterViewModel.ToXml();
            _httpContext.Session[SessionHelper.CurrentTab] = LoanCenterTab.Prospect;
        }
    }
}
