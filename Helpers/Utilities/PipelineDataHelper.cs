using System;
using System.Collections.Generic;
using System.Linq;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class PipelineDataHelper
    {
        public static PipelineViewModel RetrievePipelineViewModel( PipelineListState pipelineListState, List<int> userAccountIds, int userAccountId, Guid companyId, int channelId, int divisionId, Guid branchId, string searchTerm = null )
        {
            if ( pipelineListState == null )
                pipelineListState = new PipelineListState();

            if ( userAccountIds == null )
                userAccountIds = new List<int>();

            string isOnLineUser = pipelineListState.BorrowerStatusFilter == null ? null : 
                                  pipelineListState.BorrowerStatusFilter ==  BorrowerStatusType.Offline.GetStringValue() ? "0" : "1";
           
            PipelineViewData pipelineViewData =  LoanServiceFacade.RetrievePipelineItemsView( userAccountIds,
                                                                                            pipelineListState.CurrentPage,
                                                                                            pipelineListState.SortColumn.GetStringValue(),
                                                                                            pipelineListState.SortDirection,
                                                                                            userAccountId,
                                                                                            searchTerm,
                                                                                            pipelineListState.ActivityTypeFilter,
                                                                                            pipelineListState.BoundDate,
                                                                                            pipelineListState.LoanPurposeFilter,
                                                                                            isOnLineUser,
                                                                                            companyId,
                                                                                            channelId,
                                                                                            divisionId,
                                                                                            branchId
                                                                                            );

            if ( pipelineViewData == null )
            {
                pipelineViewData = new PipelineViewData { PipelineItems = new List<PipelineViewItem>(), TotalItems = 0, TotalPages = 0 };
            }
            // Set paging numbers
            else if ( userAccountIds.Any() )
            {
                pipelineViewData.TotalItems = pipelineViewData.TotalItems;
                pipelineViewData.TotalPages = pipelineViewData.TotalItems / 10;
                if ( ( pipelineViewData.TotalItems % 10 ) != 0 )
                    pipelineViewData.TotalPages++;
            }
            for (int i = 0; i < pipelineViewData.PipelineItems.Count(); i++)
            {
                if (pipelineViewData.PipelineItems[i].PipelineViewItems.Count > 0)
                {
                    DataForShortProductDescription data =
                        LoanServiceFacade.RetrieveDataForShortProductDescription(pipelineViewData.PipelineItems[i].PipelineViewItems[0].LoanId);

                    pipelineViewData.PipelineItems[ i ].PipelineViewItems[0].ProgramName = LoanHelper.FormatShortProductDescription( pipelineViewData.PipelineItems[ i ].PipelineViewItems[0].IsHarp,
                        EnumHelper.GetStringValue((AmortizationType)data.AmortizationType )  ,
                        data.LoanTerm,
                        data.FixedRateTerm,
                        EnumHelper.GetStringValue((MortgageType)data.MortgageType ));
                }
            }
            PipelineViewModel pipelineViewModel = new PipelineViewModel
            {
                ActivityTypeList = CommonHelper.RetrieveActivityListForQueueFilter(),
                LoanPurposeList = new List<LoanTransactionType>(Enum.GetValues(typeof (LoanTransactionType)).Cast<LoanTransactionType>().Skip(1)),
                BorrowerStatusList = new List<BorrowerStatusType>(Enum.GetValues(typeof(BorrowerStatusType)).Cast<BorrowerStatusType>().Skip(1)),
                PipelineItems = pipelineViewData.PipelineItems,
                PageCount = pipelineViewData.TotalPages,
                TotalItems = pipelineViewData.TotalItems
            };

            PipelineGridHelper.ProcessPagingOptions( pipelineListState, pipelineViewModel );
            PipelineGridHelper.ApplyClassCollection( pipelineViewModel );
            
            return pipelineViewModel;
        }
    }
}
