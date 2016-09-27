using System;
using System.Linq;
using MML.Contracts;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class CompletedLoansGridHelper
    {
        public static void ProcessPagingOptions( CompletedLoansListState completedLoansListState, CompletedLoansViewModel completedLoansViewModel )
        {
            if ( completedLoansViewModel.PageCount % 10 == 0 )
            {
                completedLoansViewModel.PageGroups = ( completedLoansViewModel.PageCount / 10 );
            }
            else
            {
                completedLoansViewModel.PageGroups = ( completedLoansViewModel.PageCount / 10 ) + 1;
            }

            completedLoansViewModel.PageGroups = ( int )completedLoansViewModel.PageGroups;
            if ( completedLoansViewModel.PageCount % 10 != 0 )
            {
                completedLoansViewModel.LastPageItems = completedLoansViewModel.PageCount % 10;
            }
            else
            {
                completedLoansViewModel.LastPageItems = 10;
            }

            completedLoansViewModel.CurrentPage = completedLoansListState.CurrentPage;

            if ( completedLoansViewModel.CurrentPage % 10 != 0 )
            {
                completedLoansViewModel.StartPage = ( int )( completedLoansViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( completedLoansViewModel.CurrentPage ) / 10 ) + 1 ) == completedLoansViewModel.PageGroups )
                {
                    completedLoansViewModel.EndPage = ( int )( completedLoansViewModel.CurrentPage / 10 ) * 10 + completedLoansViewModel.LastPageItems;
                    completedLoansViewModel.LastPageDots = true;
                }
                else
                {
                    completedLoansViewModel.EndPage = ( int )( completedLoansViewModel.CurrentPage / 10 ) * 10 + 10;
                    completedLoansViewModel.LastPageDots = false;
                }
            }
            else
            {
                completedLoansViewModel.StartPage = ( int )( ( completedLoansViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( completedLoansViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == completedLoansViewModel.PageGroups )
                {
                    completedLoansViewModel.EndPage = ( int )( completedLoansViewModel.CurrentPage / 10 ) * 10;
                    completedLoansViewModel.LastPageDots = true;
                }
                else
                {
                    completedLoansViewModel.EndPage = ( int )( ( completedLoansViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    completedLoansViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( CompletedLoansViewModel completedLoansViewModel )
        {
            if ( completedLoansViewModel.CompletedLoansItems != null )
            {
                // Business rule
                foreach ( var completeItem in completedLoansViewModel.CompletedLoansItems )
                {
                    foreach ( var item in completeItem.CompletedLoansViewItems )
                    {

                        item.ClassCollection = "completedloanstablelist";
                        

                        if ( item.ExceptionItemMaxWeight != -1 )
                        {
                            item.ExceptionClassCollection = item.ExceptionItemMaxWeight < 300
                                ? "exceptionIcon exceptionIcon0"
                                : "exceptionIcon exceptionIcon1";
                        }

                        if ( item == completeItem.CompletedLoansViewItems.First() )
                        {
                            item.ClassCollection = item.ClassCollection + " first last";
                        }

                        if ( item == completeItem.CompletedLoansViewItems.Last() )
                        {
                            item.ClassCollection = item.ClassCollection + " last";
                        }
                    }
                }
            }
        }
    }
}
