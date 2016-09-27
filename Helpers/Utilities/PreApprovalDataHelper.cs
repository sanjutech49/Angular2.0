using System;
using System.Collections.Generic;
using System.Linq;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class PreApprovalDataHelper
    {
        public static PreApprovalViewModel RetrievePreApprovalViewModel( PreApprovalListState preApprovalListState, List<int> userAccountIds, int userAccountId, string searchTerm, Guid companyId, int channelId, int divisionId, Guid branchId )
        {
            if ( preApprovalListState == null )
                preApprovalListState = new PreApprovalListState();

            if ( userAccountIds == null )
                userAccountIds = new List<int>();

            PreApprovalViewData preApprovalViewData = LoanServiceFacade.RetrievePreApprovalItemsView( userAccountIds,
                                                                                            preApprovalListState.CurrentPage,
                                                                                            preApprovalListState.SortColumn.GetStringValue(),
                                                                                            preApprovalListState.SortDirection,
                                                                                            preApprovalListState.BoundDate,
                                                                                            userAccountId,
                                                                                            searchTerm,
                                                                                            companyId,
                                                                                            channelId,
                                                                                            divisionId,
                                                                                            branchId
                                                                                            );
            if ( preApprovalViewData == null )
            {
                preApprovalViewData = new PreApprovalViewData { PreApprovalViewItem = new List<PreApprovalViewItem>(), TotalItems = 0, TotalPages = 0 };
            }

            PreApprovalViewModel preApprovalViewModel = new PreApprovalViewModel
            {
                ActivityTypeList = new List<ActivityType>( Enum.GetValues( typeof( ActivityType ) ).Cast<ActivityType>() ),
                PreApprovalItems = preApprovalViewData.PreApprovalViewItem ,
                PageCount = preApprovalViewData.TotalPages,
                TotalItems = preApprovalViewData.TotalItems
            };

            PreApprovalGridHelper.ProcessPagingOptions( preApprovalListState, preApprovalViewModel );
            PreApprovalGridHelper.ApplyClassCollection( preApprovalViewModel );

            return preApprovalViewModel;
        }
    }
}
