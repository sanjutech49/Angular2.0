using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class PipelineGridHelper
    {
        public static void ProcessPagingOptions( PipelineListState pipelineListState, PipelineViewModel pipelineViewModel )
        {
            if ( pipelineViewModel.PageCount % 10 == 0 )
            {
                pipelineViewModel.PageGroups = ( pipelineViewModel.PageCount / 10 );
            }
            else
            {
                pipelineViewModel.PageGroups = ( pipelineViewModel.PageCount / 10 ) + 1;
            }

            pipelineViewModel.PageGroups = ( int )pipelineViewModel.PageGroups;
            if ( pipelineViewModel.PageCount % 10 != 0 )
            {
                pipelineViewModel.LastPageItems = pipelineViewModel.PageCount % 10;
            }
            else
            {
                pipelineViewModel.LastPageItems = 10;
            }

            pipelineViewModel.CurrentPage = pipelineListState.CurrentPage;

            if ( pipelineViewModel.CurrentPage % 10 != 0 )
            {
                pipelineViewModel.StartPage = ( int )( pipelineViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( pipelineViewModel.CurrentPage ) / 10 ) + 1 ) == pipelineViewModel.PageGroups )
                {
                    pipelineViewModel.EndPage = ( int )( pipelineViewModel.CurrentPage / 10 ) * 10 + pipelineViewModel.LastPageItems;
                    pipelineViewModel.LastPageDots = true;
                }
                else
                {
                    pipelineViewModel.EndPage = ( int )( pipelineViewModel.CurrentPage / 10 ) * 10 + 10;
                    pipelineViewModel.LastPageDots = false;
                }
            }
            else
            {
                pipelineViewModel.StartPage = ( int )( ( pipelineViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( pipelineViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == pipelineViewModel.PageGroups )
                {
                    pipelineViewModel.EndPage = ( int )( pipelineViewModel.CurrentPage / 10 ) * 10;
                    pipelineViewModel.LastPageDots = true;
                }
                else
                {
                    pipelineViewModel.EndPage = ( int )( ( pipelineViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    pipelineViewModel.LastPageDots = false;
                }
            }
        }

        public static void ApplyClassCollection( PipelineViewModel pipelineViewModel )
        {
            if ( pipelineViewModel.PipelineItems != null )
            {
                // Business rule
                foreach ( var pipelineItem in pipelineViewModel.PipelineItems )
                {
                    foreach (var item in pipelineItem.PipelineViewItems)
                    {
                        if ( item.LockExpiration < DateTime.Now && item.LockExpiration != DateTime.MinValue && ( item.LockStatus == -1 || ( LockStatus )item.LockStatus != LockStatus.LockRequested ) )
                        {
                            item.ClassCollection = "pipelinetablelistduedate";
                        }
                        else
                        {
                            item.ClassCollection = "pipelinetablelist";
                        }

                        if (item.ExceptionItemMaxWeight != -1)
                        {
                            item.ExceptionClassCollection = item.ExceptionItemMaxWeight < 300
                                ? "exceptionIcon exceptionIcon0"
                                : "exceptionIcon exceptionIcon1";
                        }

                        if ( item == pipelineItem.PipelineViewItems.First() )
                        {
                            item.ClassCollection = item.ClassCollection + " first last";
                        }

                        if ( item == pipelineItem.PipelineViewItems.Last() )
                        {
                            item.ClassCollection = item.ClassCollection +" last";
                        }
                    }
                }
            }
        }
    }
}
