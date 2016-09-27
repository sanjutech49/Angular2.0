using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Helpers.SystemAdmin;
using MML.Web.LoanCenter.Models;
using MML.Web.Facade;
using MML.Common;
using System.Text;
using MML.Contracts;
using MML.Common.Helpers;
using System.Configuration;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Commands
{
    public class LoanDetailsSectionLoadCommand : ICommand
    {
        #region Members

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

        #endregion

        public void Execute()
        {
            Guid loanId = Guid.Empty;
            if ( !Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId ) )
            {
                InputParameters[ "LoanId" ] = EncryptionHelper.DecryptRijndael( InputParameters[ "LoanId" ].ToString(), EncriptionKeys.Default );
                Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId );
            }

            Int32 prospectId = 0;
            Int32.TryParse( InputParameters[ "ProspectId" ].ToString(), out prospectId );

            UserAccount user = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );

            bool collapseSection = true;
            if ( InputParameters.ContainsKey( "CollapseSection" ) && InputParameters[ "CollapseSection" ].ToString() == "1" )
                collapseSection = false;

            _viewName = "_loandetailsandcontactinfo";
            _viewModel = GetLoanDetails( loanId, prospectId, user, collapseSection );
        }

        private LoanDetailsViewModel GetLoanDetails( Guid loanId, int prospectId, UserAccount user, bool collapseSection )
        {
            var tempDetails = LoanServiceFacade.RetrieveWorkQueueItemDetails( loanId, prospectId, -1 );

            LoanDetailsViewModel loanDetails = new LoanDetailsViewModel();

            string emptyField = "-";

            if ( tempDetails != null )
            {
                CommonHelper.RetreiveContactDetailsFromWorkQueueItemDetails( tempDetails, loanDetails, user, emptyField );
                CommonHelper.RetreiveLoanDetailsFromWorkQueueItemDetails( tempDetails, loanDetails, user, emptyField );
            }

            loanDetails.TitleInformation = ConciergeWorkQueueServiceFacade.ExecuteSPGetBorrowerData( "GetBorrowerData", loanId, user.UserAccountId );

            // var leadSourceInformation = ContactServiceFacade.RetrieveLeadSourceByContactIdAndLoanId( prospectId, loanId, user.UserAccountId );
            //if ( leadSourceInformation != null )
            //    loanDetails.LeadSourceInformation = leadSourceInformation.LeadSourceId + " " + leadSourceInformation.Description;

            LeadSource hearAboutUs = LoanServiceFacade.RetrieveHearAboutUs( loanId );
            if ( hearAboutUs != null )
            {
                if ( hearAboutUs.AffinityGroup == Contracts.Affiliate.AffinityGroup.PartnersProfiles )
                {
                    if ( hearAboutUs.HBMId != null && hearAboutUs.HBMId != Guid.Empty )
                        loanDetails.HearAboutUs = hearAboutUs.LeadSourceId + " Realtor-HBM";
                    else
                        loanDetails.HearAboutUs = hearAboutUs.LeadSourceId + " Realtor";
                }
                else
                {
                    loanDetails.HearAboutUs = hearAboutUs.LeadSourceId + " " + hearAboutUs.Description;
                }
            }

            //List<BusinessContact> contacts = BusinessContactServiceFacade.RetrieveBusinessContacts( loanId );
            List<BusinessContact> contacts = BusinessContactServiceFacade.RetrieveBusinessContactsAppraisal( loanId );
            loanDetails.Contacts = GetDisplayInformation( contacts );
            loanDetails.LoanId = loanId;
            loanDetails.CollapseDetails = collapseSection;

            _httpContext.Session[ SessionHelper.CurrentLoanIdForBusinessContact ] = loanId;

            if ( loanDetails.Contacts.FirstOrDefault( x => x.BusinessContactCategory == BusinessContactCategory.BuyerAgent ) != null )
                _httpContext.Session[ SessionHelper.CurrentBusinessContactBuyerAgent ] = loanDetails.Contacts.FirstOrDefault( x => x.BusinessContactCategory == BusinessContactCategory.BuyerAgent ).CompanyName;
            else
                _httpContext.Session[ SessionHelper.CurrentBusinessContactBuyerAgent ] = String.Empty;

            if ( loanDetails.Contacts.FirstOrDefault( x => x.BusinessContactCategory == BusinessContactCategory.SellerAgent ) != null )
                _httpContext.Session[ SessionHelper.CurrentBusinessContactSellerAgent ] = loanDetails.Contacts.FirstOrDefault( x => x.BusinessContactCategory == BusinessContactCategory.SellerAgent ).CompanyName;
            else
                _httpContext.Session[ SessionHelper.CurrentBusinessContactSellerAgent ] = String.Empty;
            Dictionary<string, string> parameters = new Dictionary<string, string>() ;

            parameters.Add( "contactType", "-1" );
            parameters.Add( "activeInactive", "null" );
            parameters.Add( "searchString", "Search" );
            parameters.Add( "currentPage", "1" );
            parameters.Add( "pageSize", "10" );
            parameters.Add( "requestMultiplePages", "null" );
            parameters.Add( "getNextPages", "null" );
            parameters.Add( "hasChildren", "null" );
            parameters.Add( "loanId", loanId.ToString() );

            loanDetails.LoanCompaniesAndContactsModel = ContactHelper.GetLoanCompaniesAndContacts( HttpContext, parameters );

            return loanDetails;
        }

        private List<BusinessContact> GetDisplayInformation( List<BusinessContact> businessContacts )
        {
            if ( businessContacts == null )
                throw new ArgumentNullException( "businessContacts", "businessContacts list is null." );

            string nameFormat = "{0} {1}";
            foreach ( BusinessContact contact in businessContacts )
            {
                if ( contact.BusinessContactCategory == BusinessContactCategory.Seller && contact.SellerType != SellerType.Individual )
                    contact.DisplayContactName = contact.CompanyContactName;
                else
                    contact.DisplayContactName = string.Format( nameFormat, contact.FirstName, contact.LastName );
            }
            return businessContacts;
        }
    }
}