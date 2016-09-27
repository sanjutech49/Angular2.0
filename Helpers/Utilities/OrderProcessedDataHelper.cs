using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class OrderProcessedDataHelper
    {
        public static OrderProcessedViewModel RetrieveOrderProcessedViewModel( OrderProcessedListState orderProcessedListState, List<int> userAccountIds, int userAccountId, Guid companyId, int channelId, int divisionId, Guid branchId, string searchTerm = null )
        {
            if ( orderProcessedListState == null )
                orderProcessedListState = new OrderProcessedListState();

            if ( userAccountIds == null )
                userAccountIds = new List<Int32>();

            OrderProcessedViewData orderProcessedViewData = LoanServiceFacade.RetrieveOrderProcessedLoans( userAccountIds,
                                                                                orderProcessedListState.CurrentPage,
                                                                                orderProcessedListState.SortColumn.GetStringValue(),
                                                                                orderProcessedListState.SortDirection,
                                                                                orderProcessedListState.BoundDate,
                                                                                orderProcessedListState.AppraisalOrderStatus,
                                                                                userAccountId,
                                                                                searchTerm , companyId, channelId, divisionId, branchId);
            if ( orderProcessedViewData == null )
            {
                orderProcessedViewData = new OrderProcessedViewData { ProcessedOrders = new List<ProcessedOrdersView>(), TotalItems = 0, TotalPages = 0 };
            }

            OrderProcessedViewModel orderProcessedViewModel = new OrderProcessedViewModel
            {
                ProcessedOrders = orderProcessedViewData.ProcessedOrders,
                PageCount = orderProcessedViewData.TotalPages,
                TotalItems = orderProcessedViewData.TotalItems
            };

            OrderProcessedGridHelper.ProcessPagingOptions( orderProcessedListState, orderProcessedViewModel );
            OrderProcessedGridHelper.ApplyClassCollection( orderProcessedViewModel );

            return orderProcessedViewModel;
        }
    }
}