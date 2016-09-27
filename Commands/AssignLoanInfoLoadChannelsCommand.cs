using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Contracts;
using MML.Common.Helpers;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using Telerik.Web.Mvc.UI;
using MML.Common;


namespace MML.Web.LoanCenter.Commands
{

    public class AssignLoanInfoLoadChannelsCommand : CommandsBase
    {

        public DropDownItem _viewAllItem = new DropDownItem()
        {
            Text = "Select One",
            Value = "0"
        };
        public override void Execute()
        {
            base.Execute();
            UserAccount user;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ] ).Username == base.HttpContext.User.Identity.Name )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( base.HttpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            AssignLoanInfoViewModel assignLoanInfoViewModel =null;
            if ( ( base.HttpContext!=null) && ( base.HttpContext.Session[ SessionHelper.AssignLoanInfo ] != null ) )
            {
                assignLoanInfoViewModel = new AssignLoanInfoViewModel().FromXml( base.HttpContext.Session[ SessionHelper.AssignLoanInfo ].ToString() );
            }
            else
            {
                // possible state retrieval?
                 assignLoanInfoViewModel = new AssignLoanInfoViewModel();
            }
            
             /* parameter processing */
            Guid companyId = Guid.Empty;
            if ( !InputParameters.ContainsKey( "CompanyId" ) )
                throw new ArgumentException( "CompanyId was expected!" );

            bool channelResetOccurred = false;

            if ( InputParameters[ "CompanyId" ].ToString().Equals( "0" ) || InputParameters[ "CompanyId" ].ToString().Equals( "-1" ) )
                channelResetOccurred = true;
            else
                companyId = Guid.Parse( InputParameters[ "CompanyId" ].ToString() );

            assignLoanInfoViewModel.CompanyId = companyId.ToString();

            assignLoanInfoViewModel.Channels.Clear();
            assignLoanInfoViewModel.Channels.Add( _viewAllItem );
            assignLoanInfoViewModel.ChannelId = 0;

            assignLoanInfoViewModel.Divisions.Clear();
            assignLoanInfoViewModel.Divisions.Add( _viewAllItem );
            assignLoanInfoViewModel.DivisionId = 0;

            assignLoanInfoViewModel.Branches.Clear();
            assignLoanInfoViewModel.Branches.Add( _viewAllItem );
            assignLoanInfoViewModel.BranchId = Guid.Empty;

            assignLoanInfoViewModel.ConciergeList.Clear();
            assignLoanInfoViewModel.ConciergeId = null;


            var isLoa = false;
            if ( user.Roles != null && user.Roles.Any( r => r.RoleName == RoleName.LoanOfficerAssistant && r.IsActive ) )
                isLoa = true;


            /* Command processing */
            Guid _compId;
            Guid.TryParse( assignLoanInfoViewModel.CompanyId, out _compId );


            var conciergeList = !WebCommonHelper.LicensingEnabled() ?
                    UserAccountServiceFacade.RetrieveConciergeInfo( null, null, null, null, _compId, null, null, null ) :
                    UserAccountServiceFacade.RetrieveConciergeInfo( assignLoanInfoViewModel.LoanId, null, isLoa, user.UserAccountId, _compId, null, null, null );

            if ( conciergeList != null && !conciergeList.Any( d => d.ConciergeName == "Select One" ) )
                conciergeList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            assignLoanInfoViewModel.ConciergeList = conciergeList;

            

            var loaList = UserAccountServiceFacade.RetrieveLOAInfo( _compId, null, null, null, true );

            if ( loaList != null && !loaList.Any( d => d.ConciergeName == "Select One" ) )
                loaList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            assignLoanInfoViewModel.LoaList = loaList;

            if ( !channelResetOccurred )
            {
                /* Command processing */
                var result = UserAccountServiceFacade.GetChannels( companyId );
                if ( result != null )
                    foreach ( Channel channel in result.OrderBy(r => r.Name) )
                    {
                        assignLoanInfoViewModel.Channels.Add( new DropDownItem()
                        {
                            Text = channel.Name,
                            Value = channel.ChannelId.ToString(),
                            Selected = false
                        } );
                    }
            }

            ViewName = "_assignloaninfo";
            ViewData = assignLoanInfoViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.AssignLoanInfo ] = assignLoanInfoViewModel.ToXml();
            //base.HttpContext.Session[ SessionHelper.UserAccountIds ] = new List<int>();
        }
        
    }
}
