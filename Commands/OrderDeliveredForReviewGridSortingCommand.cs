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
    public class OrderDeliveredForReviewGridSortingCommand : CommandsBase
    {
        public override void Execute()
        {
            var searchValue = CommonHelper.GetSearchValue( base.HttpContext );

            /* State retrieval */
            var orderDeliveredForReviewViewModel =
                base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewViewModel ] != null ?
                    new OrderDeliveredForReviewViewModel().FromXml( base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewViewModel ].ToString() ) :
                    new OrderDeliveredForReviewViewModel();

            OrderDeliveredForReviewListState orderDeliveredForReviewListState;
            if ( base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewListState ] != null )
                orderDeliveredForReviewListState = ( OrderDeliveredForReviewListState )base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewListState ];
            else
                orderDeliveredForReviewListState = new OrderDeliveredForReviewListState();

            FilterViewModel filterViewModel = null;
            if ( base.HttpContext != null && base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null )
            {
                filterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderDeliveredForReview;
            }
            else
            {
                filterViewModel = new FilterViewModel();
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderDeliveredForReview;
            }

            UserAccount user;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ] ).Username == base.HttpContext.User.Identity.Name )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( base.HttpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            /* parameter processing */
            OrderDeliveredForReviewAttribute newSortColumn;
            if ( !InputParameters.ContainsKey( "Column" ) )
                throw new ArgumentException( "Column value was expected!" );

            newSortColumn = ( OrderDeliveredForReviewAttribute )Enum.Parse( typeof( OrderDeliveredForReviewAttribute ), InputParameters[ "Column" ].ToString() );

            // switch direction
            if ( orderDeliveredForReviewListState.SortColumn == newSortColumn && orderDeliveredForReviewListState.SortDirection == "ASC" )
            {
                orderDeliveredForReviewListState.SortDirection = "DESC";
            }
            else
                orderDeliveredForReviewListState.SortDirection = "ASC";

            orderDeliveredForReviewListState.SortColumn = newSortColumn;
            orderDeliveredForReviewListState.CurrentPage = 1;

            /* Command processing */

            var orderDeliveredForReviewViewData = OrderDeliveredForReviewDataHelper.RetrieveOrderDeliveredForReviewViewModel( orderDeliveredForReviewListState,
                                                                                base.HttpContext.Session[ SessionHelper.UserAccountIds ] !=
                                                                                null
                                                                                    ? ( List<int> )
                                                                                      base.HttpContext.Session[
                                                                                          SessionHelper.UserAccountIds ]
                                                                                    : new List<int> { },
                                                                                user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId, filterViewModel.BranchId, searchValue );


            if ( orderDeliveredForReviewViewModel != null )
            {
                orderDeliveredForReviewViewModel.DeliveredForReviewOrders = orderDeliveredForReviewViewData.DeliveredForReviewOrders;
                orderDeliveredForReviewViewModel.PageCount = orderDeliveredForReviewViewData.PageCount;
                orderDeliveredForReviewViewModel.TotalItems = orderDeliveredForReviewViewData.TotalItems;

                OrderDeliveredForReviewGridHelper.ProcessPagingOptions( orderDeliveredForReviewListState, orderDeliveredForReviewViewModel );
            }


            ViewName = "Queues/_orderDeliveredForReview";
            ViewData = orderDeliveredForReviewViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewViewModel ] = orderDeliveredForReviewViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewListState ] = orderDeliveredForReviewListState;
        }
    }
}