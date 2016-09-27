using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;
using System.Web.Mvc;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class OrderDeliveredForReviewDataHelper 
    {
        private static SelectListItem _emptyItem = new SelectListItem()
        {
            Text = " ",
            Value = "0"
        };

        public static OrderDeliveredForReviewViewModel RetrieveOrderDeliveredForReviewViewModel( OrderDeliveredForReviewListState orderDeliveredForReviewListState, List<int> userAccountIds, int userAccountId, Guid companyId, int channelId, int divisionId, Guid branchId, string searchTerm = null )
        {
            if ( orderDeliveredForReviewListState == null )
                orderDeliveredForReviewListState = new OrderDeliveredForReviewListState();

            if ( userAccountIds == null )
                userAccountIds = new List<Int32>();

            DeliveredForReviewViewData deliveredForReviewViewData = LoanServiceFacade.RetrieveOrderDeliveredForReviewLoans( userAccountIds,
                                                                                orderDeliveredForReviewListState.CurrentPage,
                                                                                orderDeliveredForReviewListState.SortColumn.GetStringValue(),
                                                                                orderDeliveredForReviewListState.SortDirection,
                                                                                orderDeliveredForReviewListState.BoundDate,
                                                                                orderDeliveredForReviewListState.AppraisalOrderStatus,
                                                                                userAccountId,
                                                                                searchTerm , companyId, channelId, divisionId, branchId);
            if ( deliveredForReviewViewData == null )
            {
                deliveredForReviewViewData = new DeliveredForReviewViewData { DeliveredForReviewOrders = new List<DeliveredForReviewView>(), TotalItems = 0, TotalPages = 0 };
            }

            OrderDeliveredForReviewViewModel orderDeliveredForReviewViewModel = new OrderDeliveredForReviewViewModel
            {
                DeliveredForReviewOrders = deliveredForReviewViewData.DeliveredForReviewOrders,
                PageCount = deliveredForReviewViewData.TotalPages,
                TotalItems = deliveredForReviewViewData.TotalItems
            };

            OrderDeliveredForReviewGridHelper.ProcessPagingOptions( orderDeliveredForReviewListState, orderDeliveredForReviewViewModel );
            OrderDeliveredForReviewGridHelper.ApplyClassCollection( orderDeliveredForReviewViewModel );

            return orderDeliveredForReviewViewModel;
        }
    }
}