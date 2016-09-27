using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;
using MML.Common.Helpers;
using MML.Common;
using Telerik.Web.Mvc.UI;
using MML.Web.Facade;
using MML.Contracts;

namespace MML.Web.LoanCenter.Commands
{
    public class AssignLoanInfoLoadConciergesAndLOsCommand : CommandsBase
    {
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
            Guid branchId = Guid.Empty;
            if ( !InputParameters.ContainsKey( "BranchId" ) )
                throw new ArgumentException( "BranchId was expected!" );

            if ( InputParameters[ "BranchId" ].ToString() != "-1" && InputParameters[ "BranchId" ].ToString() != "0" )
            {
                branchId = Guid.Parse( InputParameters[ "BranchId" ].ToString() );
            }

            assignLoanInfoViewModel.BranchId = branchId;

            assignLoanInfoViewModel.ConciergeList.Clear();
            assignLoanInfoViewModel.ConciergeId = null;


            var isLoa = false;
            if (user.Roles != null && user.Roles.Any(r => r.RoleName == RoleName.LoanOfficerAssistant && r.IsActive))
            {
                isLoa = true;
            }

            /* Command processing */
            Guid _compId;
            Guid.TryParse( assignLoanInfoViewModel.CompanyId, out _compId );


            var conciergeList = !WebCommonHelper.LicensingEnabled() ?
                    UserAccountServiceFacade.RetrieveConciergeInfo( null, null, null, null, _compId, assignLoanInfoViewModel.ChannelId, assignLoanInfoViewModel.DivisionId, assignLoanInfoViewModel.BranchId ) :
                    UserAccountServiceFacade.RetrieveConciergeInfo( assignLoanInfoViewModel.LoanId, null, isLoa, user.UserAccountId, _compId, assignLoanInfoViewModel.ChannelId, assignLoanInfoViewModel.DivisionId, assignLoanInfoViewModel.BranchId );

            if ( conciergeList != null && !conciergeList.Any( d => d.ConciergeName == "Select One" ) )
                conciergeList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            assignLoanInfoViewModel.ConciergeList = conciergeList;

                

            var loaList = UserAccountServiceFacade.RetrieveLOAInfo( _compId, assignLoanInfoViewModel.ChannelId, assignLoanInfoViewModel.DivisionId, assignLoanInfoViewModel.BranchId, true );

            if ( loaList != null && !loaList.Any( d => d.ConciergeName == "Select One" ) )
                loaList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            assignLoanInfoViewModel.LoaList = loaList;

            ViewName = "_assignloaninfo";
            ViewData = assignLoanInfoViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.AssignLoanInfo ] = assignLoanInfoViewModel.ToXml();
            //base.HttpContext.Session[ SessionHelper.UserAccountIds ] = new List<int>();
        }
    }
}
