using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class NewLoanApplicationGridHelper
    {
        public static void ProcessPagingOptions( NewLoanApplicationListState newLoanApplicationListState, NewLoanApplicationViewModel newLoanApplicationViewModel )
        {
            if ( newLoanApplicationViewModel.PageCount % 10 == 0 )
            {
                newLoanApplicationViewModel.PageGroups = ( newLoanApplicationViewModel.PageCount / 10 );
            }
            else
            {
                newLoanApplicationViewModel.PageGroups = ( newLoanApplicationViewModel.PageCount / 10 ) + 1;
            }

            newLoanApplicationViewModel.PageGroups = ( int )newLoanApplicationViewModel.PageGroups;
            if ( newLoanApplicationViewModel.PageCount % 10 != 0 )
            {
                newLoanApplicationViewModel.LastPageItems = newLoanApplicationViewModel.PageCount % 10;
            }
            else
            {
                newLoanApplicationViewModel.LastPageItems = 10;
            }

            newLoanApplicationViewModel.CurrentPage = newLoanApplicationListState.CurrentPage;

            if ( newLoanApplicationViewModel.CurrentPage % 10 != 0 )
            {
                newLoanApplicationViewModel.StartPage = ( int )( newLoanApplicationViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( newLoanApplicationViewModel.CurrentPage ) / 10 ) + 1 ) == newLoanApplicationViewModel.PageGroups )
                {
                    newLoanApplicationViewModel.EndPage = ( int )( newLoanApplicationViewModel.CurrentPage / 10 ) * 10 + newLoanApplicationViewModel.LastPageItems;
                    newLoanApplicationViewModel.LastPageDots = true;
                }
                else
                {
                    newLoanApplicationViewModel.EndPage = ( int )( newLoanApplicationViewModel.CurrentPage / 10 ) * 10 + 10;
                    newLoanApplicationViewModel.LastPageDots = false;
                }
            }
            else
            {
                newLoanApplicationViewModel.StartPage = ( int )( ( newLoanApplicationViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( newLoanApplicationViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == newLoanApplicationViewModel.PageGroups )
                {
                    newLoanApplicationViewModel.EndPage = ( int )( newLoanApplicationViewModel.CurrentPage / 10 ) * 10;
                    newLoanApplicationViewModel.LastPageDots = true;
                }
                else
                {
                    newLoanApplicationViewModel.EndPage = ( int )( ( newLoanApplicationViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    newLoanApplicationViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( NewLoanApplicationViewModel newLoanApplicationViewModel )
        {
            if ( newLoanApplicationViewModel.NewLoanApplicationViewItems != null )
            {
                // Business rule
                foreach ( var newLoanApplicationItem in newLoanApplicationViewModel.NewLoanApplicationViewItems)
                {
                    foreach ( var item in newLoanApplicationItem.NewLoanApplicationViewItems)
                    {
                        if (item.LockExpiration < DateTime.Now && item.LockExpiration != DateTime.MinValue)
                        {
                            item.ClassCollection = "newloanapplicationtablelistduedate";
                        }
                        else
                        {
                            item.ClassCollection = "newloanapplicationtablelist";
                        }

                        if (item.ExceptionItemMaxWeight != -1)
                        {
                            item.ExceptionClassCollection = item.ExceptionItemMaxWeight < 300
                                ? "exceptionIcon exceptionIcon0"
                                : "exceptionIcon exceptionIcon1";
                        }
                        if ( item == newLoanApplicationItem.NewLoanApplicationViewItems.First() )
                        {
                            item.ClassCollection = item.ClassCollection + " first last";
                        }

                        if ( item == newLoanApplicationItem.NewLoanApplicationViewItems.Last() )
                        {
                            item.ClassCollection = item.ClassCollection + " last";
                        }
                    }
                }
            }
        }
    }
}
