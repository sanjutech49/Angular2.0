using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class ContactDataHelper
    {
        public static ContactViewModel RetrieveContactViewModel( ContactListState contactListState, List<Int32> userAccountIds, Int32 userId, HttpContextBase httpContext, string searchValue = "" )
        {
            FilterViewModel userFilterViewModel = null;
            if ( ( httpContext != null ) && ( httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
               
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
              
            }
            
            var contactViewData = ContactServiceFacade.RetrieveContactsView( userAccountIds,
                         contactListState.BoundDate,
                         contactListState.CurrentPage,
                         contactListState.SortColumn.GetStringValue(),
                         contactListState.SortDirection,
                         userId, 
                         searchValue, 
                         contactListState.ContactStatusFilter,
                         userFilterViewModel.CompanyId,
                         userFilterViewModel.ChannelId,
                         userFilterViewModel.DivisionId,
                         contactListState.LoanPurposeFilter,
                         userFilterViewModel.BranchId,
                         contactListState.ConciergeFilter
                         );

            if ( contactViewData == null )
            {
                contactViewData = new ContactViewData { ContactsItems = new List<ContactViewItem>(), TotalItems = 0, TotalPages = 0 };
            }
            // Set paging numbers
            else if ( userAccountIds.Any() )
            {
                contactViewData.TotalItems = contactViewData.TotalItems;
                contactViewData.TotalPages = contactViewData.TotalItems / 10;
                if ( ( contactViewData.TotalItems % 10 ) != 0 )
                    contactViewData.TotalPages++;
            }

            var contactViewModel = new ContactViewModel()
                                                    {
                                                        Contacts = contactViewData.ContactsItems,
                                                        PageCount = contactViewData.TotalPages,
                                                        TotalItems = contactViewData.TotalItems,
                                                        ProspectLO = PopulateProspectLoanOfficers(httpContext),
                                                        ProspectLOConciergeList = PopulateLoanOfficersForProspectDropdown( httpContext )
                                                    };


            ContactGridHelper.ProcessPagingOptions( contactListState, contactViewModel );
            ContactViewModelHelper.PopulateProspectStatuses( contactViewModel );
            ContactGridHelper.ApplyClassCollection( contactViewModel );

            contactViewModel.ProspectStatusList = ContactViewModelHelper.PopulateProspectStatusList( contactViewModel );

            contactViewModel.LoanPurposeList = new List<LoanTransactionType>( Enum.GetValues( typeof( LoanTransactionType ) ).Cast<LoanTransactionType>().Skip( 1 ) );

            ContactDataHelper contactDataHelper = new ContactDataHelper();
            contactDataHelper.PopulateConciergeFilterList( contactListState, httpContext, contactViewModel );

            return contactViewModel;
        }

        private static List<System.Web.WebPages.Html.SelectListItem> PopulateProspectLoanOfficers( HttpContextBase httpContext )
        {
            if ( ( httpContext != null ) && ( httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                var filterViewModel = new FilterViewModel().FromXml( httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                return filterViewModel.Users.Where( item => Convert.ToInt32( item.Value ) > 0 ).ToList();
            }
            
            return new List<System.Web.WebPages.Html.SelectListItem>();
        }

        private static List<System.Web.WebPages.Html.SelectListItem> PopulateLoanOfficersForProspectDropdown( HttpContextBase httpContext )
        {
            if ( ( httpContext != null ) && ( httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                var filterViewModel = new FilterViewModel().FromXml( httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                return filterViewModel.UsersForProspect.ToList();
            }

            return new List<System.Web.WebPages.Html.SelectListItem>();
        }

        public void PopulateConciergeFilterList( ContactListState contactListState, HttpContextBase httpContext, ContactViewModel contactViewModel )
        {
            FilterViewModel userFilterViewModel;
            if ( httpContext != null && httpContext.Session[ SessionHelper.FilterViewModel ] != null )
            {
                userFilterViewModel = new FilterViewModel().FromXml( httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                userFilterViewModel.FilterContext = FilterContextEnum.Contact;
            }
            else
            {
                userFilterViewModel = new FilterViewModel();
                userFilterViewModel.FilterContext = FilterContextEnum.Contact;
            }

            var conciergeList = UserAccountServiceFacade.RetrieveConciergeInfo( null, null, null, null, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId );
            if ( conciergeList != null )
                conciergeList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Pending", UserAccountId = 0 } );

            var conciergeFilterList = new List<System.Web.WebPages.Html.SelectListItem>();
            foreach ( var c in conciergeList )
            {
                if ( conciergeFilterList.Any( cl => cl.Value == c.UserAccountId.ToString() ) )
                    continue;
                conciergeFilterList.Add(new System.Web.WebPages.Html.SelectListItem() { Value = c.UserAccountId.ToString(), Text = (String.IsNullOrWhiteSpace(c.ConciergeName) ? "Unknown!" : c.ConciergeName), Selected = contactListState.ConciergeFilter == c.UserAccountId });
            }

            contactViewModel.ProspectConciergeFilterList = conciergeFilterList;
        }
    }
}
