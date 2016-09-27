using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class OrderProcessedGridHelper
    {
        public static void ProcessPagingOptions( OrderProcessedListState orderProcessedListState, OrderProcessedViewModel orderProcessedViewModel )
        {
            if ( orderProcessedViewModel.PageCount % 10 == 0 )
            {
                orderProcessedViewModel.PageGroups = ( orderProcessedViewModel.PageCount / 10 );
            }
            else
            {
                orderProcessedViewModel.PageGroups = ( orderProcessedViewModel.PageCount / 10 ) + 1;
            }

            orderProcessedViewModel.PageGroups = ( int )orderProcessedViewModel.PageGroups;
            if ( orderProcessedViewModel.PageCount % 10 != 0 )
            {
                orderProcessedViewModel.LastPageItems = orderProcessedViewModel.PageCount % 10;
            }
            else
            {
                orderProcessedViewModel.LastPageItems = 10;
            }

            orderProcessedViewModel.CurrentPage = orderProcessedListState.CurrentPage;

            if ( orderProcessedViewModel.CurrentPage % 10 != 0 )
            {
                orderProcessedViewModel.StartPage = ( int )( orderProcessedViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( orderProcessedViewModel.CurrentPage ) / 10 ) + 1 ) == orderProcessedViewModel.PageGroups )
                {
                    orderProcessedViewModel.EndPage = ( int )( orderProcessedViewModel.CurrentPage / 10 ) * 10 + orderProcessedViewModel.LastPageItems;
                    orderProcessedViewModel.LastPageDots = true;
                }
                else
                {
                    orderProcessedViewModel.EndPage = ( int )( orderProcessedViewModel.CurrentPage / 10 ) * 10 + 10;
                    orderProcessedViewModel.LastPageDots = false;
                }
            }
            else
            {
                orderProcessedViewModel.StartPage = ( int )( ( orderProcessedViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( orderProcessedViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == orderProcessedViewModel.PageGroups )
                {
                    orderProcessedViewModel.EndPage = ( int )( orderProcessedViewModel.CurrentPage / 10 ) * 10;
                    orderProcessedViewModel.LastPageDots = true;
                }
                else
                {
                    orderProcessedViewModel.EndPage = ( int )( ( orderProcessedViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    orderProcessedViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( OrderProcessedViewModel orderProcessedViewModel )
        {
            if ( orderProcessedViewModel.ProcessedOrders != null )
            {
                foreach ( var item in orderProcessedViewModel.ProcessedOrders )
                {
                    item.ClassCollection = "orderprocessedtablelist";

                    if ( item.ExceptionItemMaxWeight != -1 )
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