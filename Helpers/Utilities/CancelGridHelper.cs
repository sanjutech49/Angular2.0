using System;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class CancelGridHelper
    {
        public static void ProcessPagingOptions( CancelLoanListState cancelListState, CancelViewModel cancelViewModel )
        {
            if ( cancelViewModel.PageCount % 10 == 0 )
            {
                cancelViewModel.PageGroups = ( cancelViewModel.PageCount / 10 );
            }
            else
            {
                cancelViewModel.PageGroups = ( cancelViewModel.PageCount / 10 ) + 1;
            }

            cancelViewModel.PageGroups = ( int )cancelViewModel.PageGroups;
            if ( cancelViewModel.PageCount % 10 != 0 )
            {
                cancelViewModel.LastPageItems = cancelViewModel.PageCount % 10;
            }
            else
            {
                cancelViewModel.LastPageItems = 10;
            }

            cancelViewModel.CurrentPage = cancelListState.CurrentPage;

            if ( cancelViewModel.CurrentPage % 10 != 0 )
            {
                cancelViewModel.StartPage = ( int )( cancelViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( cancelViewModel.CurrentPage ) / 10 ) + 1 ) == cancelViewModel.PageGroups )
                {
                    cancelViewModel.EndPage = ( int )( cancelViewModel.CurrentPage / 10 ) * 10 + cancelViewModel.LastPageItems;
                    cancelViewModel.LastPageDots = true;
                }
                else
                {
                    cancelViewModel.EndPage = ( int )( cancelViewModel.CurrentPage / 10 ) * 10 + 10;
                    cancelViewModel.LastPageDots = false;
                }
            }
            else
            {
                cancelViewModel.StartPage = ( int )( ( cancelViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( cancelViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == cancelViewModel.PageGroups )
                {
                    cancelViewModel.EndPage = ( int )( cancelViewModel.CurrentPage / 10 ) * 10;
                    cancelViewModel.LastPageDots = true;
                }
                else
                {
                    cancelViewModel.EndPage = ( int )( ( cancelViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    cancelViewModel.LastPageDots = false;
                }
            }
        }
        public static void ApplyClassCollection( CancelViewModel cancelViewModel )
        {
            if ( cancelViewModel.CancelItems != null )
            {
                // Business rule
                foreach ( var cancelItem in cancelViewModel.CancelItems )
                {
                    foreach (var item in cancelItem.CancelViewItems)
                    {
                        if (item.LockExpireDate < DateTime.Now && item.LockExpireDate != DateTime.MinValue)
                        {
                            item.ClassCollection = "canceltablelistduedate";
                        }
                        else
                        {
                            item.ClassCollection = "canceltablelist";
                        }

                        if (item.ExceptionItemMaxWeight != -1)
                        {
                            item.ExceptionClassCollection = item.ExceptionItemMaxWeight < 300
                                ? "exceptionIcon exceptionIcon0"
                                : "exceptionIcon exceptionIcon1";
                        }
                    }
                }
            }
        }
    }
}
