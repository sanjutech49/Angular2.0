using System;

namespace MML.Web.LoanCenter.ViewModels
{
    [Serializable]
    public class ConditionsDocument
    {
        public string DocumentId { get; set; }
        public int CategoryId { get; set; }
        public string Category { get; set; }
        public string CategorySortName { get; set; }
        public string OriginalCategory { get; set; }
        public string Name { get; set; }
        public string UploadedBy { get; set; }
        public string UploadedDate { get; set; } 
        public string LastUpdated { get; set; }
        public Guid RepositoryId { get; set; }
        public bool Excluded { get; set; }
        public long DocumentTypeId { get; set; }
        public long OriginalDocumentTypeId { get; set; }
        public int SortOrder { get; set; }
        public bool Rejected { get; set; }
        public string BorrowerNames { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string Description { get; set; }
        public string NamingConvention { get; set; }
    }
}
