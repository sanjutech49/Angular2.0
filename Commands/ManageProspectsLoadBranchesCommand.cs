using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;
using MML.Common.Helpers;
using MML.Web.Facade;
using MML.Contracts;
using Telerik.Web.Mvc.UI;
using MML.Common;
using System.Collections.ObjectModel;

namespace MML.Web.LoanCenter.Commands
{
    public class ManageProspectsLoadBranchesCommand : CommandsBase
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
            Int32 divisionId = 0;
            if ( !InputParameters.ContainsKey( "DivisionId" ) )
                throw new ArgumentException( "DivisionId was expected!" );

            bool regionsResetOccurred = false;

            if ( InputParameters[ "DivisionId" ].ToString() == "0" || InputParameters[ "DivisionId" ].ToString() == "-1" )
                regionsResetOccurred = true;
            else
                divisionId = Int32.Parse( InputParameters[ "DivisionId" ].ToString() );

            // Select region
            manageProspectViewModel.DivisionId = divisionId;

            manageProspectViewModel.Branches.Clear();
            manageProspectViewModel.Branches.Add(_viewAllItem);
            manageProspectViewModel.BranchId = Guid.Empty;

            manageProspectViewModel.ConciergeInfoList.Clear();
            manageProspectViewModel.SelectedConcierge = null;


            var isLoa = false;
            if ( user.Roles != null && user.Roles.Any( r => r.RoleName == RoleName.LoanOfficerAssistant && r.IsActive ) )
                isLoa = true;


            /* Command processing */
            Guid _compId;
            Guid.TryParse( manageProspectViewModel.CompanyId, out _compId );


            var conciergeList = !WebCommonHelper.LicensingEnabled() ?
                    UserAccountServiceFacade.RetrieveConciergeInfo( null, null, null, null, _compId, manageProspectViewModel.ChannelId, manageProspectViewModel.DivisionId, null ) :
                    UserAccountServiceFacade.RetrieveConciergeInfo( manageProspectViewModel.LoanId, null, isLoa, user.UserAccountId, _compId, manageProspectViewModel.ChannelId, manageProspectViewModel.DivisionId, null );

            if ( conciergeList != null && !conciergeList.Any( d => d.ConciergeName == "Select One" ) )
                conciergeList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            manageProspectViewModel.ConciergeInfoList = conciergeList;



            var loaList = UserAccountServiceFacade.RetrieveLOAInfo( _compId, manageProspectViewModel.ChannelId, manageProspectViewModel.DivisionId, null, true );

            if ( loaList != null && !loaList.Any( d => d.ConciergeName == "Select One" ) )
                loaList.Insert( 0, new ConciergeInfo() { NMLSNumber = "", ConciergeName = "Select One", UserAccountId = 0 } );

            manageProspectViewModel.LoaInfoList = loaList;

            if ( !regionsResetOccurred )
            {
                /* Command processing */
                var result = UserAccountServiceFacade.GetBranches( divisionId );
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
