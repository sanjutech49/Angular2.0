using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using Telerik.Web.Mvc.UI;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class AppraisalDocumentsHelper
    {
        public AppraisalViewModel GetAppraisalDocuments( Guid loanId, int userAccountId, ref AppraisalViewModel userAppraisalViewModel )
        {
            try
            {
                List<DocumentCategory> documentCategories = DocumentsServiceFacade.RetrieveDocumentCategoriesForClass( DocumentClass.VariousDocuments, loanId, userAccountId );
                if ( documentCategories == null )
                    documentCategories = new List<DocumentCategory>();

                List<DocumentCategory> otherDocumentsCategories = DocumentsServiceFacade.RetrieveDocumentCategoriesForClass( DocumentClass.OtherDocuments, loanId, userAccountId );
                if ( otherDocumentsCategories != null && otherDocumentsCategories.Where( x => x.IsAppraisalDocument ) != null )
                    documentCategories.AddRange( otherDocumentsCategories.Where( x => x.IsAppraisalDocument ).ToList() );

                var listItems = new List<DropDownItem>();
                foreach ( DocumentCategory document in documentCategories )
                {
                    listItems.Add( new DropDownItem()
                    {
                        Selected = false,
                        Text = document.Name,
                        Value = document.DocumentCategoryId.ToString()
                    } );
                }

                userAppraisalViewModel.DocumentCategoryTypes = listItems;

                List<MML.Contracts.Document> documents = DocumentsServiceFacade.RetrieveLenderXDocuments( loanId, DocumentRole.Concierge, userAccountId );
                if ( documents != null )
                {
                    var tempDoc = documents.Where( x => x.Files != null && x.Files.Count > 0 && documentCategories.Contains( x.DocumentCategory ) );
                    if ( tempDoc != null )
                        documents = tempDoc.ToList();

                    foreach ( MML.Contracts.Document document in documents )
                    {
                        if ( document.Files.Where( x => x.LenderXFile != null ).Count() < document.Files.Count )
                        {
                            foreach ( UploadedFile file in document.Files )
                            {
                                if ( file.LenderXFile == null )
                                    file.LenderXFile = new LenderXFile();
                            }
                        }
                    }

                    userAppraisalViewModel.Documents = documents.OrderBy( x => x.Name ).ToList();
                }

                return userAppraisalViewModel;
            }
            catch ( Exception )
            {

                throw;
            }
        }
    }
}