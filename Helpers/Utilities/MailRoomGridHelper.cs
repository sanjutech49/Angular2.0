using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class MailRoomGridHelper
    {
        public static void ProcessPagingOptions( MailRoomListState mailRoomListState, MailRoomViewModel mailRoomViewModel )
        {
            if ( mailRoomViewModel.PageCount % 10 == 0 )
            {
                mailRoomViewModel.PageGroups = ( mailRoomViewModel.PageCount / 10 );
            }
            else
            {
                mailRoomViewModel.PageGroups = ( mailRoomViewModel.PageCount / 10 ) + 1;
            }

            mailRoomViewModel.PageGroups = ( int )mailRoomViewModel.PageGroups;
            if ( mailRoomViewModel.PageCount % 10 != 0 )
            {
                mailRoomViewModel.LastPageItems = mailRoomViewModel.PageCount % 10;
            }
            else
            {
                mailRoomViewModel.LastPageItems = 10;
            }

            mailRoomViewModel.CurrentPage = mailRoomListState.CurrentPage;

            if ( mailRoomViewModel.CurrentPage % 10 != 0 )
            {
                mailRoomViewModel.StartPage = ( int )( mailRoomViewModel.CurrentPage / 10 ) * 10 + 1;
                if ( ( ( int )( ( mailRoomViewModel.CurrentPage ) / 10 ) + 1 ) == mailRoomViewModel.PageGroups )
                {
                    mailRoomViewModel.EndPage = ( int )( mailRoomViewModel.CurrentPage / 10 ) * 10 + mailRoomViewModel.LastPageItems;
                    mailRoomViewModel.LastPageDots = true;
                }
                else
                {
                    mailRoomViewModel.EndPage = ( int )( mailRoomViewModel.CurrentPage / 10 ) * 10 + 10;
                    mailRoomViewModel.LastPageDots = false;
                }
            }
            else
            {
                mailRoomViewModel.StartPage = ( int )( ( mailRoomViewModel.CurrentPage - 1 ) / 10 ) * 10 + 1;
                if ( ( ( int )( ( mailRoomViewModel.CurrentPage - 1 ) / 10 ) + 1 ) == mailRoomViewModel.PageGroups )
                {
                    mailRoomViewModel.EndPage = ( int )( mailRoomViewModel.CurrentPage / 10 ) * 10;
                    mailRoomViewModel.LastPageDots = true;
                }
                else
                {
                    mailRoomViewModel.EndPage = ( int )( ( mailRoomViewModel.CurrentPage - 1 ) / 10 ) * 10 + 10;
                    mailRoomViewModel.LastPageDots = false;
                }
            }
        }

        //public static void ApplyClassCollection( MailRoomViewModel mailRoomViewModel )
        //{
        //    if ( mailRoomViewModel.MailRoomItems != null )
        //    {
        //        // Business rule
        //        foreach ( var item in mailRoomViewModel.MailRoomItems )
        //        {
        //            if ( item.LockExpiration < DateTime.Now && item.LockExpiration != DateTime.MinValue && ( item.LockStatus == -1 || (LockStatus)item.LockStatus != LockStatus.LockRequested ))
        //            {
        //                item.ClassCollection = "mailroomtablelistduedate";
        //            }
        //            else
        //            {
        //                item.ClassCollection = "mailroomtablelist";
        //            }

        //            if ( item.ExceptionItemMaxWeight != -1 )
        //            {
        //                item.ExceptionClassCollection = item.ExceptionItemMaxWeight < 300
        //                                                    ? "exceptionIcon exceptionIcon0"
        //                                                    : "exceptionIcon exceptionIcon1";
        //            }
        //        }
        //    }
        //}

        public static void ChangeStatusesForDocumentsToSent(Guid loanId, int userAccountId, DocumentClass documentClass)
        {
            DocumentsServiceFacade documentsServiceFacade = new DocumentsServiceFacade();

            List<UploadedFile> listOfUploadedFiles = null;

            if ( documentClass.Equals( DocumentClass.LoanDisclosuresPackage ) )
            {
                listOfUploadedFiles = documentsServiceFacade.RetrieveUploadedFilesByDocumentClass( ( int )DocumentClass.LoanDisclosuresPackage, loanId );
                listOfUploadedFiles.AddRange( documentsServiceFacade.RetrieveUploadedFilesByDocumentClass( ( int )DocumentClass.InitialDisclosuresMailingCoverLetter, loanId ) );
                listOfUploadedFiles.AddRange( documentsServiceFacade.RetrieveUploadedFilesByDocumentClass( ( int )DocumentClass.AuthorizationsPackage, loanId ) );
            }

            if ( documentClass.Equals( DocumentClass.LoanReDisclosuresPackage ) )
            {
                listOfUploadedFiles = documentsServiceFacade.RetrieveUploadedFilesByDocumentClass( ( int )DocumentClass.LoanReDisclosuresPackage, loanId );
                listOfUploadedFiles.AddRange( documentsServiceFacade.RetrieveUploadedFilesByDocumentClass( ( int )DocumentClass.ReDisclosuresMailingCoverLetter, loanId ) );
            }
            
            if ( listOfUploadedFiles != null && listOfUploadedFiles.Any() )
            {
                List<UploadedFile> listOfUploadedFilesForChangeStatus = new List<UploadedFile>();

                if ( listOfUploadedFiles.Any( f => f.CurrentStatus == UploadedFileStatus.Delivered ) )
                    listOfUploadedFilesForChangeStatus = listOfUploadedFiles.Where( f => f.CurrentStatus == UploadedFileStatus.Delivered ).ToList();

                for ( int i = 0; i < listOfUploadedFilesForChangeStatus.Count; i++ )
                {
                    if ( i == 0 )
                        DocumentsServiceFacade.ChangeUploadedFileStatus( loanId, listOfUploadedFilesForChangeStatus[ i ].UploadedFileId, UploadedFileStatus.Sent, userAccountId, true );
                    else
                        DocumentsServiceFacade.ChangeUploadedFileStatus( loanId, listOfUploadedFilesForChangeStatus[ i ].UploadedFileId, UploadedFileStatus.Sent, userAccountId, false );
                }
            }
           
        }
    }
}
