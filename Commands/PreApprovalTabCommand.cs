using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Models;

namespace MML.Web.LoanCenter.Commands
{
    public class PreApprovalTabCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel = null;

        public PreApprovalTabCommand()
        {
            HttpContext = null;
            InputParameters = null;
        }

        public string ViewName
        {
            get { return _viewName; }
        }

        public dynamic ViewData
        {
            get { return _viewModel; }
        }

        public Dictionary<string, object> InputParameters { get; set; }

        public HttpContextBase HttpContext { get; set; }


        public void Execute()
        {
            Guid loanId;
            if ( !Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId ) )
            {
                Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId );
            }

            var prospectId = String.Empty;
            if ( InputParameters.ContainsKey( "ProspectId" ) )
            {
                prospectId = InputParameters[ "ProspectId" ].ToString();
            }

            _viewModel = OpenConciergeCommandEmbedded( InputParameters[ "WorkQueueType" ].ToString(), InputParameters[ "Action" ].ToString(), loanId, prospectId );

            _viewName = "Commands/_loandetails";

        }

        public LoanDetailsModel OpenConciergeCommandEmbedded( string workQueueType, string action, Guid loanId, string prospectId )
        {
            var user = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];

            if ( action == "DefaultCommand" )
            {
                if ( workQueueType == "Prospects" )
                {
                    action = loanId == Guid.Empty ? "Manage Prospects" : "Manage Loan Application";
                }
                else
                {
                    action = "Manage Loan Application";
                }

            }

            String additionalInformation = "";
            if ( action == "Manage Disclosures" )
            {
                additionalInformation = GeneralSettingsServiceFacade.RetrieveeSigningVendorIntegrationEnabled() &&
                                        LoanServiceFacade.RetrieveeSigningEnabledForLoan( loanId )
                                            ? "eSigning Room"
                                            : "";
            }

            var titleInformation = ConciergeWorkQueueServiceFacade.ExecuteSPGetBorrowerData( "GetBorrowerData", loanId, user.UserAccountId );

            LeadSource leadSource = LoanServiceFacade.RetrieveHearAboutUs( loanId );
            string hearAboutUs = string.Empty;
            if ( leadSource != null )
            {
                if ( leadSource.AffinityGroup == Contracts.Affiliate.AffinityGroup.PartnersProfiles )
                {
                    if ( leadSource.HBMId != null && leadSource.HBMId != Guid.Empty )
                        hearAboutUs = leadSource.LeadSourceId + " Realtor-HBM";
                    else
                        hearAboutUs = leadSource.LeadSourceId + " Realtor";
                }
                else
                {
                    hearAboutUs = leadSource.LeadSourceId + " " + leadSource.Description;
                }
            }

            return new LoanDetailsModel { Title = action, TitleInformation = titleInformation, AdditionalInformation = additionalInformation, HearAboutUs = hearAboutUs };
        }
    }
}