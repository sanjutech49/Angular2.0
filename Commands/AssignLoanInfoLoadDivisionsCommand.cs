using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;
using MML.Common.Helpers;
using MML.Web.Facade;
using Telerik.Web.Mvc.UI;
using MML.Common;
using MML.Contracts;

namespace MML.Web.LoanCenter.Commands
{
    public class AssignLoanInfoLoadDivisionsCommand : CommandsBase
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

            AssignLoanInfoViewModel assignLoanInfoViewModel = null;
            if ( ( base.HttpContext != null ) && ( base.HttpContext.Session[ SessionHelper.AssignLoanInfo ] != null ) )
            {
                assignLoanInfoViewModel = new AssignLoanInfoViewModel().FromXml( base.HttpContext.Session[ SessionHelper.AssignLoanInfo ].ToString() );
            }
            else
            {
                // possible state retrieval?
                assignLoanInfoViewModel = new AssignLoanInfoViewModel();
            }

            /* parameter processing */
            Int32 channelId = 0;
            if ( !InputParameters.ContainsKey( "ChannelId" ) )
                throw new ArgumentException( "ChannelId was expected!" );

            bool divisionResetOccurred = false;

            if ( InputParameters[ "ChannelId" ].ToString() == "0" || InputParameters[ "ChannelId" ].ToString() == "-1" )
                divisionResetOccurred = true;
            else
                channelId = Int32.Parse( InputParameters[ "ChannelId" ].ToString() );

            assignLoanInfoViewModel.ChannelId = channelId;

            assignLoanInfoViewModel.Divisions.Clear();
            assignLoanInfoViewModel.Divisions.Add(_viewAllItem);
            assignLoanInfoViewModel.DivisionId = 0;

            assignLoanInfoViewModel.Branches.Clear();
            assignLoanInfoViewModel.Branches.Add(_viewAllItem);
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
                    UserAccountServiceFacade.RetrieveConciergeInfo( null, null, null, null, _compId, assignLoanInfoViewModel.ChannelId, null, null ) :
                    UserAccountServiceFacade.RetrieveConciergeInfo( assignLoanInfoViewModel.LoanId, null, isLoa, user.UserAccountId, _compId, assignLoanInfoViewModel.ChannelId, null, null );

            if ( conciergeList != null && !conciergeList.Any( d => d.ConciergeName == "Select One" ) )
                conciergeList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            assignLoanInfoViewModel.ConciergeList = conciergeList;

           

            var loaList = UserAccountServiceFacade.RetrieveLOAInfo( _compId, assignLoanInfoViewModel.ChannelId, null, null, true );

            if ( loaList != null && !loaList.Any( d => d.ConciergeName == "Select One" ) )
                loaList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            assignLoanInfoViewModel.LoaList = loaList;

            if ( !divisionResetOccurred )
            {
                /* Command processing */
                var result = UserAccountServiceFacade.GetDivisions( channelId );
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


            ViewName = "_assignloaninfo";
            ViewData = assignLoanInfoViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.AssignLoanInfo ] = assignLoanInfoViewModel.ToXml();
            //base.HttpContext.Session[ SessionHelper.UserAccountIds ] = new List<int>();
        }
    }
}
