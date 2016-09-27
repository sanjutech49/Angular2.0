using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class PendingApprovalGridHelper
    {
        public static void ProcessPagingOptions( PendingApprovalListState pendingApprovalListState, PendingApprovalViewModel pendingApprovalViewModel )
        {
            if ( pendingApprovalViewModel.PageCount % 10 == 0 )
            {
                pendingApprovalViewModel.PageGroups = ( pendingApprovalViewModel.PageCount / 10 );
            }
            else
            {
                pendingApprovalViewModel.PageGroups = ( pendingApprovalViewModel.PageCount / 10 ) + 1;
            }

            pendingApprovalViewModel.PageGroups = ( int )pendingApprovalViewModel.PageGroups;
            if ( pendingApprovalViewModel.PageCount % 10 != 0 )
            {
                pendingApprovalViewModel.LastPageItems = pendingApprovalViewModel.PageCount % 10;
            }
            else
            {
                pendingApprovalViewModel.LastPageItems = 10;
            }

            pendingApprovalViewModel.CurrentPage = pendingApprovalListState.CurrentPage;

            if ( pendingApprovalViewModel.CurrentPage % 10 != 0 )
            {
                pendingApprovalViewModel.StartPage = ( int )( pendingApprovalViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( pendingApprovalViewModel.CurrentPage ) / 10 ) + 1 ) == pendingApprovalViewModel.PageGroups )
                {
                    pendingApprovalViewModel.EndPage = ( int )( pendingApprovalViewModel.CurrentPage / 10 ) * 10 + pendingApprovalViewModel.LastPageItems;
                    pendingApprovalViewModel.LastPageDots = true;
                }
                else
                {
                    pendingApprovalViewModel.EndPage = ( int )( pendingApprovalViewModel.CurrentPage / 10 ) * 10 + 10;
                    pendingApprovalViewModel.LastPageDots = false;
                }
            }
            else
            {
                pendingApprovalViewModel.StartPage = ( int )( ( pendingApprovalViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( pendingApprovalViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == pendingApprovalViewModel.PageGroups )
                {
                    pendingApprovalViewModel.EndPage = ( int )( pendingApprovalViewModel.CurrentPage / 10 ) * 10;
                    pendingApprovalViewModel.LastPageDots = true;
                }
                else
                {
                    pendingApprovalViewModel.EndPage = ( int )( ( pendingApprovalViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    pendingApprovalViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( PendingApprovalViewModel pendingApprovalViewModel )
        {
            if ( pendingApprovalViewModel.PendingApprovalItems != null )
            {
                // Business rule
                foreach ( var pendingApprovalItem in pendingApprovalViewModel.PendingApprovalItems )
                {
                    foreach (var item in pendingApprovalItem.PendingApprovalViewItems)
                    {
                        item.ClassCollection = "pendingapprovaltablelist";

                        if (item.ExceptionItemMaxWeight != -1)
                        {
                            item.ExceptionClassCollection = item.ExceptionItemMaxWeight < 300
                                                                ? "exceptionIcon exceptionIcon0"
                                                                : "exceptionIcon exceptionIcon1";
                        }

                        if (item == pendingApprovalItem.PendingApprovalViewItems.First())
                        {
                            item.ClassCollection = item.ClassCollection + " first";
                        }

                        if (item == pendingApprovalItem.PendingApprovalViewItems.Last())
                        {
                            item.ClassCollection = item.ClassCollection + " last";
                        }
                    }
                }
            }
        }
    }
}
