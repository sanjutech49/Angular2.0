using System;
using System.Collections.Generic;
using System.Text;
using MML.Common;
using MML.Contracts;

namespace MML.Web.Borrower.Helpers
{
    [Serializable]
    public class UploadedDocument
    {
        public UploadedDocument()
        {
            this.UploadedDocumentId = Guid.NewGuid();
            this.DocumentIds = new List<Guid>();
        }

        public Guid UploadedDocumentId
        {
            get;
            set;
        }

        public List<Guid> DocumentIds
        {
            get;
            set;
        }

        public Guid BorrowerId
        {
            get;
            set;
        }

        public FileStoreItem RepositoryItem
        {
            get;
            set;
        }

        public string RepositoryItemFilePath
        {
            get;
            set;
        }
    }
}
