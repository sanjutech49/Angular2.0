using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class OrderRequestedGridHelper
    {
        public static void ProcessPagingOptions( OrderRequestedListState orderRequestedListState, OrderRequestedViewModel orderRequestedViewModel )
        {
            if ( orderRequestedViewModel.PageCount % 10 == 0 )
            {
                orderRequestedViewModel.PageGroups = ( orderRequestedViewModel.PageCount / 10 );
            }
            else
            {
                orderRequestedViewModel.PageGroups = ( orderRequestedViewModel.PageCount / 10 ) + 1;
            }

            orderRequestedViewModel.PageGroups = ( int )orderRequestedViewModel.PageGroups;
            if ( orderRequestedViewModel.PageCount % 10 != 0 )
            {
                orderRequestedViewModel.LastPageItems = orderRequestedViewModel.PageCount % 10;
            }
            else
            {
                orderRequestedViewModel.LastPageItems = 10;
            }

            orderRequestedViewModel.CurrentPage = orderRequestedListState.CurrentPage;

            if ( orderRequestedViewModel.CurrentPage % 10 != 0 )
            {
                orderRequestedViewModel.StartPage = ( int )( orderRequestedViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( orderRequestedViewModel.CurrentPage ) / 10 ) + 1 ) == orderRequestedViewModel.PageGroups )
                {
                    orderRequestedViewModel.EndPage = ( int )( orderRequestedViewModel.CurrentPage / 10 ) * 10 + orderRequestedViewModel.LastPageItems;
                    orderRequestedViewModel.LastPageDots = true;
                }
                else
                {
                    orderRequestedViewModel.EndPage = ( int )( orderRequestedViewModel.CurrentPage / 10 ) * 10 + 10;
                    orderRequestedViewModel.LastPageDots = false;
                }
            }
            else
            {
                orderRequestedViewModel.StartPage = ( int )( ( orderRequestedViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( orderRequestedViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == orderRequestedViewModel.PageGroups )
                {
                    orderRequestedViewModel.EndPage = ( int )( orderRequestedViewModel.CurrentPage / 10 ) * 10;
                    orderRequestedViewModel.LastPageDots = true;
                }
                else
                {
                    orderRequestedViewModel.EndPage = ( int )( ( orderRequestedViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    orderRequestedViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( OrderRequestedViewModel orderRequestedViewModel )
        {
            if ( orderRequestedViewModel.RequestedOrders != null )
            {
                foreach ( var item in orderRequestedViewModel.RequestedOrders )
                {
                    item.ClassCollection = "orderrequestedtablelist";

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