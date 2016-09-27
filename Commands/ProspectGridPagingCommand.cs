using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;
using System.Web.WebPages.Html;

namespace MML.Web.LoanCenter.Commands
{
    public class ProspectGridPagingCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel;
        private Dictionary<string, object> _inputParameters;
        private HttpContextBase _httpContext;

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


            ContactListState contactListState;
            if (_httpContext.Session[SessionHelper.ContactListState] != null)
                contactListState = (ContactListState)_httpContext.Session[SessionHelper.ContactListState];
            else
                contactListState = new ContactListState();

            UserAccount user;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = (UserAccount)_httpContext.Session[SessionHelper.UserData];
            else
                user = UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            /* parameter processing */
            Int32 newPageNumber;
            if (!InputParameters.ContainsKey("Page"))
                throw new ArgumentException("Page number was expected!");
            else
                newPageNumber = Convert.ToInt32(InputParameters["Page"]);

            contactListState.CurrentPage = newPageNumber;

            /* Command processing */
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
                                                                                            
            

            ContactViewModel contactViewModel = new ContactViewModel();

            if ( contactViewData != null )
            {
                contactViewModel.Contacts = contactViewData.ContactsItems;
                contactViewModel.PageCount = contactViewData.TotalPages;
                contactViewModel.TotalItems = contactViewData.TotalItems;
                ContactGridHelper.ApplyClassCollection( contactViewModel );
                ContactGridHelper.ProcessPagingOptions( contactListState, contactViewModel );
            }

            contactViewModel.ProspectLOConciergeList = ContactViewModelHelper.PopulateProspectLoanOfficers( userFilterViewModel, _httpContext );

            // populate prospect statuses
            ContactViewModelHelper.PopulateProspectStatuses( contactViewModel );

            contactViewModel.ProspectStatusList = ContactViewModelHelper.PopulateProspectStatusList( contactViewModel );

            contactViewModel.LoanPurposeList = new List<LoanTransactionType>( Enum.GetValues( typeof( LoanTransactionType ) ).Cast<LoanTransactionType>().Skip( 1 ) );

            ContactDataHelper contactDataHelper = new ContactDataHelper();
            contactDataHelper.PopulateConciergeFilterList( contactListState, _httpContext, contactViewModel );

            _viewName = "Queues/_contact";
            _viewModel = contactViewModel;

            /* Persist new state */
            _httpContext.Session[SessionHelper.ContactViewModel] = contactViewModel.ToXml();
            _httpContext.Session[SessionHelper.ContactListState] = contactListState;
            _httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.Prospect;
        }
       
    }
}
