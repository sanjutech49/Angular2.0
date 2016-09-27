using System;
using System.Collections.Generic;
using System.Linq;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class PendingApprovalDataHelper
    {
        public static PendingApprovalViewModel RetrievePendingApprovalViewModel( PendingApprovalListState pendingApprovalListState, List<int> userAccountIds, int userAccountId, string searchTerm, Guid companyId, int channelId, int divisionId, Guid branchId )
        {
            if ( pendingApprovalListState == null )
                pendingApprovalListState = new PendingApprovalListState();

            if ( userAccountIds == null )
                userAccountIds = new List<int>();

            PendingApprovalViewData pendingApprovalViewData = LoanServiceFacade.RetrievePendingApprovalItemsView( userAccountIds,
                                                                                            pendingApprovalListState.CurrentPage,
                                                                                            pendingApprovalListState.SortColumn.GetStringValue(),
                                                                                            pendingApprovalListState.SortDirection,
                                                                                            pendingApprovalListState.ActivityType,
                                                                                            userAccountId,
                                                                                            searchTerm,
                                                                                            companyId,
                                                                                            channelId,
                                                                                            divisionId,
                                                                                            branchId
                                                                                            );
            if ( pendingApprovalViewData == null )
            {
                pendingApprovalViewData = new PendingApprovalViewData { PendingApprovalViewItems = new List<PendingApprovalViewItem>(), TotalItems = 0, TotalPages = 0 };
            }
            
            PendingApprovalViewModel pendingApprovalViewModel = new PendingApprovalViewModel
            {
                ActivityTypeList = new List<ActivityType>( Enum.GetValues( typeof( ActivityType ) ).Cast<ActivityType>() ),
                PendingApprovalItems = pendingApprovalViewData.PendingApprovalViewItems,
                PageCount = pendingApprovalViewData.TotalPages,
                TotalItems = pendingApprovalViewData.TotalItems
            };

            PendingApprovalGridHelper.ProcessPagingOptions( pendingApprovalListState, pendingApprovalViewModel );
            PendingApprovalGridHelper.ApplyClassCollection( pendingApprovalViewModel );

            return pendingApprovalViewModel;
        }
    }
}
