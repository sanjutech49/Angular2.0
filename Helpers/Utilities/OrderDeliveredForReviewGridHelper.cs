using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class OrderDeliveredForReviewGridHelper
    {
        public static void ProcessPagingOptions( OrderDeliveredForReviewListState orderDeliveredForReviewListState, OrderDeliveredForReviewViewModel orderDeliveredForReviewViewModel )
        {
            if ( orderDeliveredForReviewViewModel.PageCount % 10 == 0 )
            {
                orderDeliveredForReviewViewModel.PageGroups = ( orderDeliveredForReviewViewModel.PageCount / 10 );
            }
            else
            {
                orderDeliveredForReviewViewModel.PageGroups = ( orderDeliveredForReviewViewModel.PageCount / 10 ) + 1;
            }

            orderDeliveredForReviewViewModel.PageGroups = ( int )orderDeliveredForReviewViewModel.PageGroups;
            if ( orderDeliveredForReviewViewModel.PageCount % 10 != 0 )
            {
                orderDeliveredForReviewViewModel.LastPageItems = orderDeliveredForReviewViewModel.PageCount % 10;
            }
            else
            {
                orderDeliveredForReviewViewModel.LastPageItems = 10;
            }

            orderDeliveredForReviewViewModel.CurrentPage = orderDeliveredForReviewListState.CurrentPage;

            if ( orderDeliveredForReviewViewModel.CurrentPage % 10 != 0 )
            {
                orderDeliveredForReviewViewModel.StartPage = ( int )( orderDeliveredForReviewViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( orderDeliveredForReviewViewModel.CurrentPage ) / 10 ) + 1 ) == orderDeliveredForReviewViewModel.PageGroups )
                {
                    orderDeliveredForReviewViewModel.EndPage = ( int )( orderDeliveredForReviewViewModel.CurrentPage / 10 ) * 10 + orderDeliveredForReviewViewModel.LastPageItems;
                    orderDeliveredForReviewViewModel.LastPageDots = true;
                }
                else
                {
                    orderDeliveredForReviewViewModel.EndPage = ( int )( orderDeliveredForReviewViewModel.CurrentPage / 10 ) * 10 + 10;
                    orderDeliveredForReviewViewModel.LastPageDots = false;
                }
            }
            else
            {
                orderDeliveredForReviewViewModel.StartPage = ( int )( ( orderDeliveredForReviewViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( orderDeliveredForReviewViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == orderDeliveredForReviewViewModel.PageGroups )
                {
                    orderDeliveredForReviewViewModel.EndPage = ( int )( orderDeliveredForReviewViewModel.CurrentPage / 10 ) * 10;
                    orderDeliveredForReviewViewModel.LastPageDots = true;
                }
                else
                {
                    orderDeliveredForReviewViewModel.EndPage = ( int )( ( orderDeliveredForReviewViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    orderDeliveredForReviewViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( OrderDeliveredForReviewViewModel orderDeliveredForReviewViewModel )
        {
            if ( orderDeliveredForReviewViewModel.DeliveredForReviewOrders != null )
            {
                foreach ( var item in orderDeliveredForReviewViewModel.DeliveredForReviewOrders )
                {
                    item.ClassCollection = "orderdeliveredforreviewtablelist";

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