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
    public class OrderRequestedDataHelper
    {
        public static OrderRequestedViewModel RetrieveOrderRequestedViewModel( OrderRequestedListState orderRequestedListState, List<int> userAccountIds, int userAccountId, Guid companyId, int channelId, int divisionId, Guid branchId, string searchTerm = null )
        {
            if ( orderRequestedListState == null )
                orderRequestedListState = new OrderRequestedListState();

            if ( userAccountIds == null )
                userAccountIds = new List<Int32>();

            OrderRequestedViewData orderRequestedViewData = LoanServiceFacade.RetrieveOrderRequestedLoans( userAccountIds,
                                                                                orderRequestedListState.CurrentPage,
                                                                                orderRequestedListState.SortColumn.GetStringValue(),
                                                                                orderRequestedListState.SortDirection,
                                                                                orderRequestedListState.BoundDate,
                                                                                orderRequestedListState.OrderType,
                                                                                orderRequestedListState.NonConforming,
                                                                                orderRequestedListState.Rush,
                                                                                orderRequestedListState.LoanPurposeFilter, 
                                                                                orderRequestedListState.NonConformingFilter,
                                                                                orderRequestedListState.RushFilter,
                                                                                userAccountId,
                                                                                searchTerm,
                                                                                companyId, channelId, divisionId, branchId);
            if ( orderRequestedViewData == null )
            {
                orderRequestedViewData = new OrderRequestedViewData { RequestedOrders = new List<RequestedOrdersView>(), TotalItems = 0, TotalPages = 0 };
            }

            OrderRequestedViewModel orderRequestedViewModel = new OrderRequestedViewModel
            {
                RequestedOrders = orderRequestedViewData.RequestedOrders,
                PageCount = orderRequestedViewData.TotalPages,
                LoanPurposeList = new List<LoanTransactionType>( Enum.GetValues( typeof( LoanTransactionType ) ).Cast<LoanTransactionType>().Skip( 1 ) ),
                TotalItems = orderRequestedViewData.TotalItems
            };

            OrderRequestedGridHelper.ProcessPagingOptions( orderRequestedListState, orderRequestedViewModel );
            OrderRequestedGridHelper.ApplyClassCollection( orderRequestedViewModel );

            return orderRequestedViewModel;
        }
    }
}