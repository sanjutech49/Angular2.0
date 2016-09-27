using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class OrderRequestedGridSortingCommand : CommandsBase
    {
        public override void Execute()
        {
            var searchValue = CommonHelper.GetSearchValue( base.HttpContext );

            /* State retrieval */
            var orderRequestedViewModel =
                base.HttpContext.Session[ SessionHelper.OrderRequestedViewModel ] != null ?
                    new OrderRequestedViewModel().FromXml( base.HttpContext.Session[ SessionHelper.OrderRequestedViewModel ].ToString() ) :
                    new OrderRequestedViewModel();

            OrderRequestedListState orderRequestedListState;
            if ( base.HttpContext.Session[ SessionHelper.OrderRequestedListState ] != null )
                orderRequestedListState = ( OrderRequestedListState )base.HttpContext.Session[ SessionHelper.OrderRequestedListState ];
            else
                orderRequestedListState = new OrderRequestedListState();

            UserAccount user;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ] ).Username == base.HttpContext.User.Identity.Name )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( base.HttpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            FilterViewModel filterViewModel = null;

            if ( base.HttpContext != null && base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null )
            {
                filterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderRequested;
            }
            else
            {
                filterViewModel = new FilterViewModel();
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderRequested;
            }

            /* parameter processing */
            OrderRequestedAttribute newSortColumn;
            if ( !InputParameters.ContainsKey( "Column" ) )
                throw new ArgumentException( "Column value was expected!" );

            newSortColumn = ( OrderRequestedAttribute )Enum.Parse( typeof( OrderRequestedAttribute ), InputParameters[ "Column" ].ToString() );

            // switch direction
            if ( orderRequestedListState.SortColumn == newSortColumn && orderRequestedListState.SortDirection == "ASC" )
            {
                orderRequestedListState.SortDirection = "DESC";
            }
            else
                orderRequestedListState.SortDirection = "ASC";

            orderRequestedListState.SortColumn = newSortColumn;
            orderRequestedListState.CurrentPage = 1;

            /* Command processing */

            var orderRequestedViewData = OrderRequestedDataHelper.RetrieveOrderRequestedViewModel( orderRequestedListState,
                                                                                base.HttpContext.Session[ SessionHelper.UserAccountIds ] !=
                                                                                null
                                                                                    ? ( List<int> )
                                                                                      base.HttpContext.Session[
                                                                                          SessionHelper.UserAccountIds ]
                                                                                    : new List<int> { },
                                                                                user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId, filterViewModel.BranchId, searchValue );


            if ( orderRequestedViewModel != null )
            {
                orderRequestedViewModel.RequestedOrders = orderRequestedViewData.RequestedOrders;
                orderRequestedViewModel.PageCount = orderRequestedViewData.PageCount;
                orderRequestedViewModel.TotalItems = orderRequestedViewData.TotalItems;

                OrderRequestedGridHelper.ProcessPagingOptions( orderRequestedListState, orderRequestedViewModel );
            }


            ViewName = "Queues/_orderRequested";
            ViewData = orderRequestedViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderRequestedViewModel ] = orderRequestedViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderRequestedListState ] = orderRequestedListState;
        }
    }
}