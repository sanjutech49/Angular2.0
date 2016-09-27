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
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Commands
{
    public class UserFilterLoadDivisionsCommand : CommandsBaseUserFilter
    {
        private SelectListItem _genericItem = new SelectListItem()
        {
            Text = "(Select One)",
            Value = "-1"
        };

        private static SelectListItem _viewAllItem = new SelectListItem()
        {
            Text = "View All",
            Value = "0"
        };

        private static SelectListItem _viewAllItemGuid = new SelectListItem()
        {
            Text = "View All",
            Value = Guid.Empty.ToString()
        };

        public override void Execute()
        {
            UserAccount user;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ] ).Username == base.HttpContext.User.Identity.Name )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( base.HttpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

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
            Int32 channelId = 0;
            if ( !InputParameters.ContainsKey( "ChannelId" ) )
                throw new ArgumentException( "ChannelId was expected!" );

            bool divisionResetOccurred = false;

            if ( InputParameters[ "ChannelId" ].ToString() == "0" || InputParameters[ "ChannelId" ].ToString().Equals( "-1" ) )
                divisionResetOccurred = true;
            else
                channelId = Int32.Parse( InputParameters[ "ChannelId" ].ToString());
            
            userFilterViewModel.ChannelId = channelId;

            userFilterViewModel.Divisions.Clear();
            userFilterViewModel.Divisions.Add( _viewAllItem );
            userFilterViewModel.DivisionId = 0;

            userFilterViewModel.Branches.Clear();
            userFilterViewModel.Branches.Add( _viewAllItemGuid );
            userFilterViewModel.BranchId = Guid.Empty;

            userFilterViewModel.Users.Clear();
            userFilterViewModel.Users.Add( _viewAllItem );
            userFilterViewModel.UserId = 0;

            if ( !divisionResetOccurred )
            {
                /* Command processing */
                var result = UserAccountServiceFacade.GetDivisions( channelId );
                if (result != null) 
                { 
                    foreach ( Division division in result.OrderBy(r => r.DivisionName) )
                    {
                        userFilterViewModel.Divisions.Add( new SelectListItem()
                        {
                            Text = division.DivisionName,
                            Value = division.DivisionId.ToString(),
                            Selected = false
                        } );

                        if ( base.HttpContext.Session[ SessionHelper.CurrentTab ] != null && 
                            (   (LoanCenterTab)base.HttpContext.Session[ SessionHelper.CurrentTab ] == LoanCenterTab.OrderRequested || 
                                (LoanCenterTab)base.HttpContext.Session[ SessionHelper.CurrentTab ] == LoanCenterTab.OrderProcessed ||
                                (LoanCenterTab)base.HttpContext.Session[ SessionHelper.CurrentTab ] == LoanCenterTab.OrderDeliveredForReview ||
                                (LoanCenterTab)base.HttpContext.Session[ SessionHelper.CurrentTab ] == LoanCenterTab.OrderException ))
                        {
                            var branches = UserAccountServiceFacade.GetBranches( division.DivisionId );
                            foreach ( var branch in branches )
                            {
                                var users = UserAccountServiceFacade.GetUsersFullName( branch.BranchId, false );

                                var usersList = new List<int>();

                                foreach ( var userAccount in users.OrderBy( r => r.FullName ) )
                                {
                                    userFilterViewModel.Users.Add( new SelectListItem()
                                    {
                                        Text = userAccount.FullName,
                                        Value = userAccount.UserAccountId.ToString(),
                                        Selected = ( userAccount.UserAccountId == userFilterViewModel.UserId )
                                    } );

                                    usersList.Add( userAccount.UserAccountId );
                                }

                                
                            }
                        }
                    }
                }
                userFilterViewModel.Users.Add( _viewAllItem );
            }

            ViewName = "_userfilter";
            ViewData = userFilterViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
        }
    }
}