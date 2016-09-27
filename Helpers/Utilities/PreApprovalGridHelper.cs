using MML.Web.LoanCenter.ViewModels;
using System.Linq;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class PreApprovalGridHelper
    {
        public static void ProcessPagingOptions( PreApprovalListState preApprovalListState, PreApprovalViewModel preApprovalViewModel )
        {
            if ( preApprovalViewModel.PageCount % 10 == 0 )
            {
                preApprovalViewModel.PageGroups = ( preApprovalViewModel.PageCount / 10 );
            }
            else
            {
                preApprovalViewModel.PageGroups = ( preApprovalViewModel.PageCount / 10 ) + 1;
            }

            preApprovalViewModel.PageGroups = ( int )preApprovalViewModel.PageGroups;
            if ( preApprovalViewModel.PageCount % 10 != 0 )
            {
                preApprovalViewModel.LastPageItems = preApprovalViewModel.PageCount % 10;
            }
            else
            {
                preApprovalViewModel.LastPageItems = 10;
            }

            preApprovalViewModel.CurrentPage = preApprovalListState.CurrentPage;

            if ( preApprovalViewModel.CurrentPage % 10 != 0 )
            {
                preApprovalViewModel.StartPage = ( int )( preApprovalViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( preApprovalViewModel.CurrentPage ) / 10 ) + 1 ) == preApprovalViewModel.PageGroups )
                {
                    preApprovalViewModel.EndPage = ( int )( preApprovalViewModel.CurrentPage / 10 ) * 10 + preApprovalViewModel.LastPageItems;
                    preApprovalViewModel.LastPageDots = true;
                }
                else
                {
                    preApprovalViewModel.EndPage = ( int )( preApprovalViewModel.CurrentPage / 10 ) * 10 + 10;
                    preApprovalViewModel.LastPageDots = false;
                }
            }
            else
            {
                preApprovalViewModel.StartPage = ( int )( ( preApprovalViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( preApprovalViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == preApprovalViewModel.PageGroups )
                {
                    preApprovalViewModel.EndPage = ( int )( preApprovalViewModel.CurrentPage / 10 ) * 10;
                    preApprovalViewModel.LastPageDots = true;
                }
                else
                {
                    preApprovalViewModel.EndPage = ( int )( ( preApprovalViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    preApprovalViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( PreApprovalViewModel preApprovalViewModel )
        {
            if ( preApprovalViewModel.PreApprovalItems != null )
            {
                // Business rule
                foreach ( var item in preApprovalViewModel.PreApprovalItems )
                {
                    foreach ( var preApprovalItem in item.PreApprovalViewItems )
                    {
                        preApprovalItem.ClassCollection = "preapprovaltablelist";

                        if ( preApprovalItem.ExceptionItemMaxWeight != -1 )
                        {
                            preApprovalItem.ExceptionClassCollection = preApprovalItem.ExceptionItemMaxWeight < 300
                                                                ? "exceptionIcon exceptionIcon0"
                                                                : "exceptionIcon exceptionIcon1";
                        }

                        if ( preApprovalItem == item.PreApprovalViewItems.First() )
                        {
                            preApprovalItem.ClassCollection = preApprovalItem.ClassCollection + " first last";
                        }

                        if ( preApprovalItem == item.PreApprovalViewItems.Last() )
                        {
                            preApprovalItem.ClassCollection = preApprovalItem.ClassCollection + " last";
                        }
                    }
                }
            }
        }
    }
}
