using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;
using System.Collections.ObjectModel;
using MML.Web.Facade;
using MML.Common;
using Telerik.Web.Mvc.UI;
using MML.Common.Helpers;


namespace MML.Web.LoanCenter.Commands
{
    public class ManageProspectsCommand : ICommand
    {
        #region Members

        public string ViewName
        {
            get;
            private set;
        }

        public dynamic ViewData
        {
            get;
            private set;
        }

        public Dictionary<string, object> InputParameters
        {
            get;
            set;
        }

        public HttpContextBase HttpContext
        {
            get;
            set;
        }

        public DropDownItem ViewAllItem = new DropDownItem()
        {
            Text = "Select One",
            Value = "0"
        };

        #endregion

        #region Execute Command

        public void Execute()
        {
            

            #region Check and convert input parameters

            if ( !InputParameters.ContainsKey( "LoanId" ) )
                throw new ArgumentException( "LoanId value was expected!" );

            if ( !InputParameters.ContainsKey( "ProspectId" ) )
                throw new ArgumentException( "ProspectId value was expected!" );

            

            var user = AccountHelper.GetUserAccount( HttpContext );
            if ( user == null )
                throw new InvalidOperationException( "UserData is null" );

            #endregion

            #region Update title information
            Guid loanId = Guid.Parse( InputParameters[ "LoanId" ].ToString().TrimEnd() );
            Int32 prospectId = Int32.Parse( InputParameters[ "ProspectId" ].ToString().TrimEnd() );
            
            BasicLoanData loan = LoanServiceFacade.RetrieveBasicLoanData( loanId, user.UserAccountId );

            ManageProspectsViewModel model = new ManageProspectsViewModel();
            model.ProspectId = prospectId;
            model.LoanId = loanId;

            if ( loan != null )
            {
                model.CompanyId = loan.CompanyId != Guid.Empty ? loan.CompanyId.ToString() : "0";
                model.ChannelId = loan.ChannelId != null ? ( Int32 )loan.ChannelId : 0;
                model.DivisionId = loan.DivisionId != null ? ( Int32 )loan.DivisionId : 0;
                model.BranchId = loan.BranchId != Guid.Empty ? ( Guid )loan.BranchId : Guid.Empty;
            }
            else
            {
                Contact contactData = ContactServiceFacade.RetrieveContactByContactId( prospectId );
                if ( contactData != null )
                {
                    model.CompanyId = contactData.CompanyProfileId != Guid.Empty ? contactData.CompanyProfileId.ToString() : "0";
                    model.ChannelId = contactData.ChannelId != null ? ( Int32 )contactData.ChannelId : 0;
                    model.DivisionId = contactData.DivisionId != null ? ( Int32 )contactData.DivisionId : 0;
                    model.BranchId = contactData.BranchId != Guid.Empty ? ( Guid )contactData.BranchId : Guid.Empty;
                }
               
            }

           

            

            //var leadSource = ContactServiceFacade.RetrieveLeadSourceByContactIdAndLoanId( prospectId, loanId, user.UserAccountId );
            //model.LeadSourceInformation = leadSource != null ? leadSource.LeadSourceId + " " + leadSource.Description : String.Empty;
            LeadSource hearAboutUs = LoanServiceFacade.RetrieveHearAboutUs( loanId );

            if ( hearAboutUs != null )
            {
                if ( hearAboutUs.AffinityGroup == Contracts.Affiliate.AffinityGroup.PartnersProfiles )
                {
                    if ( hearAboutUs.HBMId != null && hearAboutUs.HBMId != Guid.Empty )
                        model.HearAboutUs = hearAboutUs.LeadSourceId + " Realtor-HBM";
                    else
                        model.HearAboutUs = hearAboutUs.LeadSourceId + " Realtor";
                }
                else
                {
                    model.HearAboutUs = hearAboutUs.LeadSourceId + " " + hearAboutUs.Description;
                }
            }

            model.TitleInformation = ConciergeWorkQueueServiceFacade.ExecuteSPGetBorrowerData( "GetBorrowerData", loanId, user.UserAccountId );          

            #endregion

            #region Update emails

            var emailList = ContactServiceFacade.RetrieveSentEmailItems( prospectId, user.UserAccountId );
            if ( emailList != null && emailList.Count > 0 )
                model.Emails = emailList;

            #endregion

            #region Update Lists



            bool isLoa = false;
            if ( user.Roles != null && user.Roles.Any( r => r.RoleName == RoleName.LoanOfficerAssistant && r.IsActive ) )
                isLoa = true;

            LoadCompanies( model );

            LoadChannels( model );

            LoadDivisions( model );

            LoadBranches( model );

            LoadRelatedConciergeList( model, user, loan, loanId, null, isLoa );

            LoadRelatedLoaList( model, user, loan, loanId, null, isLoa );

            // Get Call Center/Loan Processor Officers
            var callCenterInfos = UserAccountServiceFacade.RetrieveCallCenterInfo();

            if ( callCenterInfos != null )
            {
                callCenterInfos = new Collection<CallCenterInfo>( callCenterInfos.OrderBy( l => l.CallCenterName ).ToList() );
                callCenterInfos.Insert( 0, new CallCenterInfo() { UserAccountId = 0, CallCenterName = "Select One" } );
            }


            model.CallCenterInfoList = new Collection<CallCenterInfo>();
            model.CallCenterInfoList = callCenterInfos;

            #endregion

            #region Get Highest priority role
            if ( user.Roles != null && user.Roles.Count() > 0 )
            {
                var filteredRoles = user.Roles.OrderBy( r => r.RolePriority );
                if ( filteredRoles != null && filteredRoles.FirstOrDefault() != null )
                {
                    var topPriorityRole = filteredRoles.FirstOrDefault().RoleName;
                    var retrievedProspectData = ContactServiceFacade.RetrieveContactProspect( prospectId );

                    if ( retrievedProspectData != null )
                    {
                        model.SelectedStatus = retrievedProspectData.Status.ToString();
                        model.SelectedConcierge = retrievedProspectData.Concierge.ToString();
                        model.SelectedLoa = retrievedProspectData.Loa.ToString();
                        if ( model.CallCenterInfoList.FirstOrDefault( c => c.UserAccountId.Equals( retrievedProspectData.CallCenter ) ) != null )
                        {
                            model.SelectedCallCenter = model.CallCenterInfoList.FirstOrDefault( c => c.UserAccountId.Equals( retrievedProspectData.CallCenter ) ).UserAccountId.ToString();
                        }
                        if ( model.ConciergeInfoList.FirstOrDefault( c => c.UserAccountId.Equals( retrievedProspectData.Concierge ) ) != null )
                        {
                            model.NMLSNumber = model.ConciergeInfoList.FirstOrDefault( c => c.UserAccountId.Equals( retrievedProspectData.Concierge ) ).NMLSNumber;
                        }
                    }
                }
            }
            #endregion

            //TODO: Move this in Lookup
            model.Statuses = new Collection<KeyValuePair<String, String>>();
            foreach ( ContactStatus contactStatus in Enum.GetValues( typeof( ContactStatus ) ) )
            {
                if ( contactStatus != ContactStatus.None )
                    model.Statuses.Add( new KeyValuePair<String, String>( ( ( int )contactStatus ).ToString(),
                        MML.Web.LoanCenter.Helpers.LoanCenterEnumHelper.ContactStatusToString( contactStatus ) ) );
            }

            model.Statuses = new Collection<KeyValuePair<String, String>>( model.Statuses.OrderBy( s => s.Value ).ToList() );

            ViewName = "Commands/_manageprospects";
            ViewData = model;

            if ( HttpContext == null || HttpContext.Session == null )
                throw new NullReferenceException( "Session is empty!" );

            HttpContext.Session[ SessionHelper.ManageProspects ] = model.ToXml();

        }

        #endregion

        private void LoadCompanies( ManageProspectsViewModel manageProspectViewModel )
        {
            if ( manageProspectViewModel.Companies != null )
            {
                manageProspectViewModel.Companies.Clear();
            }
            else
            {
                manageProspectViewModel.Companies = new List<DropDownItem>();
            }



            if ( !manageProspectViewModel.Companies.Any( c => c.Text.Equals( ViewAllItem.Text ) ) )
                manageProspectViewModel.Companies.Add( ViewAllItem );
            if ( !manageProspectViewModel.Channels.Any( ch => ch.Text.Equals( ViewAllItem.Text ) ) )
                manageProspectViewModel.Channels.Add( ViewAllItem );
            if ( !manageProspectViewModel.Divisions.Any( d => d.Text.Equals( ViewAllItem.Text ) ) )
                manageProspectViewModel.Divisions.Add( ViewAllItem );
            if ( !manageProspectViewModel.Branches.Any( b => b.Text.Equals( ViewAllItem.Text ) ) )
                manageProspectViewModel.Branches.Add( ViewAllItem );




            // for administrator role, we need to fetch all companies from the system 
            var companies = MML.Web.Facade.UserAccountServiceFacade.GetAllCompanies();
            if ( companies == null )
                return;
            DropDownItem item = null;
            foreach ( Company c in companies.OrderBy( c => c.Name ) )
            {
                item = new DropDownItem();
                item.Value = c.CompanyId.ToString();
                item.Text = c.Name;
                manageProspectViewModel.Companies.Add( item );
            }

            if ( manageProspectViewModel.CompanyId == null || manageProspectViewModel.CompanyId == "-1" || manageProspectViewModel.CompanyId == "0" || manageProspectViewModel.CompanyId == Guid.Empty.ToString() )
            {

                CompanyProfile companyProfile = CompanyProfileServiceFacade.RetrieveCompanyProfile();
                if ( companyProfile != null )
                    manageProspectViewModel.CompanyId = companyProfile.CompanyProfileId.ToString();


            }



        }

        private void LoadChannels( ManageProspectsViewModel manageProspectViewModel )
        {
            if ( manageProspectViewModel.CompanyId != null && manageProspectViewModel.CompanyId != "-1" && manageProspectViewModel.CompanyId != "0" && manageProspectViewModel.CompanyId != Guid.Empty.ToString() )
            {
                Guid companyId = Guid.Empty;
                companyId = Guid.Parse( manageProspectViewModel.CompanyId );

                var result = UserAccountServiceFacade.GetChannels( companyId );
                if ( result != null )
                    foreach ( Channel channel in result.OrderBy( r => r.Name ) )
                    {
                        manageProspectViewModel.Channels.Add( new DropDownItem()
                        {
                            Text = channel.Name,
                            Value = channel.ChannelId.ToString(),
                            Selected = false
                        } );
                    }
            }

        }

        private void LoadDivisions( ManageProspectsViewModel manageProspectViewModel )
        {
            if ( manageProspectViewModel.ChannelId > 0 )
            {
                var result = UserAccountServiceFacade.GetDivisions( manageProspectViewModel.ChannelId );
                if ( result != null )
                    foreach ( Division division in result.OrderBy( r => r.DivisionName ) )
                    {
                        manageProspectViewModel.Divisions.Add( new DropDownItem()
                        {
                            Text = division.DivisionName,
                            Value = division.DivisionId.ToString(),
                            Selected = false
                        } );
                    }
            }

        }

        private void LoadBranches( ManageProspectsViewModel manageProspectViewModel )
        {
            if ( manageProspectViewModel.DivisionId > 0 )
            {
                var result = UserAccountServiceFacade.GetBranches( manageProspectViewModel.DivisionId );
                if ( result != null )
                    foreach ( Branch branch in result.OrderBy( r => r.Name ) )
                    {
                        manageProspectViewModel.Branches.Add( new DropDownItem()
                        {
                            Text = branch.Name,
                            Value = branch.BranchId.ToString(),
                            Selected = ( branch.BranchId == manageProspectViewModel.BranchId )
                        } );
                    }
            }

        }


        private void LoadRelatedConciergeList( ManageProspectsViewModel manageProspectViewModel, UserAccount user, BasicLoanData loan, Guid loanId, int? contactId = null, Boolean? isLoa = null )
        {

            Guid companyId = Guid.Empty;
            int channelId = 0;
            int divisionId = 0;

            if ( manageProspectViewModel.CompanyId != null && manageProspectViewModel.CompanyId != "-1" && manageProspectViewModel.CompanyId != "0" )
            {

                companyId = Guid.Parse( manageProspectViewModel.CompanyId );
            }

            if ( manageProspectViewModel.ChannelId > 0 )
            {
                channelId = manageProspectViewModel.ChannelId;
            }

            if ( manageProspectViewModel.DivisionId > 0 )
            {
                divisionId = manageProspectViewModel.DivisionId;
            }

            var conciergeList = !WebCommonHelper.LicensingEnabled() ?
            UserAccountServiceFacade.RetrieveConciergeInfo( null, null, null, null, companyId, channelId, divisionId, manageProspectViewModel.BranchId ) :
            UserAccountServiceFacade.RetrieveConciergeInfo( loanId, manageProspectViewModel.ProspectId, isLoa, user.UserAccountId, companyId, channelId, divisionId, manageProspectViewModel.BranchId );

            if ( conciergeList != null )
                conciergeList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            manageProspectViewModel.ConciergeInfoList = conciergeList;



        }

        private void LoadRelatedLoaList( ManageProspectsViewModel manageProspectViewModel, UserAccount user, BasicLoanData loan, Guid loanId, int? contactId = null, Boolean? isLoa = null )
        {
            Guid companyId = Guid.Empty;
            int channelId = 0;
            int divisionId = 0;

            if ( manageProspectViewModel.CompanyId != null && manageProspectViewModel.CompanyId != "-1" && manageProspectViewModel.CompanyId != "0" )
            {

                companyId = Guid.Parse( manageProspectViewModel.CompanyId );
            }

            if ( manageProspectViewModel.ChannelId > 0 )
            {
                channelId = manageProspectViewModel.ChannelId;
            }

            if ( manageProspectViewModel.DivisionId > 0 )
            {
                divisionId = manageProspectViewModel.DivisionId;
            }

            var loaList = UserAccountServiceFacade.RetrieveLOAInfo( companyId, channelId, divisionId, manageProspectViewModel.BranchId, true );

            if ( loaList != null && !loaList.Any( d => d.ConciergeName == "Select One" ) )
                loaList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            manageProspectViewModel.LoaInfoList = loaList;

        }
    }
}
