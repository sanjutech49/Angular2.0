using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common.Helpers;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.Facade;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class OrderExceptionDataHelper
    {
        public static OrderExceptionViewModel RetrieveOrderExceptionViewModel( OrderExceptionListState orderExceptionListState, List<int> userAccountIds, int userAccountId, Guid companyId, int channelId, int divisionId, Guid branchId, string searchTerm = null )
        {
            if ( orderExceptionListState == null )
                orderExceptionListState = new OrderExceptionListState();

            if ( userAccountIds == null )
                userAccountIds = new List<Int32>();

            OrderExceptionViewData orderExceptionViewData = LoanServiceFacade.RetrieveOrderExceptionLoans( userAccountIds,
                                                                                orderExceptionListState.CurrentPage,
                                                                                orderExceptionListState.SortColumn.GetStringValue(),
                                                                                orderExceptionListState.SortDirection,
                                                                                orderExceptionListState.BoundDate,
                                                                                orderExceptionListState.ExceptionType,
                                                                                userAccountId,
                                                                                searchTerm, companyId, channelId, divisionId, branchId );
            if ( orderExceptionViewData == null )
            {
                orderExceptionViewData = new OrderExceptionViewData { Exceptions = new List<OrderExceptionView>(), TotalItems = 0, TotalPages = 0 };
            }

            OrderExceptionViewModel orderExceptionViewModel = new OrderExceptionViewModel
            {
                Exceptions = orderExceptionViewData.Exceptions,
                PageCount = orderExceptionViewData.TotalPages,
                TotalItems = orderExceptionViewData.TotalItems
            };

            OrderExceptionGridHelper.ProcessPagingOptions( orderExceptionListState, orderExceptionViewModel );
            OrderExceptionGridHelper.ApplyClassCollection( orderExceptionViewModel );

            return orderExceptionViewModel;
        }
    }
}