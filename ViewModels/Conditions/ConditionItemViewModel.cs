using System;
using System.Xml.Serialization;
using MML.Contracts;
using System.Collections.Generic;
using MML.iMP.DocumentVault.Contracts;

namespace MML.Web.LoanCenter.ViewModels.Conditions
{
    [XmlType]
    [Serializable]
    public class ConditionItemViewModel
    {
        public Guid CurativeItemId { get; set; }
        public string Description { get; set; }
        public ConditionsDocument Document { get; set; }
        public ForConditionMenuModel For { get; set; }
        public EnumerationValue Item { get; set; }
        public EnumerationValue Status { get; set; }
        public UserInfo UpdatedBy { get; set; }
        public String UpdatedDate { get; set; }
        public string LastUpdated { get; set; }
        public bool CommentHistoryExists { get; set; }
        public bool IsRemoved { get; set; }
        public bool PreviouslyAdded { get; set; }
        public int UserAccountCreatedId { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime DueDate { get; set; }
        public List<CurativeItemNote> Notes { get; set; }
        public Guid RepositoryId { get; set; }
        public bool HistoryExists { get; set; }

    }
}
