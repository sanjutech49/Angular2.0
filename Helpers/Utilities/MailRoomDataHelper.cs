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
    public static class MailRoomDataHelper
    {
        public static MailRoomViewModel RetrieveMailRoomViewModel( MailRoomListState mailRoomListState, List<int> userAccountIds, int userAccountId, Guid companyId, int channelId, int divisionId, Guid branchId, string searchTerm = null )
        {
            if ( mailRoomListState == null )
                mailRoomListState = new MailRoomListState();

            if ( userAccountIds == null )
                userAccountIds = new List<int>();

            MailRoomViewData mailRoomViewData = LoanServiceFacade.RetrieveMailRoomItemsView( userAccountIds,
                                                                                            mailRoomListState.CurrentPage,
                                                                                            mailRoomListState.SortColumn.GetStringValue(),
                                                                                            mailRoomListState.SortDirection,
                                                                                            userAccountId,
                                                                                            searchTerm,
                                                                                            mailRoomListState.DocumentTypeFilter,
                                                                                            mailRoomListState.BoundDate,
                                                                                            companyId,
                                                                                            channelId,
                                                                                            divisionId,
                                                                                            branchId
                                                                                            );

            if ( mailRoomViewData == null )
            {
                mailRoomViewData = new MailRoomViewData { MailRoomItems = new List<MailRoomView>(), TotalItems = 0, TotalPages = 0 };
            }
            // Set paging numbers
            else if ( userAccountIds.Any() )
            {
                mailRoomViewData.TotalItems = mailRoomViewData.TotalItems;
                mailRoomViewData.TotalPages = mailRoomViewData.TotalItems / 10;
                if ( ( mailRoomViewData.TotalItems % 10 ) != 0 )
                    mailRoomViewData.TotalPages++;
            }

            MailRoomViewModel mailRoomViewModel = new MailRoomViewModel
            {
                MailRoomItems = mailRoomViewData.MailRoomItems,
                PageCount = mailRoomViewData.TotalPages,
                TotalItems = mailRoomViewData.TotalItems
            };

            MailRoomGridHelper.ProcessPagingOptions( mailRoomListState, mailRoomViewModel );
            //MailRoomGridHelper.ApplyClassCollection( mailRoomViewModel );

            return mailRoomViewModel;
        }
    }
}
