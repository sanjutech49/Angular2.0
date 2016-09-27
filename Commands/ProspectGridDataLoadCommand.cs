using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.WebPages.Html;
using MML.Common;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;
using MML.Common.Helpers;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Commands
{
     
    /// <summary>
    /// Command loads Prospect grid data with default options (Default ContactListState values) if they are not stored in session
    /// </summary>
    public class ProspectGridDataLoadCommand : ICommand
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

            ContactListState contactListState;

            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.ContactListState ] != null ) )
                contactListState = ( ContactListState )_httpContext.Session[ SessionHelper.ContactListState];
            else
                contactListState = new ContactListState();

            FilterViewModel userFilterViewModel;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel].ToString() );
                userFilterViewModel.FilterContext = FilterContextEnum.Contact;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel {FilterContext = FilterContextEnum.Contact};
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";
            // reset Page Number to 1st on Tab change
            if ( !refresh )
                contactListState.CurrentPage = 1;

             UserAccount user = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );

            var isCallCenter = false;
            var userAccountIds = new List<Int32>();

            if ( user.Roles != null )
            {
                var filteredRoles = user.Roles.Where(
                            r => r.RoleName.Equals( RoleName.LoanProcessor ) || r.RoleName.Equals( RoleName.Concierge ) || r.RoleName.Equals( RoleName.LoanOfficerAssistant ) || r.RoleName.Equals( RoleName.Administrator )
                            ).OrderBy( r => r.RolePriority );
                if( filteredRoles != null && filteredRoles.FirstOrDefault() != null)
                {
                    var topPriorityRole = filteredRoles.FirstOrDefault().RoleName;
                    isCallCenter = topPriorityRole.Equals(RoleName.LoanProcessor);
                }
            }

            if ( isCallCenter )
                userAccountIds.Add( user.UserAccountId );
            else
            {
                if ( _httpContext.Session[ SessionHelper.UserAccountIds ] != null )
                {
                    userAccountIds = ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ];
                }
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

            var contactViewModel = new ContactViewModel();

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
            _httpContext.Session[ SessionHelper.ContactViewModel ] = contactViewModel.ToXml();
            _httpContext.Session[ SessionHelper.ContactListState ] = contactListState;
            _httpContext.Session[ SessionHelper.FilterViewModel] = userFilterViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.Prospect;
        }
    }
}
