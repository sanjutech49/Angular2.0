using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Models;
using MML.Web.Facade;
using MML.Common;
using System.Text;
using MML.Contracts;
using MML.Common.Helpers;
using System.Configuration;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Commands
{
    public class ConciergeEmbeddedLoadCommand : ICommand
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
            /* TODO: Implement user-friendly error message
            if ( !InputParameters.ContainsKey( "Action" ) )
                throw new ArgumentException( "Action value was expected!" );

            if ( !InputParameters.ContainsKey( "LoanId" ) )
                throw new ArgumentException( "LoanId value was expected!" );

            if ( !InputParameters.ContainsKey( "WorkQueueType" ) )
                throw new ArgumentException( "WorkQueueType value was expected!" );
            */

            if ( InputParameters.ContainsKey( "Action" ) && InputParameters[ "Action" ].ToString() == "Manage Activities" && !AccountHelper.HasPrivilege( PrivilegeName.AccessToActivities, _httpContext.ApplicationInstance.Context ) )
                return;
                           
            Guid loanId = Guid.Empty;
            if ( !Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId ) )
            {
                InputParameters[ "LoanId" ] = EncryptionHelper.DecryptRijndael( InputParameters[ "LoanId" ].ToString(), EncriptionKeys.Default );
                Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId );
                HttpContext.Session[ "LoanId" ] = loanId;
            }

            bool hideHeaders = false;

            if (InputParameters["hideHeader"] != null && InputParameters["hideHeader"].ToString()=="1")
            {

                hideHeaders = true;
            }

            string prospectId = String.Empty;
            if ( InputParameters.ContainsKey( "ProspectId" ) )
                prospectId = InputParameters[ "ProspectId" ].ToString();

            _viewName = "_conciergecommandembedded";

            _viewModel = OpenConciergeCommandEmbedded( InputParameters[ "WorkQueueType" ].ToString(), InputParameters[ "Action" ].ToString(), loanId, prospectId, hideHeaders );
            LeadSource hearAboutUs = LoanServiceFacade.RetrieveHearAboutUs( loanId );
            if ( hearAboutUs != null )
            {
                if ( hearAboutUs.AffinityGroup == Contracts.Affiliate.AffinityGroup.PartnersProfiles )
                {
                    if ( hearAboutUs.HBMId != null && hearAboutUs.HBMId != Guid.Empty )
                        _viewModel.HearAboutUs = hearAboutUs.LeadSourceId + " Realtor-HBM";
                    else
                        _viewModel.HearAboutUs = hearAboutUs.LeadSourceId + " Realtor";
                }
                else
                {
                    _viewModel.HearAboutUs = hearAboutUs.LeadSourceId + " " + hearAboutUs.Description;
                }
            }                
        }

        public ConciergeCommandEmbedded OpenConciergeCommandEmbedded( string workQueueType, string action, Guid loanId, string prospectId, bool hideHeader )
        {
            var user = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];

            if ( action == "DefaultCommand" )
            {
                if ( loanId != Guid.Empty )
                    prospectId = String.Empty;

                if ( workQueueType == "Prospects" )
                {
                    if ( loanId == Guid.Empty )
                        action = "Manage Prospects";
                    else
                        action = "Manage Loan Application";
                }
                else
                {
                    action = "Manage Loan Application";
                }

            }

            String additionalInformation = "";
            if ( action == "Manage Disclosures" )
            {
                var disclosureModel = LoanServiceFacade.RetrieveDisclosureModel(loanId, IdentityManager.GetUserAccountId());

                additionalInformation = GeneralSettingsServiceFacade.RetrieveeSigningVendorIntegrationEnabled() &&
                                        LoanServiceFacade.RetrieveeSigningEnabledForLoan( loanId ) && disclosureModel == DisclosuresModel.eSign
                                            ? "eSigning Room"
                                            : "";
            }

            Int32 tempuserAccount = 0;

            int userAccountId = LoanServiceFacade.RetrieveUserAccountIdByLoanId( loanId, user.UserAccountId );
            UserAccount userAccount = UserAccountServiceFacade.GetUserById( userAccountId );
            if ( userAccount.IsTemporary )
                tempuserAccount = userAccountId;

            string conciergeUrl = GetConciergeUrl( new Guid(), workQueueType, action, loanId, prospectId, tempuserAccount);

            var titleInformation = ConciergeWorkQueueServiceFacade.ExecuteSPGetBorrowerData( "GetBorrowerData", loanId, user.UserAccountId );

            if ( userAccount.IsTemporary )
                titleInformation = "";

            var leadSourceInformation = ContactServiceFacade.RetrieveLeadSourceByContactIdAndLoanId( -1, loanId, user.UserAccountId );
            var leadSourceInfo = String.Empty;
            if ( leadSourceInformation != null )
            {

                if ( leadSourceInformation.AffinityGroup == Contracts.Affiliate.AffinityGroup.PartnersProfiles )
                {
                    if ( leadSourceInformation.HBMId != null && leadSourceInformation.HBMId != Guid.Empty )
                        leadSourceInfo = leadSourceInformation.LeadSourceId + " Realtor HBM";
                    else
                        leadSourceInfo = leadSourceInformation.LeadSourceId + " Realtor";
                }
                else
                {
                    leadSourceInfo = leadSourceInformation.LeadSourceId + " " + leadSourceInformation.Description;
                }                
               
            }
            string title = action;
            switch ( title )
            {
                case "Manage Loan Application":
                    title = "Loan Application";
                    break;
                case "Manage Loan":
                    title = "Loan Details";
                    break;           
                case "Manage Disclosures":
                    title = "Disclosures";
                    break;
                case "Manage Documents":
                    title = "Documents";
                    break;
                case "Manage Appraisal":
                    title = "Appraisal";
                    break;
                case "Manage Activities":
                    title = "Activities";
                    break;
                case "Manage Alerts":
                    title = "Alerts";
                    break;
                case "Manage Credit":
                    title = "Credit";
                    break;

            }

            if ( userAccount.IsTemporary && title == "Loan Application" )
                title = "Create Account";

            return new ConciergeCommandEmbedded() { Title = title, TitleInformation = titleInformation, ConciergeUrl = conciergeUrl, LeadSourceInformation = leadSourceInfo, AdditionalInformation = additionalInformation, HideHeader = hideHeader };
        }

        private string GetConciergeUrl( Guid token, string workQueueType, string action, Guid loanId, string prospectId, Int32 temporaryUserAccountId)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append( ConfigurationManager.AppSettings[ "ConciergeHome" ] );
            sb.Append( "?impersonateUser=1&token=" );
            sb.Append( HttpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( token.ToString(), EncriptionKeys.Default ) ) );           

            sb.Append( "&workQueueType=" );
            sb.Append( workQueueType );

            sb.Append( "&command=" );
            sb.Append( action );

            sb.Append( "&lid=" );
            sb.Append( HttpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( loanId.ToString(), EncriptionKeys.Default ) ) );

            if ( !String.IsNullOrEmpty( prospectId ) )
            {
                sb.Append( "&prospectId=" );
                sb.Append( HttpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( prospectId, EncriptionKeys.Default ) ) );
            }

            sb.Append( "&isEmbeddedInLoanCenter=1" );

            if ( temporaryUserAccountId != 0 )
            {
                sb.Append( "&tempUserAccountId=" );
                sb.Append( HttpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( temporaryUserAccountId.ToString(), EncriptionKeys.Default ) ) );
            }
            
            return sb.ToString();
        }
    }
}
