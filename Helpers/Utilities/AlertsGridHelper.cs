using System;
using System.Linq;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class AlertsGridHelper
    {
        public static void ProcessPagingOptions( AlertsListState alertsListState, AlertsViewModel alertsViewModel )
        {
            if ( alertsViewModel.PageCount % 10 == 0 )
            {
                alertsViewModel.PageGroups = ( alertsViewModel.PageCount / 10 );
            }
            else
            {
                alertsViewModel.PageGroups = ( alertsViewModel.PageCount / 10 ) + 1;
            }

            alertsViewModel.PageGroups = ( int )alertsViewModel.PageGroups;
            if ( alertsViewModel.PageCount % 10 != 0 )
            {
                alertsViewModel.LastPageItems = alertsViewModel.PageCount % 10;
            }
            else
            {
                alertsViewModel.LastPageItems = 10;
            }

            alertsViewModel.CurrentPage = alertsListState.CurrentPage;

            if ( alertsViewModel.CurrentPage % 10 != 0 )
            {
                alertsViewModel.StartPage = ( int )( alertsViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( alertsViewModel.CurrentPage ) / 10 ) + 1 ) == alertsViewModel.PageGroups )
                {
                    alertsViewModel.EndPage = ( int )( alertsViewModel.CurrentPage / 10 ) * 10 + alertsViewModel.LastPageItems;
                    alertsViewModel.LastPageDots = true;
                }
                else
                {
                    alertsViewModel.EndPage = ( int )( alertsViewModel.CurrentPage / 10 ) * 10 + 10;
                    alertsViewModel.LastPageDots = false;
                }
            }
            else
            {
                alertsViewModel.StartPage = ( int )( ( alertsViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( alertsViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == alertsViewModel.PageGroups )
                {
                    alertsViewModel.EndPage = ( int )( alertsViewModel.CurrentPage / 10 ) * 10;
                    alertsViewModel.LastPageDots = true;
                }
                else
                {
                    alertsViewModel.EndPage = ( int )( ( alertsViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    alertsViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( AlertsViewModel alertsViewModel )
        {
            if ( alertsViewModel.AlertItems != null )
            {
                // Business rule
                foreach ( var alertItem in alertsViewModel.AlertItems )
                {
                    foreach ( var item in alertItem.AlertViewItems )
                    {
                        if ( item.LockExpiration < DateTime.Now && item.LockExpiration != DateTime.MinValue )
                        {
                            item.ClassCollection = "alerttablelistduedate";
                        }
                        else
                        {
                            item.ClassCollection = "alerttablelist";
                        }

                        if ( item.ExceptionItemMaxWeight != -1 )
                        {
                            item.ExceptionClassCollection = item.ExceptionItemMaxWeight < 300
                                ? "exceptionIcon exceptionIcon0"
                                : "exceptionIcon exceptionIcon1";
                        }
                        if ( item == alertItem.AlertViewItems.First() )
                        {
                            item.ClassCollection = item.ClassCollection + " first last";
                        }

                        if ( item == alertItem.AlertViewItems.Last() )
                        {
                            item.ClassCollection = item.ClassCollection + " last";
                        }

                    }
                }
            }
        }
    }
}
