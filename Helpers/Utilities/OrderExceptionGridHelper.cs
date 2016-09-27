using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class OrderExceptionGridHelper
    {
        public static void ProcessPagingOptions( OrderExceptionListState orderExceptionListState, OrderExceptionViewModel orderExceptionViewModel )
        {
            if ( orderExceptionViewModel.PageCount % 10 == 0 )
            {
                orderExceptionViewModel.PageGroups = ( orderExceptionViewModel.PageCount / 10 );
            }
            else
            {
                orderExceptionViewModel.PageGroups = ( orderExceptionViewModel.PageCount / 10 ) + 1;
            }

            orderExceptionViewModel.PageGroups = ( int )orderExceptionViewModel.PageGroups;
            if ( orderExceptionViewModel.PageCount % 10 != 0 )
            {
                orderExceptionViewModel.LastPageItems = orderExceptionViewModel.PageCount % 10;
            }
            else
            {
                orderExceptionViewModel.LastPageItems = 10;
            }

            orderExceptionViewModel.CurrentPage = orderExceptionListState.CurrentPage;

            if ( orderExceptionViewModel.CurrentPage % 10 != 0 )
            {
                orderExceptionViewModel.StartPage = ( int )( orderExceptionViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( orderExceptionViewModel.CurrentPage ) / 10 ) + 1 ) == orderExceptionViewModel.PageGroups )
                {
                    orderExceptionViewModel.EndPage = ( int )( orderExceptionViewModel.CurrentPage / 10 ) * 10 + orderExceptionViewModel.LastPageItems;
                    orderExceptionViewModel.LastPageDots = true;
                }
                else
                {
                    orderExceptionViewModel.EndPage = ( int )( orderExceptionViewModel.CurrentPage / 10 ) * 10 + 10;
                    orderExceptionViewModel.LastPageDots = false;
                }
            }
            else
            {
                orderExceptionViewModel.StartPage = ( int )( ( orderExceptionViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( orderExceptionViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == orderExceptionViewModel.PageGroups )
                {
                    orderExceptionViewModel.EndPage = ( int )( orderExceptionViewModel.CurrentPage / 10 ) * 10;
                    orderExceptionViewModel.LastPageDots = true;
                }
                else
                {
                    orderExceptionViewModel.EndPage = ( int )( ( orderExceptionViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    orderExceptionViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( OrderExceptionViewModel orderExceptionViewModel )
        {
            if ( orderExceptionViewModel.Exceptions != null )
            {
                foreach ( var item in orderExceptionViewModel.Exceptions )
                {
                    item.ClassCollection = "orderexceptiontablelist";

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