using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using Telerik.Web.Mvc.UI;
using System.Collections.ObjectModel;

namespace MML.Web.LoanCenter.Commands
{
    public class AssignLoanInfoLoadCommand : ICommand
    {
        // GET: /GetStartedLoadCommand/

        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;

        public DropDownItem ViewAllItem = new DropDownItem()
        {
            Text = "Select One",
            Value = "0"
        };
        

        public string ViewName
        {
            get
            {
                return _viewName;
            }
        }

        public dynamic ViewData
        {
            get
            {
                return _viewModel;
            }
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
  


            //bool hasPrivilegeForManagingQueues = ( base.HttpContext.Session[ SessionHelper.PrivilegeForManagingQueues ] is bool && ( bool )base.HttpContext.Session[ SessionHelper.PrivilegeForManagingQueues ] );

        	if ( !InputParameters.ContainsKey( "LoanId" ) )
                throw new ArgumentException( "LoanId value was expected!" );

            Guid loanId = Guid.Parse( InputParameters[ "LoanId" ].ToString().TrimEnd() );

            UserAccount user = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];

            BasicLoanData loan = LoanServiceFacade.RetrieveBasicLoanData( loanId, user.UserAccountId );

            var assignLoanInfoViewModel = new AssignLoanInfoViewModel {LosFolders = new List<LosFolder>()};
            bool importToLosInProgress = LoanServiceFacade.ImportToFNMInProgress( loanId );
            Boolean userCanChangeLoanNumber = UserAccountServiceFacade.IsUserAuthorizedForAction( user.UserAccountId, ActionCategory.ChangeLoanNumber );

            if ( loan != null )
            {
                assignLoanInfoViewModel = new AssignLoanInfoViewModel
                                                {
                                                    ConciergeId = loan.ConciergeId,
                                                    EnableDigitalDocsCall = loan.EnableDigitalDocsCall,
                                                    LoanId = loan.LoanId,
                                                    LoanNumber = loan.LoanNumber,
                                                    LoaId = loan.LoaId,
                                                    LosFolders = LoanServiceFacade.RetrieveLosFolders( user.UserAccountId ).OrderBy( l => l.FolderName ).ToList(),
                                                    ImportToLosInProgress = importToLosInProgress,
                                                    UserCanChangeLoanNumber = userCanChangeLoanNumber,
                                                    CompanyId = loan.CompanyId != Guid.Empty ? loan.CompanyId.ToString() : "0",
                                                    ChannelId = loan.ChannelId != null ? (Int32)loan.ChannelId : 0,
                                                    DivisionId = loan.DivisionId != null ? (Int32)loan.DivisionId : 0,
                                                    BranchId = loan.BranchId != Guid.Empty ? ( Guid )loan.BranchId : Guid.Empty,
                                                    CallCenterId = loan.CallCenterId
                                                };
            }
                       

        	var losFolder = LoanServiceFacade.RetrieveLosFolder( loanId, user.UserAccountId );

            if ( !String.IsNullOrEmpty( losFolder ) )
            {
                assignLoanInfoViewModel.LosFolder = losFolder;
            }
            else
            {
                String defaultLosFolder = LoanServiceFacade.RetrieveDefaultLosFolder( user.UserAccountId );
                
                if ( !String.IsNullOrEmpty( defaultLosFolder ) )
                {
                    assignLoanInfoViewModel.LosFolder = defaultLosFolder;
                }
            }

            var isLoa = false;
            if ( user.Roles != null && user.Roles.Any( r => r.RoleName == RoleName.LoanOfficerAssistant && r.IsActive ) )
                isLoa = true;

            LoadCompanies( assignLoanInfoViewModel );

            LoadChannels( assignLoanInfoViewModel );

            LoadDivisions( assignLoanInfoViewModel );

            LoadBranches( assignLoanInfoViewModel );

            LoadRelatedConciergeList( assignLoanInfoViewModel, user, loan, loanId, null, isLoa );

            LoadRelatedLoaList( assignLoanInfoViewModel, user, loan, loanId, null, isLoa );

            LoadCallCenterList( assignLoanInfoViewModel, loan );

            if ( user.Roles.Any( r => r.RoleName.Equals( RoleName.Administrator ) ) )
            {
                //base.HttpContext.Session[ SessionHelper.UserAccountIds ] = null;
                // start filling user filters by loading companies
                

              
            }
            else if ( user.Roles.Any( r => r.RoleName.Equals( RoleName.BranchManager ) ) || user.Roles.Any( r => r.RoleName.Equals( RoleName.TeamLeader ) ) )
            {
                // load only related users
                //LoadRelatedUsers( assignLoanInfoViewModel, base.User );

            }

            var currentStep = LoanServiceFacade.RetrieveCurrentActivityNameAndLoanStatus(loanId, user.UserAccountId);

            assignLoanInfoViewModel.EnableDownload = (currentStep != null ? currentStep.PositionIndex > 1 : false);
    
            var urlaDeliveryMethod = new List<DropDownItem>();
            urlaDeliveryMethod.Add( new DropDownItem() { Selected = true, Text = "FannieMae32", Value = "0" } );
            urlaDeliveryMethod.Add( new DropDownItem() { Selected = false, Text = "Mismo23", Value = "1" } );
            assignLoanInfoViewModel.DownloadLink = String.Format( "/Downloader.axd?documentType=urla&loanId={0}&selectedFormatValue=0", _httpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( loanId.ToString(), EncriptionKeys.Default ) ) );
            assignLoanInfoViewModel.UrlaDeliveryMethod = urlaDeliveryMethod;
            if (currentStep != null) assignLoanInfoViewModel.ActivityName = currentStep.ActivityName;

            var leadSourceInformation = LoanServiceFacade.RetrieveHearAboutUs( loanId );

            if ( leadSourceInformation != null )
            {
                if ( leadSourceInformation.AffinityGroup == Contracts.Affiliate.AffinityGroup.PartnersProfiles )
                {
                    if ( leadSourceInformation.HBMId != null && leadSourceInformation.HBMId != Guid.Empty )
                        assignLoanInfoViewModel.LeadSourceInformation = leadSourceInformation.LeadSourceId + " Realtor-HBM";
                    else
                        assignLoanInfoViewModel.LeadSourceInformation = leadSourceInformation.LeadSourceId + " Realtor";
                }
                else
                {
                    assignLoanInfoViewModel.LeadSourceInformation = leadSourceInformation.LeadSourceId + " " + leadSourceInformation.Description;
                }
            }           

            assignLoanInfoViewModel.TitleInformation = ConciergeWorkQueueServiceFacade.ExecuteSPGetBorrowerData( "GetBorrowerData", loanId, user.UserAccountId );

            _viewName = "_assignloaninfo";
            _viewModel = assignLoanInfoViewModel;

            /* Persist new state */
            HttpContext.Session[ SessionHelper.AssignLoanInfo ] = assignLoanInfoViewModel.ToXml();
        }

        private void LoadCompanies( AssignLoanInfoViewModel assignLoanInfoViewModel )
        {
            if ( assignLoanInfoViewModel.Companies != null )
            {
                assignLoanInfoViewModel.Companies.Clear();
            }
            else
            {
                assignLoanInfoViewModel.Companies = new List<DropDownItem>();
            }

            
            
            if ( !assignLoanInfoViewModel.Companies.Any( c => c.Text.Equals( ViewAllItem.Text ) ) )
                assignLoanInfoViewModel.Companies.Add( ViewAllItem );
            if ( !assignLoanInfoViewModel.Channels.Any( ch => ch.Text.Equals( ViewAllItem.Text ) ) )
                assignLoanInfoViewModel.Channels.Add( ViewAllItem );
            if ( !assignLoanInfoViewModel.Divisions.Any( d => d.Text.Equals( ViewAllItem.Text ) ) )
                assignLoanInfoViewModel.Divisions.Add( ViewAllItem );
            if ( !assignLoanInfoViewModel.Branches.Any( b => b.Text.Equals( ViewAllItem.Text ) ) )
                assignLoanInfoViewModel.Branches.Add( ViewAllItem );


           

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
                assignLoanInfoViewModel.Companies.Add(item);
            }

            if ( assignLoanInfoViewModel.CompanyId == null || assignLoanInfoViewModel.CompanyId == "-1" || assignLoanInfoViewModel.CompanyId == "0" || assignLoanInfoViewModel.CompanyId == Guid.Empty.ToString() )
            {

                CompanyProfile companyProfile = CompanyProfileServiceFacade.RetrieveCompanyProfile();
                if ( companyProfile != null )
                assignLoanInfoViewModel.CompanyId = companyProfile.CompanyProfileId.ToString();
                

            }

            
                       
        }

        private void LoadChannels( AssignLoanInfoViewModel assignLoanInfoViewModel )
        {
            if ( assignLoanInfoViewModel.CompanyId != null && assignLoanInfoViewModel.CompanyId != "-1" && assignLoanInfoViewModel.CompanyId != "0" && assignLoanInfoViewModel.CompanyId !=Guid.Empty.ToString())
            {
                Guid companyId = Guid.Empty;
                companyId = Guid.Parse( assignLoanInfoViewModel.CompanyId );

                var result = UserAccountServiceFacade.GetChannels( companyId );
                if ( result != null )
                    foreach ( Channel channel in result.OrderBy( r => r.Name ) )
                    {
                        assignLoanInfoViewModel.Channels.Add( new DropDownItem()
                        {
                            Text = channel.Name,
                            Value = channel.ChannelId.ToString(),
                            Selected = false
                        } );
                    }
            }

        }

        private void LoadDivisions( AssignLoanInfoViewModel assignLoanInfoViewModel )
        {
            if ( assignLoanInfoViewModel.ChannelId > 0 )
            {
                var result = UserAccountServiceFacade.GetDivisions( assignLoanInfoViewModel.ChannelId );
                if ( result != null )
                    foreach ( Division division in result.OrderBy( r => r.DivisionName ) )
                    {
                        assignLoanInfoViewModel.Divisions.Add( new DropDownItem()
                        {
                            Text = division.DivisionName,
                            Value = division.DivisionId.ToString(),
                            Selected = false
                        } );
                    }
            }

        }

        private void LoadBranches( AssignLoanInfoViewModel assignLoanInfoViewModel )
        {
            if ( assignLoanInfoViewModel.DivisionId > 0 )
            {
                var result = UserAccountServiceFacade.GetBranches( assignLoanInfoViewModel.DivisionId );
                if ( result != null )
                    foreach ( Branch branch in result.OrderBy( r => r.Name ) )
                    {
                        assignLoanInfoViewModel.Branches.Add( new DropDownItem()
                        {
                            Text = branch.Name,
                            Value = branch.BranchId.ToString(),
                            Selected = ( branch.BranchId == assignLoanInfoViewModel.BranchId )
                        } );
                    }
            }

        }


        private void LoadRelatedConciergeList( AssignLoanInfoViewModel assignLoanInfoViewModel, UserAccount user, BasicLoanData loan, Guid loanId, int? contactId = null, Boolean? isLoa = null )
        {

            Guid companyId = Guid.Empty;
            int channelId = 0;
            int divisionId = 0;
            
            if (assignLoanInfoViewModel.CompanyId != null && assignLoanInfoViewModel.CompanyId != "-1" && assignLoanInfoViewModel.CompanyId != "0"){
                
                companyId = Guid.Parse( assignLoanInfoViewModel.CompanyId );
            }

            if ( assignLoanInfoViewModel.ChannelId > 0 )
            {
                channelId = assignLoanInfoViewModel.ChannelId;
            }

            if ( assignLoanInfoViewModel.DivisionId > 0 )
            {
                divisionId = assignLoanInfoViewModel.DivisionId;
            }

            var conciergeList = !WebCommonHelper.LicensingEnabled() ?
            UserAccountServiceFacade.RetrieveConciergeInfo( null, null, null, null, companyId, channelId, divisionId, assignLoanInfoViewModel.BranchId ) :
            UserAccountServiceFacade.RetrieveConciergeInfo( loanId, null, isLoa, user.UserAccountId, companyId, channelId, divisionId, assignLoanInfoViewModel.BranchId );

            if ( conciergeList != null )
                conciergeList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            assignLoanInfoViewModel.ConciergeList = conciergeList;
            if ( loan != null )
                assignLoanInfoViewModel.ConciergeNMLS =
                    conciergeList.FirstOrDefault( d => d.UserAccountId.Equals( loan.ConciergeId ) ) != null
                        ? conciergeList.FirstOrDefault( d => d.UserAccountId.Equals( loan.ConciergeId ) ).NMLSNumber
                        : "";


        }

        private void LoadRelatedLoaList( AssignLoanInfoViewModel assignLoanInfoViewModel, UserAccount user, BasicLoanData loan, Guid loanId, int? contactId = null, Boolean? isLoa = null )
        {
            Guid companyId = Guid.Empty;
            int channelId = 0;
            int divisionId = 0;

            if ( assignLoanInfoViewModel.CompanyId != null && assignLoanInfoViewModel.CompanyId != "-1" && assignLoanInfoViewModel.CompanyId != "0" )
            {

                companyId = Guid.Parse( assignLoanInfoViewModel.CompanyId );
            }

            if ( assignLoanInfoViewModel.ChannelId > 0 )
            {
                channelId = assignLoanInfoViewModel.ChannelId;
            }

            if ( assignLoanInfoViewModel.DivisionId > 0 )
            {
                divisionId = assignLoanInfoViewModel.DivisionId;
            }

            var loaList = UserAccountServiceFacade.RetrieveLOAInfo( companyId, channelId, divisionId, assignLoanInfoViewModel.BranchId, true );

            if ( loaList != null && !loaList.Any( d => d.ConciergeName == "Select One" ) )
                loaList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            assignLoanInfoViewModel.LoaList = loaList;

        }

        private void LoadCallCenterList( AssignLoanInfoViewModel assignLoanInfoViewModel, BasicLoanData loan )
        {
            assignLoanInfoViewModel.CallCenterInfoList = new Collection<CallCenterInfo>();
            // Get Call Center/Loan Processor Officers
            var callCenterInfos = UserAccountServiceFacade.RetrieveCallCenterInfo();

            if ( callCenterInfos != null )
            {
                callCenterInfos = new Collection<CallCenterInfo>( callCenterInfos.OrderBy( l => l.CallCenterName ).ToList() );
                callCenterInfos.Insert( 0, new CallCenterInfo() { UserAccountId = 0, CallCenterName = "Select One" } );

                assignLoanInfoViewModel.CallCenterInfoList = callCenterInfos;
            }

            if (loan != null)
            {
                if (loan.CallCenterId != null && loan.CallCenterId != -1)
                {
                    assignLoanInfoViewModel.SelectedCallCenter = assignLoanInfoViewModel.CallCenterInfoList.FirstOrDefault(c => c.UserAccountId.Equals(loan.CallCenterId)).UserAccountId.ToString();
                }
            }
        }

    }
}
