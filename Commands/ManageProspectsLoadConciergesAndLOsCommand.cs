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
using System.Collections.ObjectModel;

namespace MML.Web.LoanCenter.Commands
{
    public class ManageProspectsLoadConciergesAndLOsCommand : CommandsBase
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

            ManageProspectsViewModel manageProspectViewModel = null;
            if ( ( base.HttpContext != null ) && ( base.HttpContext.Session[ SessionHelper.ManageProspects ] != null ) )
            {
                manageProspectViewModel = new ManageProspectsViewModel().FromXml( base.HttpContext.Session[ SessionHelper.ManageProspects ].ToString() );
            }
            else
            {
                // possible state retrieval?
                manageProspectViewModel = new ManageProspectsViewModel();
            }

            /* parameter processing */
            Guid branchId = Guid.Empty;
            if ( !InputParameters.ContainsKey( "BranchId" ) )
                throw new ArgumentException( "BranchId was expected!" );

            if ( InputParameters[ "BranchId" ].ToString() != "-1" && InputParameters[ "BranchId" ].ToString() != "0" )
            {
                branchId = Guid.Parse( InputParameters[ "BranchId" ].ToString() );
            }

            manageProspectViewModel.BranchId = branchId;

            manageProspectViewModel.ConciergeInfoList.Clear();
            manageProspectViewModel.SelectedConcierge = null;


            var isLoa = false;
            if ( user.Roles != null && user.Roles.Any( r => r.RoleName == RoleName.LoanOfficerAssistant && r.IsActive ) )
                isLoa = true;


            /* Command processing */
            Guid _compId;
            Guid.TryParse( manageProspectViewModel.CompanyId, out _compId );


            var conciergeList = !WebCommonHelper.LicensingEnabled() ?
                    UserAccountServiceFacade.RetrieveConciergeInfo( null, null, null, null, _compId, manageProspectViewModel.ChannelId, manageProspectViewModel.DivisionId, manageProspectViewModel.BranchId ) :
                    UserAccountServiceFacade.RetrieveConciergeInfo( manageProspectViewModel.LoanId, null, isLoa, user.UserAccountId, _compId, manageProspectViewModel.ChannelId, manageProspectViewModel.DivisionId, manageProspectViewModel.BranchId );

            if ( conciergeList != null && !conciergeList.Any( d => d.ConciergeName == "Select One" ) )
                conciergeList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            manageProspectViewModel.ConciergeInfoList = conciergeList;



            var loaList = UserAccountServiceFacade.RetrieveLOAInfo( _compId, manageProspectViewModel.ChannelId, manageProspectViewModel.DivisionId, manageProspectViewModel.BranchId, true );

            if ( loaList != null && !loaList.Any( d => d.ConciergeName == "Select One" ) )
                loaList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            manageProspectViewModel.LoaInfoList = loaList;

            manageProspectViewModel.Statuses = new Collection<KeyValuePair<String, String>>();
            foreach ( ContactStatus contactStatus in Enum.GetValues( typeof( ContactStatus ) ) )
            {
                if ( contactStatus != ContactStatus.None )
                    manageProspectViewModel.Statuses.Add( new KeyValuePair<String, String>( ( ( int )contactStatus ).ToString(),
                        MML.Web.LoanCenter.Helpers.LoanCenterEnumHelper.ContactStatusToString( contactStatus ) ) );
            }

            manageProspectViewModel.Statuses = new Collection<KeyValuePair<String, String>>( manageProspectViewModel.Statuses.OrderBy( s => s.Value ).ToList() );

            ViewName = "Commands/_manageprospects";
            ViewData = manageProspectViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.ManageProspects ] = manageProspectViewModel.ToXml();
        }
    }
}
