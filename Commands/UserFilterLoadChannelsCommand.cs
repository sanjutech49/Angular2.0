using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using System.Web.WebPages.Html;
using System.Linq;

namespace MML.Web.LoanCenter.Commands
{
    public class UserFilterLoadChannelsCommand : CommandsBaseUserFilter
    {
        private SelectListItem _genericItem = new SelectListItem()
        {
            Text = "View All",
            Value = "0"
        };

        private SelectListItem _genericItemGuid = new SelectListItem()
        {
            Text = "View All",
            Value = Guid.Empty.ToString()
        };

        public override void Execute()
        {
            base.Execute();

            FilterViewModel userFilterViewModel;
            if ( ( base.HttpContext != null ) && ( base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
            }

            /* parameter processing */
            Guid companyId = Guid.Empty;
            if ( !InputParameters.ContainsKey( "CompanyId" ) )
                throw new ArgumentException( "CompanyId was expected!" );

            bool channelResetOccurred = false;

            if ( InputParameters[ "CompanyId" ].ToString().Equals( "0" ) || InputParameters[ "CompanyId" ].ToString().Equals( "-1" ) || InputParameters[ "CompanyId" ].ToString().Equals( Guid.Empty.ToString() ) )
                channelResetOccurred = true;
            else
                companyId = Guid.Parse( InputParameters[ "CompanyId" ].ToString() );

            userFilterViewModel.CompanyId = companyId;

            userFilterViewModel.Channels.Clear();
            userFilterViewModel.Channels.Add( _genericItem );
            userFilterViewModel.ChannelId = 0;

            userFilterViewModel.Divisions.Clear();
            userFilterViewModel.Divisions.Add( _genericItem );
            userFilterViewModel.DivisionId = 0;

            userFilterViewModel.Branches.Clear();
            userFilterViewModel.Branches.Add( _genericItemGuid );
            userFilterViewModel.BranchId = Guid.Empty;

            userFilterViewModel.Users.Clear();
            userFilterViewModel.Users.Add( _genericItem );
            userFilterViewModel.UserId = 0;

            if ( !channelResetOccurred )
            {
                /* Command processing */
                var result = UserAccountServiceFacade.GetChannels( companyId );
                if ( result != null )
                    foreach ( Channel channel in result.OrderBy(r => r.Name) )
                    {
                        userFilterViewModel.Channels.Add( new SelectListItem()
                        {
                            Text = channel.Name,
                            Value = channel.ChannelId.ToString(),
                            Selected = false
                        } );
                    }
            }

            ViewName = "_userfilter";
            ViewData = userFilterViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
        }
    }
}